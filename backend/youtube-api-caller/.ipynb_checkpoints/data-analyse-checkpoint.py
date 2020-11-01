import random
import string
from collections import Counter
import nltk
from nltk.probability import FreqDist
from nltk.corpus import stopwords, wordnet
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import sqlite3

conn = sqlite3.connect("youtubeComments.db")

# need to tokenize first to produce dict() featureset of words with label, then a class label so it is ('featureset', 'class label')

def machineAlgorithm(array):
    featuresArray = array
    random.shuffle(featuresArray)
    n = len(featuresArray)
    trainNo = int(0.5 * n)
    testNo = int(0.5 * n)
    print('No of training feature sets: %s' % trainNo)
    print('No of test feature sets: %s' % testNo)
    train_set, test_set = featuresArray[trainNo:], featuresArray[:testNo]
    classifier = nltk.NaiveBayesClassifier.train(train_set)
    random.shuffle(test_set)
    print('Accuracy: %s' % nltk.classify.accuracy(classifier,
                                 test_set))
    correct = 0
    wrong = 0
    for row in test_set:
        classifiedRow = classifier.classify(row[0])
        actualRow = row[1]
        # print(classifiedRow) # uncomment to show what classifier classifies as
        # print(actualRow) # uncomment to print actual categoryID is
        if classifiedRow == actualRow:
            correct += 1
        else:
            wrong += 1
    print('Correct: %s' % correct)
    print('Wrong: %s' % wrong)


def getWords(wordsArray):
    bigArray = list()
    for row in wordsArray:
        wordCount = Counter(row[1])
        categoryID = row[0]
        obj = (wordCount, categoryID)
        bigArray.append(obj)
    random.shuffle(bigArray)
    machineAlgorithm(bigArray)


def frequencyDistribution():
    wordsArray = preProcessing(tokenizeWords(selectRow()))
    singleWordArray = list()
    for r in wordsArray:
        for m in r[1]:
            singleWordArray.append(m)
    fdist = FreqDist(singleWordArray)
    fdist.plot(10, cumulative=False)

    last_ten = FreqDist(dict(fdist.most_common()[-20:]))
    last_ten.plot()

    commonWords = fdist.most_common(1200) # make an array of the most common words to remove these from the dataset so there is greater entropy
    commonWordlist = list()
    for wrd in commonWords:
        commonWordlist.append(wrd[0])
    for w in wordsArray:
        for m in w[1][:]:
            if m in commonWordlist:
                w[1].remove(m)
    return wordsArray


def preProcessing(array):
    print('Pre-processing dataset')
    stopWords = set(stopwords.words("english"))
    # devDefinedStopWords = ['im', 'u', 'youre', 'werent', 'youll', 'm', 'nt', 's']
    devDefinedStopWords = ['im', 'u', 'could', 'would', 'nt']
    lemmatiz = WordNetLemmatizer()
    processedArray = list()
    for row in array:
        filteredComment = []
        for word in row[1]:
            newWord = word[0].encode('ascii', 'ignore').decode('ascii')
            newWord = newWord.translate(str.maketrans('', '', string.punctuation)).strip()
            if (newWord not in stopWords) and (newWord not in string.punctuation) and (
                    newWord not in devDefinedStopWords) and newWord:
                filteredComment.append(lemmatiz.lemmatize(newWord, getwordnetpos(word[1])))
        newCommentObj = (row[0], filteredComment)
        processedArray.append(newCommentObj)
    return processedArray


def getwordnetpos(tag):
    if tag.startswith('J'):
        return wordnet.ADJ
    elif tag.startswith('V'):
        return wordnet.VERB
    elif tag.startswith('N'):
        return wordnet.NOUN
    elif tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN


def tokenizeWords(array):
    print('Tokenizing words')
    tokenizedArray = list()
    for row in array:
        m = row[1].translate(str.maketrans('.', ' '))
        n = m.replace('\\r\\n', ' ').replace('\r\n', ' ').replace('\\n', ' ').replace('\\r', ' ').replace('\n',
                                                                                                          ' ').replace(
            '\r', ' ')
        o = n.lower()
        tokenizedWord = nltk.pos_tag(word_tokenize(o))
        tokenizedItem = (row[0], tokenizedWord)
        tokenizedArray.append(tokenizedItem)
    return tokenizedArray

def selectRow():
    c = conn.cursor()
    c.execute(
        "SELECT category_id, commentData FROM commentsItemsText INNER JOIN videoCategory ON videoCategory.video_id = commentsItemsText.videoId;")
    rowvar = c.fetchall()
    return rowvar


def main():
    getWords(frequencyDistribution())


if __name__ == '__main__':
    main()
