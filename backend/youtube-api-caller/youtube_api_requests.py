import os
import sqlite3
import google_auth_oauthlib
import googleapiclient
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import re

# -*- coding: utf-8 -*-

# Sample Python code for youtube.commentThreads.list
# See instructions for running these code samples locally:
# https://developers.google.com/explorer-help/guides/code_samples#python

scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]

conn1 = sqlite3.connect("youtubeComments.db")
conn2 = sqlite3.connect("youtube-data.db")


def main():
    # Reset the commentsThreads table to avoid inserting duplicate data
    # if this script is run multiple times
    c = conn1.cursor()
    c.execute("DROP TABLE IF EXISTS commentsThreads")
    c.execute("CREATE TABLE commentsThreads (videoID text, textOriginal blob)")
    
    getCommentsThreads()
    conn1.close()
    conn2.close()


def getCommentsThreads():
    # Disable OAuthlib's HTTPS verification when running locally.
    # *DO NOT* leave this option enabled in production.
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    api_service_name = "youtube"
    api_version = "v3"
    client_secrets_file = "client_secret.json"

    # Get credentials and create an API client
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        client_secrets_file, scopes)
    credentials = flow.run_console()
    youtube = googleapiclient.discovery.build(
        api_service_name, api_version, credentials=credentials)
    # will request a list of comment threads in items[] array, with id, replies and snippet of comments threads
    c1 = conn1.cursor()
    c1.execute("SELECT DISTINCT videoID FROM main.ytidlist")
    youtubeVideoArray = c1.fetchall()
    print(youtubeVideoArray)
    for video in youtubeVideoArray:
        print(video[0])
        request = youtube.commentThreads().list(
            part="snippet,replies",
            textFormat="plainText",
            videoId="%s" % video[0],
            order="relevance", # this gives higher quality comments and also comments with more replies
            maxResults = 100 # the highest maxResults can be is 100
        )
        try:
            response = request.execute()
        except Exception as e:
            print('http error occurred, data entry has been skipped. Check logs for full information.')
            log1 = open(
                r"error-log-getCommentsThreads.txt",
                "a")
            log1.write('%s \n' % e)
            log1.close()
            continue
        sqliteJsonInsert(video[0].strip(), response)
    conn1.commit()

    
# insert all the comments of a video into the commentsThreads database
def sqliteJsonInsert(videoID, commentObj):
    c = conn1.cursor()
    for item in commentObj['items']:
        comments = [item['snippet']['topLevelComment']]
        if 'replies' in item: # most comments have no replies so check first
            comments += item['replies']['comments']
        
        for comment in comments:
            txtOrg = comment['snippet']['textOriginal']
            c.execute("insert into commentsThreads values (?, ?)", (videoID, txtOrg))
    conn1.commit()


if __name__ == '__main__':
    main()
