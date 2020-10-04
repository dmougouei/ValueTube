# stores the videos, labels and comments from them in the youtubeComments database
# so they can be used as a training set later
import sqlite3
import pandas as pd
import numpy as np
import youtube_api_requests

# load the data from the excel file (download it from google drive as a csv)
df = pd.read_csv("ValueTube.csv")
df = df.iloc[:, 3:15] # get the relevant columns
df = df[~df["Coder 1"].isnull()] # get the rows that have been completed
df = df.fillna("Non-Relevant") # any remaining null values are blank spaces in the labels

# create a new table storing videoID and label
c1 = sqlite3.connect("youtubeComments.db")
c1.execute("DROP TABLE IF EXISTS labels")
c1.execute("""CREATE TABLE IF NOT EXISTS labels (videoID text,
           SelfDirection int, Stimulation int, Hedonism int,
           Achievement int, Power int, Security int, Tradition int,
           Conformity int, Benevolence int, Universalism int)""")
for _, row in df.iterrows():
    ID = row["URL"].split("?v=")[1]
    labels = row.iloc[2:] != "Non-Relevant"
    labels = labels.astype(int)
    c1.execute("insert into labels values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [ID] + list(labels))

# clear the ytidlist table and replace it with these videos
c1.execute("DROP TABLE IF EXISTS ytidlist")
c1.execute("CREATE TABLE ytidlist (categoryID text, videoID text)")
for url in df["URL"]:
    ID = url.split("?v=")[1]
    c1.execute("insert into ytidlist values (?, ?)", ["", ID])

# then run youtube-api-requests to get comments for all videos in ytidlist
c1.commit()
c1.close() # close connection to avoid database lock
youtube_api_requests.main()
