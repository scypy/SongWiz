import math
import flask_cors
import numpy as np
import csv
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import csr_matrix

cors = flask_cors.CORS()

#Reading in Data
df = pd.read_csv('lyrics.csv')
ratings_df = pd.read_csv('ratings.csv').drop('timestamp', axis=1)


#Preprocessing
pd.set_option("display.max_columns", 20)
df.drop_duplicates(subset=['track_name'], keep="first")
df = df.fillna(0)
##userprofile data
df1 = df.drop(['lyrics', 'track_id','track_name' ,'track_popularity','track_artist', 'track_album_release_date', 'playlist_genre', 'duration_ms', 'language','track_album_name'], axis=1)
df1.fillna(0)
##Recommender data
df_pivot = df.pivot_table(index='track_name',values=['Joy','Anger','Sadness','Tentative','Confident','Fear','Analytical']).fillna(0)
df_matrix = csr_matrix(df_pivot.values)



#Recommender
def recommend(song):
    results = {}
    knn = NearestNeighbors(metric='euclidean', algorithm='brute')
    knn.fit(df_matrix)
    song_index = df_pivot[(df_pivot.index.get_level_values('track_name') == song)]
    distances, indices = knn.kneighbors(song_index.values, n_neighbors=4)
    for i in range(1, 4):
        results.update({i:{'Name':df_pivot.index[indices.flatten()[i]],"distance":distances.flatten()[i]}})
    return results



#Userprofile
def userProfile(userID):
    userID = int(userID)
    ratings_df = pd.read_csv('ratings.csv').drop('timestamp', axis=1)
    user = ratings_df.loc[ratings_df['userID'].eq(userID)]
    user_songs = df1[df1['id'].isin(user['songID'].tolist())]
    user_songs = user_songs.reset_index(drop=True)
    userSongs = user_songs.drop('id', 1) #only  tones available now
    tone_table = df1.set_index(df1['id'])
    tone_table = tone_table.drop('id', 1)
    #User(5) rated five songs with like, does not include preference, tones come out too similar due to dot product alone, weighted average needs to be extracted
    user_profile = userSongs.transpose().dot(user['rating'].values) #Raw profile, dot product produces user's raw preference.
    rectable_df = ((tone_table*user_profile).sum(axis=1))/(user_profile.sum()) #Weighted average to account for varying degree of importance
    ##rectable takes tonetable * userprofile, creates vast dataframe with values multiplied for each song. After calculation gives only a profile of proclivity for each song.
    rectable_df = rectable_df.sort_values(ascending=False)
    recommended_songs = rectable_df.sort_values(ascending=False)
    rec_df = df.loc[df['id'].isin(recommended_songs.head(5).keys())]
    rec_df = rec_df.reset_index(drop=True)
    personalrecs = rec_df.track_name.to_dict()
    return personalrecs

