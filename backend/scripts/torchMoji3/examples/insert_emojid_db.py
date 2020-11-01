import sqlite3
import json
import csv

conn1 = sqlite3.connect(
    "vtemojicomments.db")

def get_pre_ytid() :
    c1 = conn1.cursor()
    c1.execute("SELECT DISTINCT videoID FROM main.commentsEmojid GROUP BY videoID")
    yt_arr = c1.fetchall()

    new_yt_arr = []
    for row_id in yt_arr:
        new_yt_arr.append(row_id[0])
    return new_yt_arr

#try and put a similar function in the vt_score_emoji_individual.py script, to only inserts comments for VideoID's
# not already in the table to avoid duplicates
def open_chosen_csv():
    pre_ytid_arr = get_pre_ytid()
    c = conn1.cursor()
    with open("AUS_vt_test_sentences.csv", 'r', newline='') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            if row[0] == "VideoID":
                continue
            if row[0] in pre_ytid_arr:
                continue
            c.execute("insert into commentsEmojid values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11], row[12]))
    csvfile.close()
    conn1.commit()

def main():
    print(get_pre_ytid())
    open_chosen_csv()

if __name__ == '__main__':
    main()