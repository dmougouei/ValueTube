import sqlite3
import json

conn1 = sqlite3.connect(
    "youtube-data.db")

def getJson():
    c1 = conn1.cursor()

    c1.execute(
        "CREATE TABLE IF NOT EXISTS ytcategorylist (category text, categoryID text)")

    with open("youtube_categories.json", 'r') as jFile:
        j_dict = json.load(jFile)
        jFile.close()

    # print comma-delimited list of category and id then add to sqlite database
    for itm in j_dict['items']:
        params = (itm['snippet']['title'], itm['id'])
        print(itm)
        print("%s,%s" % params)
        # can only use videos marked as assignable
        if itm['snippet']['assignable'] is True:
            print("Assignable")
            c1.execute("insert into ytcategorylist values (?, ?)", params)
        conn1.commit()


def main():
    getJson()

if __name__ == '__main__':
    main()