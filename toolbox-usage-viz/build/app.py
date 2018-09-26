from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin

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

# endpoint
@app.route('/countrow')
def countrow():
    records = Record.query.all()
    records_schema = RecordSchema(many=True)
    output = records_schema.dump(records).data
    return jsonify(output)
