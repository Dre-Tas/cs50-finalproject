from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin
import pandas as pd
# import sys


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


# Routes

@app.route('/')
def index():
    return render_template('index.html')


# endpoints / APIs

# Query "records" table
# Could have done query all but keep this way for beter scalability
records = db.session.query(
    Record.user,
    Record.tool,
    Record.revitversion,
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


# This sends data to the top part of the app with the summary info (jumbotron)
@app.route('/api/summary')
def summary():
    # Initialize variables
    countUsed = 0
    totTimeSaved = 0
    starts = []

    # How many times ppl have clicked on any button of the toolbox?
    for o in totSizeTime:
        countUsed += o["timesUsed"]

    # Calculate total time saved
    for j in jointDict:
        if j["autotime"] != 0:
            totTimeSaved += (j["mantime"] - j["autotime"]) * j["totsize"]
        else:
            totTimeSaved += 0

    # get start datetimes
    for ro in records_output:
        starts.append(pd.to_datetime(ro["start"]))
    starts.sort()

    # Init and populate dict
    summaryDict = [{
        "first": starts[0],
        "totused": countUsed,
        "totsaved": round(totTimeSaved, 2)
    }]
    # Return "jsonified" dictionary
    return jsonify(summaryDict)


# This populates the first graph (vertical grouped bars)
@app.route('/api/unitsaving')
def unitsaving():
    # "Send" array of objects to client through endpoint
    return jsonify(jointDict)


@app.route('/api/test')
def test():
    # "Send" array of objects to client through endpoint
    return jsonify(records_output)


@app.route('/api/graphtoolbox')
def graphToolbox():
    # Initialize totals
    countUsed = 0
    countSize = 0
    totTimeSaved = 0
    # Calculate + populate totals
    for o in totSizeTime:
        countUsed += o["timesUsed"]
        countSize += o["totSize"]
    for j in jointDict:
        if j["autotime"] != 0:
            totTimeSaved += (j["mantime"] - j["autotime"]) * j["totsize"]
        else:
            totTimeSaved += 0

    # Create dict to send through endpoint
    graphToolboxDict = [{
        "labels": ["Toolbox"],
        "totused": {
            "number": [countUsed],
            "label": "number of uses",
            "colour": "rgba(255, 151, 15, 0.3)"
        },
        "totsize": {
            "number": [countSize],
            "label": "number of elements used on",
            "colour": "rgba(255, 142, 50, 0.3)"
        },
        "totsaved": {
            "number": [round(totTimeSaved, 2)],
            "label": "number of seconds saved",
            "colour": "rgba(255, 108, 45, 0.3)"
        }
    }]
    return jsonify(graphToolboxDict)


@app.route('/api/graphversion')
def countVersion():
    # Reduce to obj that sums by version
    # but keep the division by tool to calculate the time saved
    versions = {d["revitversion"] for d in records_output}
    totVersion = [{
        "version": version,
        "tools": [{
            "tool": tool,
            "totSize": sum(d["size"] for d in records_output
                           if d["tool"] == tool and d["revitversion"] == version),
            "runTime": int(sum(pd.to_datetime(d["end"]).value/1000000 -
                               pd.to_datetime(d["start"]).value/1000000
                               for d in records_output
                               if d["tool"] == tool
                               and d["revitversion"] == version)),
            "timesUsed": sum(d["tool"] == tool for d in records_output
                             if d["tool"] == tool
                             and d["revitversion"] == version)
        } for tool in tools]
    } for version in versions]

    # Count times used per version
    countUsed = []
    for d in totVersion:
        single_sum = 0
        for e in d["tools"]:
            single_sum += e["timesUsed"]
        countUsed.append(single_sum)

    # Count how many elements per version
    countSize = []
    for d in totVersion:
        single_sum = 0
        for e in d["tools"]:
            single_sum += e["totSize"]
        countSize.append(single_sum)

    # Calculate time saving
    totTimeSaved = []
    for d in totVersion:
        single_sum = 0
        for e in d["tools"]:
            tool = e["tool"]
            # print(tool, file=sys.stdout)
            for j in jointDict:
                if j["code"] == tool:
                    # print(j["autotime"], file=sys.stdout)
                    if j["autotime"] != 0:
                        single_sum += e["totSize"] * \
                            (j["mantime"] - j["autotime"])
                    else:
                        single_sum += 0
            # single_sum += e["totSize"] * ((j["mantime"] / j["autotime"]) * j["timesused"])
        totTimeSaved.append(round(single_sum, 2))

    # Create dict to send through endpoint
    graphVersionDict = [{
        "labels": [d["version"] for d in totVersion],
        "totused": {
            "number": countUsed,
            "label": "number of uses",
            "colour": "rgba(255, 151, 15, 0.3)"
        },
        "totsize": {
            "number": countSize,
            "label": "number of elements used on",
            "colour": "rgba(255, 142, 50, 0.3)"
        },
        "totsaved": {
            "number": totTimeSaved,
            "label": "number of seconds saved",
            "colour": "rgba(255, 108, 45, 0.3)"
        }
    }]

    return jsonify(graphVersionDict)


@app.route('/api/graphtool')
def countTool():
    # Create dict to send through endpoint
    graphToolDict = [{
        "labels": [d["name"] for d in jointDict],
        "totused": {
            "number": [d["timesused"] for d in jointDict],
            "label": "number of uses",
            "colour": "rgba(255, 151, 15, 0.3)"
        },
        "totsize": {
            "number": [d["totsize"] for d in jointDict],
            "label": "number of elements used on",
            "colour": "rgba(255, 142, 50, 0.3)"
        },
        "totsaved": {
            "number": [round((d["mantime"] - d["autotime"]) * d["totsize"], 2) for d in jointDict],
            "label": "number of seconds saved",
            "colour": "rgba(255, 108, 45, 0.3)"
        }
    }]

    return jsonify(graphToolDict)


@app.route('/api/graphuser')
def countUser():
    # Reduce to obj that sums by version
    # but keep the division by tool to calculate the time saved
    users = {d["user"] for d in records_output}
    totUser = [{
        "user": user,
        "tools": [{
            "tool": tool,
            "totSize": sum(d["size"] for d in records_output
                           if d["tool"] == tool and d["user"] == user),
            "runTime": int(sum(pd.to_datetime(d["end"]).value/1000000 -
                               pd.to_datetime(d["start"]).value/1000000
                               for d in records_output
                               if d["tool"] == tool
                               and d["user"] == user)),
            "timesUsed": sum(d["tool"] == tool for d in records_output
                             if d["tool"] == tool
                             and d["user"] == user)
        } for tool in tools]
    } for user in users]

    # Count times used per version
    countUsed = []
    for d in totUser:
        single_sum = 0
        for e in d["tools"]:
            single_sum += e["timesUsed"]
        countUsed.append(single_sum)

    # Count how many elements per version
    countSize = []
    for d in totUser:
        single_sum = 0
        for e in d["tools"]:
            single_sum += e["totSize"]
        countSize.append(single_sum)

    # Calculate time saving
    totTimeSaved = []
    for d in totUser:
        single_sum = 0
        for e in d["tools"]:
            tool = e["tool"]
            # print(tool, file=sys.stdout)
            for j in jointDict:
                if j["code"] == tool:
                    # print(j["autotime"], file=sys.stdout)
                    if j["autotime"] != 0:
                        single_sum += e["totSize"] * \
                            (j["mantime"] - j["autotime"])
                    else:
                        single_sum += 0
            # single_sum += e["totSize"] * ((j["mantime"] / j["autotime"]) * j["timesused"])
        totTimeSaved.append(round(single_sum, 2))

    # Create dict to send through endpoint
    graphUserDict = [{
        "labels": [d["user"] for d in totUser],
        "totused": {
            "number": countUsed,
            "label": "number of uses",
            "colour": "rgba(255, 151, 15, 0.3)"
        },
        "totsize": {
            "number": countSize,
            "label": "number of elements used on",
            "colour": "rgba(255, 142, 50, 0.3)"
        },
        "totsaved": {
            "number": totTimeSaved,
            "label": "number of seconds saved",
            "colour": "rgba(255, 108, 45, 0.3)"
        }
    }]

    return jsonify(graphUserDict)


# USEFUL TO KEEP
# print(lst, file=sys.stdout)
