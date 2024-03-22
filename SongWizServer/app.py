import pickle
import uuid
from functools import wraps
import requests
import os
import csv, sqlite3
from flask import Flask, request, redirect, url_for, flash, jsonify, render_template,make_response
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api, reqparse
from flask_sqlalchemy import SQLAlchemy
from passlib.handlers import bcrypt
from sqlalchemy import create_engine
import numpy as np
import pandas as pd
from passlib.apps import custom_app_context as pwd_context
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import model
import datetime
from xlsxwriter import Workbook

app = Flask(__name__)
#secret key for basic security
app.config['SECRET_KEY'] = 'thisissecret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///songwiz.db'

db = SQLAlchemy(app)
CORS(app)
engine = create_engine('sqlite:///songwiz.db', echo=True)
sqlite_connection = engine.connect()


class User(db.Model):
    __tablename__ = 'users'
    userID = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    password = db.Column(db.String(80))



class Songs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    track_name = db.Column(db.String(100), nullable=False)
    track_artist = db.Column(db.String(100), nullable=False)
    lyrics = db.Column(db.Text, nullable=False)
    track_popularity = db.Column(db.Integer, nullable=False)
    track_album_name = db.Column(db.String(100), nullable=False)
    track_album_release_date = db.Column(db.String(100), nullable=False)
    playlist_genre = db.Column(db.String(100), nullable=False)
    duration_ms = db.Column(db.String(100), nullable=False)
    Joy = db.Column(db.Float())
    Anger = db.Column(db.Float())
    Sadness = db.Column(db.Float())
    Tentative = db.Column(db.Float())
    Confident = db.Column(db.Float())
    Fear = db.Column(db.Float())
    Analytical = db.Column(db.Float())



    # songs_table = "Songs"
    # df = pd.read_csv('lyrics.csv', index_col='id')
    # df.drop('track_id',axis=1,inplace=True)
    # df.columns = df.columns.str.strip()
    # df.fillna(0, inplace=True)
    # con = sqlite3.connect("songwiz.db")
    # df.to_sql(songs_table, sqlite_connection, if_exists='append')
    # song_id = db.relationship('Ratings', backref='song')
    # sqlite_connection.close()




#Ignore, testing purposes
@app.route('/randomrec', methods=['POST','GET'])
def randomRec():
    content = request.json
    song = content['search']
    res = model.randomRec()
    return res


@app.route('/recommend', methods=['POST', 'GET'])
def recommend():
    content = request.json
    song = content['search']
    res = model.recommend(song=song)
    return res


@app.route('/song', methods=['POST','GET'])
def returnSong():
    id = request.get_json()['songID']
    songs = Songs.query.filter_by(id=id).first()
    output = []
    song_data = {}
    song_data['album'] = songs.track_album_name
    song_data['lyrics'] = songs.lyrics
    song_data['popular'] = songs.track_popularity
    song_data['date'] = songs.track_album_release_date
    song_data['duration'] = songs.duration_ms
    song_data['joy'] = songs.Joy
    song_data['anger'] = songs.Anger
    song_data['sadness'] = songs.Sadness
    song_data['tentative'] = songs.Tentative
    song_data['confident'] = songs.Confident
    song_data['fear'] = songs.Fear
    song_data['analytical'] = songs.Analytical
    output.append(song_data)
    return jsonify(output)


@app.route('/search', methods=['POST', 'GET'])
def search():
    userID = request.get_json()['userID'] #required userID token
    users = User.query.filter_by(userID=userID).first()
    songs = Songs.query.all()
    output = []
    if not users:
        return jsonify({"Authentication": "Unauthorized token"})
    for song in songs:
        song_data = {}
        song_data['id'] = song.id
        song_data['track_name'] = song.track_name
        song_data['artist'] = song.track_artist
        song_data['genre'] = song.playlist_genre
        output.append(song_data)
    return jsonify(output)


@app.route('/songdetails', methods=['POST','GET'])
def songDetails():
    track_name = request.get_json()['Name']
    songs = Songs.query.filter_by(track_name=track_name)
    output = []
    for song in songs:
        song_data = {}
        song_data['id'] = song.id
        output.append(song_data)
    return jsonify(output)


@app.route('/signup', methods=['POST'])
def signup():
    username = request.get_json()['username']
    password = request.get_json()['password']
    hashed_password = generate_password_hash(password, method='sha256')
    newuser = User(username=username, password=hashed_password)
    db.session.add(newuser)
    db.session.commit()
    token = newuser.userID
    return jsonify({"Signup Successful": token})


#Retrieve all users
@app.route('/getuser', methods=['GET'])
def getuser():
    data = request.json
    users = User.query.all()
    output = []
    for user in users:
        user_data = {}
        user_data['userID'] = user.userID
        user_data['username'] = user.username
        user_data['password'] = user.password
        output.append(user_data)
    return jsonify({'users': output})


@app.route('/rating', methods=['POST', 'GET'])
def rateSong(): #random_ratings, remove mode 'append', header=True
    data = request.get_json()
    ratings_df = pd.json_normalize(data)
    ratings_df.to_csv('ratings.csv', mode='a', sep=',', index=False, header=False)
    return 'Rating Saved'



@app.route('/userprofile', methods=['POST', 'GET'])
def profile():
    userID = request.get_json()["userID"]
    recs = model.userProfile(userID=userID)
    return jsonify(recs)


@app.route('/login', methods=['POST', 'GET'])
def login():
    try:
        username = request.get_json()['username']
        password = request.get_json()['password']
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({"Authentication":"Login Failed"}), 400
        user_id = user.userID
        data = {
            'userID': user_id
        }
        if check_password_hash(user.password, password):
            return jsonify(data)
        else:
            return jsonify({"Authentication":"Login Failed"}) ,400

    except (AttributeError, TypeError) as e:
        return jsonify({"Authentication":"Login Failed"}), 400



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
