import tokenizer
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.layers import Dense, Input
from tensorflow.keras import Model

# create a function to plot performance over a models training process
def plot_training(history, y_min, y_max, title="model training"):
    plt.plot(history.history["categorical_accuracy"], label="training")
    plt.plot(history.history["val_categorical_accuracy"], label="validation")
    plt.xticks(range(0, len(history.history["categorical_accuracy"]) + 5, 5))
    plt.title(title)
    plt.xlabel("Epoch")
    plt.ylabel("Categorical accuracy")
    plt.legend()
    plt.gca().set_ylim([y_min, y_max])
    plt.show()

# get data
X_train, X_test, y_train, y_test, vocabulary = tokenizer.create_dataset()
y_train = np.asarray(y_train) # need to be np array to work with tensorflow
y_test = np.asarray(y_test)

# build model
X = Input(shape=(X_train.shape[1], ))
dense1 = Dense(y_train.shape[1], activation = "sigmoid")(X)
nn = Model(inputs = X, outputs = dense1)
nn.summary()

# train model
nn.compile(optimizer = "adam", loss = "categorical_crossentropy", metrics = ['CategoricalAccuracy'])
history = nn.fit(X_train, y_train,
                 batch_size = 32, epochs = 30,
                 validation_data = (X_test, y_test))

# review model performance
plot_training(history, 0, 1)
# The large drop in validation accuracy is likely due to the fact there are words in the validation set
# that aren't in the training set, i.e. aren't recognised as features, which means we need a larger training set
