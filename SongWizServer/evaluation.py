import math
import flask_cors
import numpy as np
import csv
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import csr_matrix



df =pd.read_csv('lyrics.csv')
ratings_df = pd.read_csv('ratings.csv')
ratings_df = ratings_df.drop('timestamp', axis=1)

ev_pivot = df.pivot_table(index='id',values=['Joy','Anger','Sadness','Tentative','Confident','Fear','Analytical']).fillna(0)
ev_matrix = csr_matrix(ev_pivot.values)



#Evaluation
def evaluate():
    user = ratings_df.loc[ratings_df['userID'].eq(8) & ratings_df['rating'].eq(1)] #get random user
    neighbors = []
    knn = NearestNeighbors(metric='euclidean', algorithm='brute')
    knn.fit(ev_pivot)
    query_index = ev_pivot[(ev_pivot.index.get_level_values('id') == 18385)] # random user-song pair
    distances, indices = knn.kneighbors(query_index.values, n_neighbors=4)
    for i in range(1, 4):
        neighbors.append(ev_pivot.index[indices.flatten()[i]]) #,"similarity: ",(1/(1+distances)).flatten()[i]
    all_items = user['songID'].count() #total recommended items to user
    true_pos = user.loc[user['songID'].isin(neighbors)] # relevant items to users
    precision = true_pos['songID'].count()/all_items # precision
    print(neighbors)
    print("True Positive: ", true_pos['songID'].count())
    print("Recommended Items: ", all_items)
    print("Precision: ", precision*100, "%")
    return precision
