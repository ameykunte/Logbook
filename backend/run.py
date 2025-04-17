from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

from routes.api import bp
from routes.RelationshipService import relationship

app.register_blueprint(bp)
app.register_blueprint(relationship)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)