# -*- coding: utf-8 -*-

# Sample Python code for youtube.videos.list
# See instructions for running these code samples locally:
# https://developers.google.com/explorer-help/guides/code_samples#python

# for testing, get page of 50 results for each category
# parse comments, pre-process, then put through deepmoji score_emojis classifier
# cluster using k-means
# once successful, integrate with mongodb database

import os
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import sqlite3

conn1 = sqlite3.connect(
    "youtube-data.db")

conn2 = sqlite3.connect(
    "/home/beth/PycharmProjects/torchMoji3/examples/youtubeComments.db")

scopes = ["https://www.googleapis.com/auth/youtube.readonly"]


def get_video_id():
    c1 = conn1.cursor()
    c2 = conn2.cursor()

    # Disable OAuthlib's HTTPS verification when running locally.
    # *DO NOT* leave this option enabled in production.
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    api_service_name = "youtube"
    api_version = "v3"
    client_secrets_file = "client_secret.json"  # make sure to make new client secret

    # Get credentials and create an API client
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        client_secrets_file, scopes)
    credentials = flow.run_console()
    youtube = googleapiclient.discovery.build(
        api_service_name, api_version, credentials=credentials)

    c2.execute(
        "CREATE TABLE IF NOT EXISTS ytidlist (categoryID text, videoID text)")


    c1.execute("SELECT categoryID FROM main.ytcategorylist ")

    catid_arr = c1.fetchall()
    for r in catid_arr:
        request = youtube.videos().list(
            part="id",
            chart="mostPopular",
            maxResults=50,
            regionCode="CA",
            videoCategoryId=r[0]
        )
        response = request.execute()

        for itr in response['items']:
            params = (r[0], itr["id"], r[2])
            c2.execute("insert into ytidlist values (?, ?, ?)", params)
    conn2.commit()



def main():
    get_video_id()


if __name__ == "__main__":
    main()
