from functools import wraps
from flask import request, jsonify
from firebase_admin import auth

def firebase_auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Authorization token is missing"}), 401

        try:
            # Remove "Bearer " prefix from the token
            token = token.split(" ")[1]
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token  # Attach user info to the request
        except Exception as e:
            return jsonify({"error": str(e)}), 401

        return f(*args, **kwargs)
    return decorated_function