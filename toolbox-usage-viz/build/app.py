from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin
import sys
import pandas as pd


# Set up flask app with CORS
app = Flask(__name__)
CORS(app)

# Set up SQLAlchemy + Marshmellow
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:\\CS50\\cs50-finalproject\\toolboxrecords-poc.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app)


# Create records table model class
class Record(db.Model):
    __tablename__ = "records"
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String)
    tool = db.Column(db.String)
    revitversion = db.Column(db.String)
    start = db.Column(db.DateTime)
    end = db.Column(db.DateTime)
    size = db.Column(db.Integer)

# Create manual table model class
class Manual(db.Model):
    __tablename__ = "manual"
    code = db.Column(db.String, primary_key=True)
    name = db.Column(db.String)
    time = db.Column(db.Float)
    size = db.Column(db.Integer)

# Create marshmallow schema for records
class RecordSchema(ma.ModelSchema):
    class Meta:
        model = Record

# Create marshmallow schema for manual
class ManualSchema(ma.ModelSchema):
    class Meta:
        model = Manual


@app.route('/')
def index():
    return render_template('index.html')


# USEFUL TO KEEP
# print(lst, file=sys.stdout)

# endpoints / APIs

# TO DELETE
@app.route('/api/dbrecords')
def sendRecords():
    records = Record.query.all()
    records_schema = RecordSchema(many=True)
    output = records_schema.dump(records).data
    return jsonify(output)
# TO DELETE





# Query "records" table
records = db.session.query(
    Record.tool,
    Record.start,
    Record.end,
    Record.size
    )
records_schema = RecordSchema(many=True)
records_output = records_schema.dump(records).data

# reduce to object that sums total size and total run time, divided by tool
# taken from https://stackoverflow.com/questions/38841902/python-sum-values-of-list-of-dictionaries-if-two-other-key-value-pairs-match
tools = {d["tool"] for d in records_output}
totSizeTime = [{
    "tool": tool,
    "totSize": sum(d["size"] for d in records_output if d["tool"] == tool),
    "runTime": int(sum(pd.to_datetime(d["end"]).value/1000000 -
                    pd.to_datetime(d["start"]).value/1000000
                    for d in records_output if d["tool"] == tool)),
    "timesUsed": sum(d["tool"] == tool for d in records_output if d["tool"] == tool)
} for tool in tools]

# Query "manual" table
manual = Manual.query.all()
manual_schema = ManualSchema(many=True)
manual_output = manual_schema.dump(manual).data

# Get all codes from records and manual tables for comparison
recs_codes = []
man_codes = []

# Populate arrays
for obj_recs, obj_man in zip(totSizeTime, manual_output):
    recs_codes.append(obj_recs["tool"])
    man_codes.append(obj_man["code"])
    
# Compare (intersect) lists to get only tools that appear in both tables
# (and disregard Help and Standards)
unique_codes = list(set(recs_codes).intersection(set(man_codes)))

# Initialize list of objects that will contain
# all and only the data necessary for graph
jointDict = []

# Populate array using unique codes as reference
for code in unique_codes:
    name = ""
    # Pick tools name from code
    for m in manual_output:
        if m["code"] == code:
            name = m["name"]
    # Pick tools' unitary run time starting from code
    auto_time = 0
    for t in totSizeTime:
        if t["tool"] == code:
            # Avoid division by zero
            if t["totSize"] != 0:
                auto_time = round((t["runTime"] / t["totSize"] / 1000), 3)
                # return 0 if divided by zero 
                # it means it's 0/0 - if it ran 0 times the runtime must be 0 too
            else:
                auto_time = 0
    # Pick manual processes' unitary run time starting from code
    man_time = 0
    for m in manual_output:
        if m["code"] == code:
            # Avoid division by zero
            if m["size"] != 0:
                man_time = m["time"] / m["size"]
            else:
                man_time = 0
    # Get how many times the tool has been used
    times_used = 0
    for t in totSizeTime:
        if t["tool"] == code:
            times_used += t["timesUsed"]
    # Get on how many elements the tool has been used
    tot_size = 0
    for t in totSizeTime:
        if t["tool"] == code:
            tot_size += t["totSize"]
    # Populate array of objects with results above
    obj = {
        "code": code,
        "name": name,
        "autotime": auto_time,
        "mantime": man_time,
        "timesused": times_used,
        "totsize": tot_size
        }
    jointDict.append(obj)


@app.route('/api/countdb')
def countdb():
    count = 0
    for o in totSizeTime:
        count += o["timesUsed"]
    return jsonify(count)
    

@app.route('/api/unitsaving')
def unitsaving():
    # "Send" array of objects to client through endpoint
    return jsonify(jointDict)


@app.route('/api/test')
def test():
    return jsonify(totSizeTime)