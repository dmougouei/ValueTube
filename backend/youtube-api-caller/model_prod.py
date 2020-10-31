# A script that provides functions to assemble the training dataset
# And a Model class that can train a model and predict new data
import re
import sqlite3
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Dense, Input
from sklearn.metrics import f1_score
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
    c1.execute("""select c.videoID, textOriginal,
        l.SelfDirection, l.Stimulation, l.Hedonism,
        l.Achievement, l.Power, l.Security, l.Tradition,
        l.Conformity, l.Benevolence, l.Universalism
        from commentsThreads c join labels l on c.videoID = l.videoID
        order by c.videoID""")
    comments = c1.fetchall()

    # using the fact that comments are ordered by videoID perform a manual group by
    # so that videos[i] contains a giant string of all comments on the video
    video_id = comments[0][0]
    video_comments = [""]
    labels = [comments[0][2:]]
    for comment in comments:
        if video_id != comment[0]:
            video_id = comment[0]
            video_comments.append("")
            labels.append(comment[2:])
        video_comments[-1] += comment[1] + " "

    return video_comments, labels

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
    return X_train, X_test, np.array(y_train), np.array(y_test), tfidf_vectorizer

class Model:
    # builds and trains the model, storing the vectorizer for predictions later
    def __init__(self, cutoff=0.2): # cutoff of 0.2 favours precision over recall
        self.cutoff = cutoff
        X_train, X_test, y_train, y_test, self.vectorizer = create_dataset()
        self.train(X_train, y_train)
        val_preds = (self.nn.predict(X_test) > cutoff).astype(int)
        print("Trained model with {} F score".format(f1_score(y_test, val_preds, average="micro")))

    def train(self, X_train, y_train):
        X = Input(shape=(X_train.shape[1], ))
        dense1 = Dense(100, activation = "relu")(X)
        dense2 = Dense(y_train.shape[1], activation = "sigmoid")(dense1) # use sigmoid activation instead of softmax because more than one class can be present
        self.nn = tf.keras.Model(inputs = X, outputs = dense2)

        self.nn.compile(optimizer = "adam", loss = "binary_crossentropy", metrics = ['BinaryAccuracy'])
        self.nn.fit(X_train, y_train, batch_size = 32, epochs = 100, verbose=0)

    # given an array of training samples with columns (videoid, allcomments)
    # make a prediction for each of the videos
    def predict(self, data):
        data = np.array(data)
        features = convert_to_sparse_tensor(self.vectorizer.transform(data[:, 1]))
        preds = (self.nn.predict(features) > self.cutoff).astype(int)
        output = np.concatenate([data[:, 0].reshape(data.shape[1], 1), preds], axis=1) # add indexes to the predictions
        return output

# run a test of the model class
if __name__ == "__main__":
    model = Model()
    data = [(1, """Did you ever hear the tragedy of Darth Plagueis the Wise?
        I thought not. It's not a story the Jedi would tell you. It's a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use the Force to influence the midichlorians to create life...
        He had such a knowledge of the dark side that he could even keep the ones he cared about from dying. The dark side of the Force is a pathway to many abilities some consider to be unnatural.
        He became so powerful... the only thing he was afraid of was losing his power, which eventually, of course, he did.
        Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. It's ironic he could save others from death, but not himself."""), (2, "Hello there! General Kenobi")]
    print(model.predict(data))
