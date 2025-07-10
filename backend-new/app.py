#!/usr/bin/env python3
"""
QuickThrift Authentication Backend
Simple Flask server for authentication
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
import secrets

app = Flask(__name__)
CORS(app)

# Data storage
DATA_FILE = 'users_data.json'

def load_users():
    """Load users from JSON file"""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    return []

def save_users(users):
    """Save users to JSON file"""
    try:
        with open(DATA_FILE, 'w') as f:
            json.dump(users, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving users: {e}")
        return False

@app.route('/')
def home():
    return {
        "message": "QuickThrift Authentication API",
        "status": "running",
        "endpoints": [
            "POST /api/auth/signin - User login",
            "POST /api/auth/signup - User registration",
            "GET /api/health - Health check"
        ]
    }

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "QuickThrift Auth API is running",
        "timestamp": datetime.now().isoformat()
    }

@app.route('/api/auth/signin', methods=['POST'])
def signin():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        # Load users
        users = load_users()
        
        # Find user
        user = next((u for u in users if u.get('email', '').lower() == email), None)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        # Check password (in production, use proper hashing)
        if user.get('password') != password:
            return jsonify({"error": "Invalid password"}), 401
        
        # Generate token
        token = secrets.token_urlsafe(32)
        
        # Return success response
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user.get('id'),
                "email": user.get('email'),
                "username": user.get('username')
            }
        })
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        username = data.get('username', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not username or not email or not password:
            return jsonify({"error": "Username, email, and password are required"}), 400
        
        # Load existing users
        users = load_users()
        
        # Check if user already exists
        if any(u.get('email', '').lower() == email for u in users):
            return jsonify({"error": "User with this email already exists"}), 409
        
        # Create new user
        new_user = {
            "id": f"user_{len(users) + 1}_{secrets.token_hex(4)}",
            "username": username,
            "email": email,
            "password": password,  # In production, hash this
            "created_at": datetime.now().isoformat(),
            "last_login": None
        }
        
        # Add user to list
        users.append(new_user)
        
        # Save users
        if not save_users(users):
            return jsonify({"error": "Failed to save user data"}), 500
        
        # Generate token
        token = secrets.token_urlsafe(32)
        
        print(f"New user registered: {email}")
        
        # Return success response
        return jsonify({
            "message": "Account created successfully",
            "token": token,
            "user": {
                "id": new_user.get('id'),
                "email": new_user.get('email'),
                "username": new_user.get('username')
            }
        })
        
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/users')
def list_users():
    """List all users (for debugging)"""
    users = load_users()
    # Remove passwords from response
    safe_users = []
    for user in users:
        safe_user = {k: v for k, v in user.items() if k != 'password'}
        safe_users.append(safe_user)
    return jsonify({"users": safe_users, "count": len(users)})

if __name__ == '__main__':
    print("🚀 Starting QuickThrift Authentication Server...")
    print("📍 Server will run at: http://127.0.0.1:5000")
    print("📊 Available endpoints:")
    print("   POST /api/auth/signin - User login")
    print("   POST /api/auth/signup - User registration")  
    print("   GET /api/health - Health check")
    print("   GET /api/users - List users")
    print("\n✅ Ready to accept requests!")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
