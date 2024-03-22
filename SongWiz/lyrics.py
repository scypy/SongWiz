# importing modules
import pandas as pd
import numpy as np
from ibm_watson import ToneAnalyzerV3
import requests
import json
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

#credentials
url = 'https://api.eu-gb.tone-analyzer.watson.cloud.ibm.com/instances/58c758f3-5fc8-4e11-9ed9-d9ed30fbd92d'
apikey = 'API-KEY'
authenticator = IAMAuthenticator(apikey)
tone_analyzer = ToneAnalyzerV3(version='2017-09-21', authenticator=authenticator)
tone_analyzer.set_service_url(url)


# reading lyrics data
df = pd.read_csv('C:/Users/Q.M/PycharmProjects/SongWiz/csv/spotify_songs.csv')


#~Data Cleaning~
pd.set_option("display.max_columns", 20)

#dropping irrelevant columns
df.drop(columns=['tempo', 'valence', 'liveness','instrumentalness','acousticness','speechiness','mode'
    ,'loudness','key', 'energy', 'danceability', 'playlist_name', 'track_album_id','playlist_subgenre'
    , 'playlist_id'], inplace=True)

#only using english lyrics
df = df[df['language'] == 'en']

#only popular songs
df = df[df['track_popularity'] > 79]

#~Appending Tones~

#iterate through lyrics column
for index, lyric in df['lyrics'].iteritems():
    #pass lyrics into tone analyzer
    json_output = tone_analyzer.tone(lyric, content_type='text/plain')
    #traverse JSON result of each lyric
    for i in json_output.result['document_tone']['tones']:
            #append results in new column
            df._set_value(index, i['tone_name'], i['score'])


#find album names with "?" and replace with single
find_val = ['?']
replace_val = ['Single']
df['track_album_name'].replace(find_val, replace_val)

#Output modified dataset to csv file
df.to_csv('lyrics.csv')



