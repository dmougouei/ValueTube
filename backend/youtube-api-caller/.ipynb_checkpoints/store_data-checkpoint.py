# stores the videos, labels and comments from them in the youtubeComments database
# so they can be used as a training set later
import sqlite3
import pandas as pd

# load the data from the excel file (download it from google drive as a csv)
df = pd.read_csv("store_data.py")

# create a new table storing videoID and label
# then insert videoIDs into ytidlist
# then run youtube-api-requests to get comments for all videos in ytidlist
# join them in model_experimentation