import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans

def main():
    dm_data = pd.read_csv('AUS_vt_test_sentences.csv')
    df = pd.DataFrame(dm_data, columns=['VideoID', 'Text', 'Top5%',
                         'Emoji_1', 'Emoji_2', 'Emoji_3', 'Emoji_4', 'Emoji_5',
                         'Pct_1', 'Pct_2', 'Pct_3', 'Pct_4', 'Pct_5'])
    kmeans = KMeans(n_clusters=8)
    y = kmeans.fit_predict(df[['Emoji_1', 'Emoji_2', 'Emoji_3', 'Emoji_4', 'Emoji_5']])
    df['Cluster'] = y
    df.to_csv(r'/home/beth/PycharmProjects/torchMoji3/examples/AUS_vt_clustering.csv', index=False, header=True)
    print(df)

if __name__ == '__main__':
    main()