# This module retrieves a list of video ID's from the database
# Retrieves their comments using the youtube API
    # Inserts the comments and their replies into the database
# Then feeds the comments into a model for prediction
# Finally it updates the results into the "Values" column of the Videos table
import os
import google_auth_oauthlib
import googleapiclient
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import psycopg2
import model_prod

# request video data from youtube
def video_request(video_id):
    request = youtube.commentThreads().list(
        part="snippet,replies",
        textFormat="plainText",
        videoId=video_id,
        order="relevance", # this gives higher quality comments and also comments with more replies
        maxResults = 100 # the highest maxResults can be is 100
    )
    return request

# retrieve comments from youtube API response, store them in a string, while also inserting into database
def retrieve_comments(response):
    raw_text = ""
    for item in response['items']:
        comments = [item['snippet']['topLevelComment']]
        if 'replies' in item: # most comments have no replies so check first
            comments += item['replies']['comments']
        for comment in comments:
            raw_text += comment['snippet']['textOriginal']
            # sometimes youtube just doesn't return the needed data, so ignore it
            try: insert_comment(comment)
            except Exception as e: print("Error while inserting comment: {}".format(e))
    return raw_text

# insert a comment object from youtube API response into the database
# note 16 columns in comments table, many of which have to be error checked
def insert_comment(comment):
    global cur
    sql = "INSERT INTO comments VALUES("+"{}, "*15+"{})" 
    snippet = comment['snippet']

    # handle troublesome fields
    parentId = snippet['parentId'] if 'parentId' in snippet else ""
    mod_status = snippet['moderationStatus'] if 'moderationStatus' in snippet else ""
    
    sql = sql.format(quotes(comment['id']), quotes(snippet['videoId']), quotes(snippet['authorDisplayName']),
        quotes(snippet['authorProfileImageUrl']), quotes(snippet['authorChannelUrl']),
        quotes(snippet['authorChannelId']['value']), "''", #channel ID shouldn't be needed anyway
        quotes(snippet['textDisplay']), quotes(snippet['textOriginal']), quotes(parentId),
        snippet['canRate'], quotes(snippet['viewerRating']), snippet['likeCount'],
        quotes(mod_status), quotes(snippet['publishedAt']), quotes(snippet['updatedAt']))
    cur.execute(sql)

# Add quotations to text variables (and escape apostrophes from comments)
def quotes(text):
    return "'" + str(text).replace("'", "''") + "'"  # in sql '' is an escaped apostrophe

# Connect to database
with open("postgresql_password.txt", "r") as file:
    password = file.read()
    
conn = psycopg2.connect(host="192.168.1.102",
    database="valuetube",
    port="5432",
    user="liamdb",
    password=password)
cur = conn.cursor()
cur.execute("delete from comments")

# Connect to Youtube API
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]
api_service_name = "youtube"
api_version = "v3"
client_secrets_file = "client_secret.json"
flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(client_secrets_file, scopes)
credentials = flow.run_console()
youtube = googleapiclient.discovery.build(api_service_name, api_version, credentials=credentials)

# Retrieve comments from youtube and upload to database
cur.execute("select videoid from videos")
video_ids = cur.fetchall()
vid_comments = [] # stores a tuple of (videoid, all the comments of a video in a large string)
for video_id in video_ids:
    # make request
    video_id = video_id[0].strip()
    request = video_request(video_id)
    try:
        response = request.execute()
    except Exception as e:
        print('http error occurred, data entry has been skipped. Check logs for full information.')
        log1 = open(r"error-log-getCommentsThreads.txt","a")
        log1.write('%s \n' % e)
        log1.close()
        continue

    # store comment data locally and on database
    vid_comments.append((video_id, retrieve_comments(response)))

# Build model and make predictions
model = model_prod.Model()
predictions = model.predict(vid_comments) # results is a tuple (videoid, label1, label2, ...)

# Insert predictions into the "videos.values" column of the database
for pred in predictions:
    videoid = pred[0]
    labels = pred[1:]
    values_matrix = "(" + ",".join(map(str, labels)) + ")::values_matrix"
    cur.execute("UPDATE videos SET values = {} WHERE videoid = {}".format(values_matrix, quotes(videoid)))

# Close database connection
conn.commit()
cur.close()
conn.close()
