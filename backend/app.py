import os
from flask import Flask, redirect, url_for, request, render_template
from pymongo import MongoClient
from flask import jsonify
from bson import ObjectId 
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)

CORS(app)  
CORS(app, origins='http://localhost:3000', methods=['GET', 'POST'], allow_headers=['Content-Type'])

client = MongoClient('db', 27017)
db = client.jeosdb

@app.route('/submit', methods=['POST'])
def submit():
    verifier = request.form.get('verifier')
    standard = request.form.get('standard', [])
    assurance = request.form.get('assurance')
    scope = request.form.get('scope', [])

    disclosure = None
    if 'disclosure' in request.files:
        file = request.files['disclosure']
        filename = secure_filename(file.filename)
        upload_folder = os.path.join(os.getcwd(), 'files')
        file.save(os.path.join(upload_folder, filename))
        disclosure = filename

    link = request.form.get('link')

    score, scale_label = calculate_score(verifier, standard, assurance, scope, disclosure, link)
    print(verifier, standard, assurance, scope, disclosure, link)

    item_doc = {
        'verifier': verifier,
        'standard': standard,
        'assurance': assurance,
        'scope': scope,
        'disclosure': disclosure,
        'score' : score,
        'link': link,
    }
    
    db.jeosdb.insert_one(item_doc)
    item_doc['_id'] = str(item_doc['_id'])  # Convert ObjectId to string

    response = jsonify({'score': score, 'scaleLabel': scale_label})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response, 200


@app.route('/records')
def get_records():
    # Retrieve all items from the database
    items = list(db.jeosdb.find())
    
    # Convert ObjectId to string for each item
    for item in items:
        item['_id'] = str(item['_id'])
    
    return jsonify({'items': items}), 200


@app.route('/delete_records', methods=['DELETE'])
def delete_all_records():
    try:
        # Delete all records from the database
        db.jeosdb.delete_many({})
        return jsonify({'message': 'All records deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

def calculate_score(verifier, standard, assurance, scope, disclosure, link):
    if verifier == 'No' or (not disclosure and not link):
        return 0, 'Minimal'
    elif verifier == 'Yes':
        if not standard and not assurance:
            return 2, 'Developing'
        elif assurance == 'Reasonable Assurance' and (disclosure or link):
               return 5, 'Exemplary'
        elif scope == 'Scope 1' and (disclosure or link):
            return 3.5, 'Robust'
    return 0, 'Minimal'


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)