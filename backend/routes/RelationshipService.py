from flask import Blueprint, jsonify

relationship = Blueprint('relationship', __name__)

@relationship.route('/relationship', methods=['GET'])
def get_relationship():
    pass