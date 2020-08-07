# -*- coding: utf-8 -*-

""" Use DeepMoji to score texts for emoji distribution and insert into a database.

The resulting emoji ids (0-63) correspond to the mapping
in emoji_overview.png file at the root of the DeepMoji repo.
"""

# make sure to pre process data so it is valid unicode ascii string - i.e. only english characters, no linebreaks/etc
from __future__ import print_function, division

import gc
import re
import sqlite3
from unidecode import unidecode
import json
import csv
import numpy as np
from torchmoji.sentence_tokenizer import SentenceTokenizer
from torchmoji.model_def import torchmoji_emojis
from torchmoji.global_variables import PRETRAINED_PATH, VOCAB_PATH

OUTPUT_PATH = 'vt_test_sentences.csv'

conn1 = sqlite3.connect(
    "youtubeComments.db")

conn2 = sqlite3.connect(
    "vtemojicomments.db")

def get_yt_id():
    c1 = conn1.cursor()
    c1.execute("SELECT DISTINCT videoID FROM main.commentsThreads GROUP BY videoID")
    yt_arr = c1.fetchall()
    return yt_arr

def retn_comment_list(data_query):
    comment_retn = []
    for row in data_query:
        comment_retn.append(row[0])
    return comment_retn

def top_elements(array, k):
    ind = np.argpartition(array, -k)[-k:]
    return ind[np.argsort(array[ind])][::-1]


maxlen = 30
batch_size = 32

def tokenize (TEST_SENTENCES):
    print('Tokenizing using dictionary from {}'.format(VOCAB_PATH))
    with open(VOCAB_PATH, 'r') as f:
        vocabulary = json.load(f)
    st = SentenceTokenizer(vocabulary, maxlen)
    tokenized, _, _ = st.tokenize_sentences(TEST_SENTENCES)
    return tokenized

def load_model ():
    print('Loading model from {}.'.format(PRETRAINED_PATH))
    model = torchmoji_emojis(PRETRAINED_PATH)
    print(model)
    return model

def run_predictions (id, tokenized, TEST_SENTENCES):
    model = load_model()
    print('Running predictions.')
    prob = model(tokenized)

    # Find top emojis for each sentence. Emoji ids (0-63)
    # correspond to the mapping in emoji_overview.png
    # at the root of the DeepMoji repo.
    print('Writing results to {}'.format(OUTPUT_PATH))
    scores = []
    for i, t in enumerate(TEST_SENTENCES):
        t_tokens = tokenized[i]
        t_score = [id]
        t_prob = prob[i]
        ind_top = top_elements(t_prob, 5)
        t_score.append(t)
        t_score.append(sum(t_prob[ind_top]))
        t_score.extend(ind_top)
        t_score.extend([t_prob[ind] for ind in ind_top])
        scores.append(t_score)
        print(t_score)
    # include the video id for each comment
    c = conn2.cursor()
    c.execute(
        "CREATE TABLE IF NOT EXISTS commentsEmojid (videoID integer, Text blob, Top5 real, Emoji_1 integer, \
        Emoji_2 integer, Emoji_3 integer, Emoji_4 integer, Emoji_5 integer, Pct_1 real, Pct_2 real, Pct_3 real, Pct_4 real, Pct_5 real)")
    for i, row in enumerate(scores):
        c.execute("insert into commentsEmojid values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11], row[12]))
    conn2.commit()

def preProcessing(array):
    print('Pre-processing dataset')
    processedArray = []
    for row in array:
        newRow = row.encode('ascii', 'ignore').decode('ascii')
        newCommentPre = unidecode(newRow)
        newCommentPre.strip().strip("\\").strip("\t")
        tempC = newCommentPre.replace('\\\'', '\'').replace('\\r\\n', ' ').replace('\r\n', ' ').replace('\\n', ' ').replace('\\r', ' ').replace('\n', ' ').replace('\r', ' ')
        newComment = tempC.strip().strip("\\").strip("\t")
        if not re.search('[a-zA-Z]', newComment):
            continue
        processedArray.append(newComment)
    return processedArray

def main():
    with open(OUTPUT_PATH, 'w') as csvfile:
        writer = csv.writer(csvfile, delimiter=str(','), lineterminator='\n')
        writer.writerow(['VideoID', 'Text', 'Top5%',
                         'Emoji_1', 'Emoji_2', 'Emoji_3', 'Emoji_4', 'Emoji_5',
                         'Pct_1', 'Pct_2', 'Pct_3', 'Pct_4', 'Pct_5'])
    yt_id = get_yt_id()
    for id in yt_id:
        c2 = conn1.cursor()
        print("---------------------------------------------")
        print(id[0])
        print("---------------------------------------------")
        c2.execute("SELECT textOriginal FROM main.commentsThreads WHERE videoID LIKE ?", (id[0],))
        comm_arr = preProcessing(retn_comment_list(c2.fetchall()))
        if not comm_arr:
            print("Comments list for %s is empty! Printing to error log" % id)
            with open("error-log.txt", 'a') as errlog:
                errlog.write("Comments list for %s is empty" % id)
            errlog.close()
            continue
        tokenized = tokenize(comm_arr)
        run_predictions(id[0], tokenized, comm_arr)

if __name__ == '__main__':
    main()
