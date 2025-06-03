from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Thrift Ease API!"

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify([
        {"id": 1, "name": "Product 1", "price": 100},
        {"id": 2, "name": "Product 2", "price": 200}
    ])

if __name__ == '__main__':
    app.run(debug=True, port=5000)