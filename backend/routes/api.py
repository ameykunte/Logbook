from flask import Blueprint, jsonify

bp = Blueprint('api', __name__)

@bp.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello Sudhann!!!"})