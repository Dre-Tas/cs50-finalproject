import os
import re
from flask import Flask, jsonify, render_template, request
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

engine = create_engine(
    'sqlite:///C:\\CS50\\cs50-finalproject\\toolboxrecords-poc.db')
db = scoped_session(sessionmaker(bind=engine))


@app.route('/')
def index():
    # return render_template('index.html', rows_count=len(rows))
    return render_template('index.html')


@app.route('/countrow')
def countrow():
    rows = db.execute("SELECT * FROM records").fetchall()
    countrow = len(rows)
    return jsonify({"data": "Hello! This string comes from the server ;)"})
