# Entry point for Render deployment
import os
import sys

# Add backend directory to Python path and change to it
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
sys.path.insert(0, backend_dir)
os.chdir(backend_dir)

# Import the Flask app
from app import app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
