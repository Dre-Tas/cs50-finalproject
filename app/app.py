import os
import re
from flask import Flask, jsonify, render_template, request, send_from_directory

# https://stackoverflow.com/questions/44209978/serving-a-create-react-app-with-flask

# Configure application
app = Flask(__name__, static_folder='toolbox-usage-viz/public')

# Configure CS50 Library to use SQLite database
#db = SQL("sqlite:///mashup.db")


@app.route("/")
def index():
    """Render map"""
    return send_from_directory('../toolbox-usage-viz/public/', 'index.html')
