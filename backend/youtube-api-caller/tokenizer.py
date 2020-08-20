# get like to dislike ratio by modifying youtube-api-requests.py
import re
import sqlite3
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords


# Load the data from the comments database, returns the tuple (comments, categories)
def load_data():
    # read in the comments for each video from database
    conn1 = sqlite3.connect("youtubeComments.db")
    c1 = conn1.cursor()
    c1.execute("""select c.videoID, textOriginal, categoryID
        from commentsThreads c join ytidlist y on c.videoID = y.videoID
        order by c.videoID""")
    comments = c1.fetchall()

    # using the fact that comments are ordered by videoID perform a manual group by
    # so that videos[i] contains a giant string of all comments on the video
    video_id = comments[0][0]
    video_comments = [""]
    categories = [comments[0][2]] # store category ID of each video to use as a label
    for comment in comments:
        if video_id != comment[0]:
            video_id = comment[0]
            video_comments.append("")
            categories.append(comment[2])
        video_comments[-1] += comment[1] + " "

    return video_comments, categories


# a function that performs preprocessing on the text, removing symbols and stopwords
punctuation_re = re.compile('[/(){}\[\]\|@,;]')
non_alphanumeric_re = re.compile('[^0-9a-z #+_]')
stopwords = set(stopwords.words('english'))
def text_prepare(text):
    text = text.lower()
    text = re.sub(punctuation_re, " ", text)
    text = re.sub(non_alphanumeric_re, "", text)

    # delete stopwords from text
    for word in stopwords:
      text = re.sub('(^|\s+)' + word + '($|\s+)', " ", text)

    # clean up whitespace
    text = text.strip()
    text = re.sub('\s+', ' ', text) # transform all multi spaces into one space
    return text


# convert a scikitlearn sparse matrix to a tensorflow sparse tensor
def convert_to_sparse_tensor(X):
    coo = X.tocoo()
    indices = np.mat([coo.row, coo.col]).transpose()
    return tf.sparse.reorder(tf.sparse.SparseTensor(indices, coo.data, coo.shape))


# create bag of words dataset using the tfidf method
def create_dataset():
    # load data and perform pre-processing
    X, y = load_data()
    comments = list(map(text_prepare, X))
    y = pd.get_dummies(y) # convert y to one hot vectors

    # split into train and test data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2)
    
    # create and train tfidf vectorizer
    tfidf_vectorizer = TfidfVectorizer(min_df = 2/len(comments),
                                       max_df = 0.9,
                                       ngram_range = (1, 2),
                                       token_pattern = '(\S+)')
    tfidf_vectorizer.fit(X_train) # important to only fit on X_train to avoid data leakage

    # apply the vectorizer and then transform the sparse matrix returned to a tensorflow sparse tensor
    # so that tensorflow models can be used
    X_train = convert_to_sparse_tensor(tfidf_vectorizer.transform(X_train))
    X_test = convert_to_sparse_tensor(tfidf_vectorizer.transform(X_test))
    return X_train, X_test, y_train, y_test, tfidf_vectorizer.vocabulary_


# This is only mean to be used by other modules, running as main is for testing only
if __name__ == "__main__":
    X_train, X_test, y_train, y_test, vocabulary = create_dataset()
