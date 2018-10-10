from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin
import sys
import pandas as pd
from datetime import datetime



# Set up flask app with CORS
app = Flask(__name__)
CORS(app)

# Set up SQLAlchemy + Marshmellow
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:\\CS50\\cs50-finalproject\\toolboxrecords-poc.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app)


# Create db model class
class Record(db.Model):
    __tablename__ = "records"
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String)
    tool = db.Column(db.String)
    revitversion = db.Column(db.String)
    start = db.Column(db.DateTime)
    end = db.Column(db.DateTime)
    size = db.Column(db.Integer)

# Create marshmallow schema


class RecordSchema(ma.ModelSchema):
    class Meta:
        model = Record


@app.route('/')
def index():
    return render_template('index.html')


# endpoint / API

@app.route('/api/dbrecords')
def sendRecords():
    records = Record.query.all()
    records_schema = RecordSchema(many=True)
    output = records_schema.dump(records).data
    return jsonify(output)


@app.route('/api/countdb')
def countdb():
    count = Record.query.count()
    return jsonify(count)


@app.route('/api/unitsaving')
def unitsaving():
    records = Record.query.all()
    records_schema = RecordSchema(many=True)
    output = records_schema.dump(records).data
    # get object that sums total size and total run time, divided by tool
    # taken from https://stackoverflow.com/questions/38841902/python-sum-values-of-list-of-dictionaries-if-two-other-key-value-pairs-match
    tools = {d["tool"] for d in output}
    totSizeTime = [{
        "tool": tool,
        "totSize": sum(d["size"] for d in output if d["tool"] == tool),
        "runTime": int(sum(pd.to_datetime(d["end"]).value/1000000 -
                        pd.to_datetime(d["start"]).value/1000000
                       for d in output if d["tool"] == tool))
    } for tool in tools]
    return jsonify(totSizeTime)
