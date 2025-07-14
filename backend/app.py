from flask import Flask, jsonify, request, send_from_directory, send_file
from flask_cors import CORS
import json
import os
from datetime import datetime
import atexit

app = Flask(__name__)
CORS(app)

# Data file paths
DATA_DIR = 'data'
PRODUCTS_FILE = os.path.join(DATA_DIR, 'products.json')
USERS_FILE = os.path.join(DATA_DIR, 'users.json')
ORDERS_FILE = os.path.join(DATA_DIR, 'orders.json')
BAGS_FILE = os.path.join(DATA_DIR, 'bags.json')

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

def load_data():
    """Load data from JSON files"""
    global products_data, users_data, orders_data, bags_data
    
    # Load products
    if os.path.exists(PRODUCTS_FILE):
        with open(PRODUCTS_FILE, 'r') as f:
            products_data = json.load(f)
    else:
        # Default products if file doesn't exist
        products_data = [
            {"id": 1, "name": "Vintage Denim Jacket", "mainCategory": "Women's", "subCategory": "Jackets", "price": 45.99, "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//2Q=="},
            {"id": 2, "name": "Classic White Sneakers", "mainCategory": "Shoes", "subCategory": "Sneakers", "price": 35.50, "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//2Q=="},
            {"id": 3, "name": "Cotton T-Shirt", "mainCategory": "Men's", "subCategory": "T-Shirts", "price": 15.99, "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//2Q=="}
        ]
    
    # Load users
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            users_data = json.load(f)
    else:
        users_data = []
    
    # Load orders
    if os.path.exists(ORDERS_FILE):
        with open(ORDERS_FILE, 'r') as f:
            orders_data = json.load(f)
    else:
        orders_data = []
    
    # Load bags
    if os.path.exists(BAGS_FILE):
        with open(BAGS_FILE, 'r') as f:
            bags_data = json.load(f)
    else:
        bags_data = {}  # Store as {user_email: [bag_items]}

def save_data():
    """Save data to JSON files"""
    with open(PRODUCTS_FILE, 'w') as f:
        json.dump(products_data, f, indent=2)
    
    with open(USERS_FILE, 'w') as f:
        json.dump(users_data, f, indent=2)
    
    with open(ORDERS_FILE, 'w') as f:
        json.dump(orders_data, f, indent=2)
    
    with open(BAGS_FILE, 'w') as f:
        json.dump(bags_data, f, indent=2)

# Initialize default admin user
def init_default_admin():
    """Create default admin user if it doesn't exist"""
    admin_email = 'admin@quickthrift.com'
    admin_exists = any(user.get('email') == admin_email for user in users_data)
    
    if not admin_exists:
        admin_user = {
            'id': 1,
            'username': 'QuickThrift Admin',
            'email': admin_email,
            'password': 'TempPass123!',  # Temporary password
            'role': 'admin',
            'created_at': datetime.now().isoformat(),
            'status': 'active',
            'must_change_password': True
        }
        
        users_data.append(admin_user)
        save_data()
        print("🔐 Default admin user created:")
        print(f"   Email: {admin_email}")
        print("   Password: TempPass123! (must be changed on first login)")

# Save data on shutdown
atexit.register(save_data)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Thrift Ease API!", "status": "running", "version": "1.0"})

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products_data)

@app.route('/api/products', methods=['POST'])
def add_product():
    try:
        product_data = request.get_json()
        
        # Generate new ID
        new_id = max([p.get('id', 0) for p in products_data], default=0) + 1
        product_data['id'] = new_id
        
        # Add timestamp
        product_data['created_at'] = datetime.now().isoformat()
        
        products_data.append(product_data)
        save_data()  # Save data after adding product
        
        return jsonify({"message": "Product added successfully", "product": product_data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/auth/signin', methods=['POST'])
def sign_in():
    try:
        credentials = request.get_json()
        email = credentials.get('email')
        password = credentials.get('password')
        
        # Simple authentication (in production, use proper authentication)
        if email and password:
            # Check if user exists and password matches
            user = next((u for u in users_data if u.get('email') == email), None)
            
            if user:
                # Verify password (in production, use proper password hashing)
                if user.get('password') == password:
                    return jsonify({
                        "message": "Sign-in successful",
                        "token": f"token_{email}_{datetime.now().timestamp()}",
                        "user": {"email": email, "username": user.get('username')}
                    })
                else:
                    return jsonify({"error": "Invalid password"}), 401
            else:
                return jsonify({"error": "User not found"}), 404
        else:
            return jsonify({"error": "Email and password required"}), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/auth/signup', methods=['POST'])
def sign_up():
    try:
        user_data = request.get_json()
        username = user_data.get('username')
        email = user_data.get('email')
        password = user_data.get('password')
        
        if not all([username, email, password]):
            return jsonify({"error": "Username, email, and password required"}), 400
        
        # Check if user already exists
        if any(u.get('email') == email for u in users_data):
            return jsonify({"error": "User already exists"}), 409
        
        # Create new user
        new_user = {
            "id": len(users_data) + 1,
            "username": username,
            "email": email,
            "password": password,  # In production, hash this!
            "created_at": datetime.now().isoformat()
        }
        
        users_data.append(new_user)
        save_data()  # Save data after adding user
        
        return jsonify({
            "message": "User created successfully",
            "user": {"id": new_user['id'], "username": username, "email": email}
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/orders', methods=['POST'])
def submit_order():
    try:
        order_data = request.get_json()
        
        # Generate new order ID
        new_order_id = len(orders_data) + 1
        
        order = {
            "id": new_order_id,
            "orderId": f"ORD-{new_order_id:06d}",
            "items": order_data.get('items', []),
            "shippingDetails": order_data.get('shippingDetails', {}),
            "total": order_data.get('total', 0),
            "status": "pending",
            "orderDate": datetime.now().isoformat(),
            "estimatedDelivery": None
        }
        
        orders_data.append(order)
        save_data()  # Save data after adding order
        
        return jsonify({
            "message": "Order submitted successfully",
            "orderId": order['orderId'],
            "order": order
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/orders', methods=['GET'])
def get_orders():
    return jsonify(orders_data)

@app.route('/api/users', methods=['GET'])
def get_users():
    # Return users without passwords
    safe_users = [
        {
            "id": u.get('id'),
            "username": u.get('username'),
            "email": u.get('email'),
            "created_at": u.get('created_at')
        }
        for u in users_data
    ]
    return jsonify(safe_users)

@app.route('/api/bag/<user_email>', methods=['GET'])
def get_user_bag(user_email):
    """Get user's shopping bag"""
    try:
        user_bag = bags_data.get(user_email, [])
        return jsonify(user_bag)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/bag/<user_email>', methods=['POST'])
def save_user_bag(user_email):
    """Save user's shopping bag"""
    try:
        bag_items = request.get_json()
        bags_data[user_email] = bag_items
        save_data()  # Save to file
        return jsonify({"message": "Bag saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/bag/<user_email>', methods=['DELETE'])
def clear_user_bag(user_email):
    """Clear user's shopping bag"""
    try:
        bags_data[user_email] = []
        save_data()  # Save to file
        return jsonify({"message": "Bag cleared successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/users', methods=['POST'])
def create_user():
    """Admin-only user creation endpoint"""
    try:
        # Check if request has admin authorization (in a real app, you'd validate JWT token)
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Admin '):
            return jsonify({"error": "Admin access required"}), 403
        
        user_data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'role']
        for field in required_fields:
            if field not in user_data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Check if user already exists
        existing_user = next((u for u in users_data if u.get('email') == user_data['email']), None)
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 400
        
        # Generate new ID
        new_id = max([u.get('id', 0) for u in users_data], default=0) + 1
        
        # Create new user with temporary password
        new_user = {
            'id': new_id,
            'username': user_data['username'],
            'email': user_data['email'],
            'password': 'TempPass123!',  # Temporary password
            'role': user_data.get('role', 'user'),
            'created_at': datetime.now().isoformat(),
            'must_change_password': True,  # Flag for mandatory password change
            'status': 'active'
        }
        
        users_data.append(new_user)
        save_data()
        
        # Return user without password
        safe_user = {k: v for k, v in new_user.items() if k != 'password'}
        return jsonify(safe_user), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user information"""
    try:
        user_data = request.get_json()
        
        # Find user
        user_index = next((i for i, u in enumerate(users_data) if u.get('id') == user_id), None)
        if user_index is None:
            return jsonify({"error": "User not found"}), 404
        
        # Update user data
        user = users_data[user_index]
        
        # Allow updating specific fields
        updatable_fields = ['username', 'email', 'role', 'status']
        for field in updatable_fields:
            if field in user_data:
                user[field] = user_data[field]
        
        user['updated_at'] = datetime.now().isoformat()
        save_data()
        
        # Return updated user without password
        safe_user = {k: v for k, v in user.items() if k != 'password'}
        return jsonify(safe_user), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/users/<int:user_id>/change-password', methods=['POST'])
def change_password(user_id):
    """Change user password (for mandatory password change)"""
    try:
        data = request.get_json()
        
        # Find user
        user_index = next((i for i, u in enumerate(users_data) if u.get('id') == user_id), None)
        if user_index is None:
            return jsonify({"error": "User not found"}), 404
        
        user = users_data[user_index]
        
        # For first-time password change, check temporary password
        if user.get('must_change_password'):
            if data.get('current_password') != user.get('password'):
                return jsonify({"error": "Invalid current password"}), 400
        else:
            # For regular password change, verify current password
            if data.get('current_password') != user.get('password'):
                return jsonify({"error": "Invalid current password"}), 400
        
        # Validate new password
        new_password = data.get('new_password')
        if not new_password or len(new_password) < 8:
            return jsonify({"error": "Password must be at least 8 characters long"}), 400
        
        # Update password and remove mandatory change flag
        user['password'] = new_password
        user['must_change_password'] = False
        user['password_changed_at'] = datetime.now().isoformat()
        save_data()
        
        return jsonify({"message": "Password changed successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Enhanced login with password change check"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400
        
        # Find user
        user = next((u for u in users_data if u.get('email') == email), None)
        if not user or user.get('password') != password:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Check if user must change password
        must_change_password = user.get('must_change_password', False)
        
        # Return user info without password
        safe_user = {k: v for k, v in user.items() if k != 'password'}
        safe_user['must_change_password'] = must_change_password
        
        return jsonify({
            "user": safe_user,
            "message": "Login successful",
            "must_change_password": must_change_password
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve static files (frontend) from Flask
@app.route('/')
def serve_frontend():
    return send_file('../../index.html')

@app.route('/<path:filename>')
def serve_static_files(filename):
    try:
        # Try to serve from root directory (where frontend files are)
        return send_from_directory('../../', filename)
    except:
        # If file not found, serve index.html (for SPA routing)
        return send_file('../../index.html')

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "products_count": len(products_data),
        "users_count": len(users_data),
        "orders_count": len(orders_data),
        "bags_count": len(bags_data)
    })

if __name__ == '__main__':
    print("🚀 Starting Thrift Ease API Server...")
    print("📍 Server running at: http://localhost:5000")
    print("📊 API endpoints available:")
    print("   GET  /api/products")
    print("   POST /api/products")
    print("   POST /api/auth/signin")
    print("   POST /api/auth/signup")
    print("   POST /api/orders")
    print("   GET  /api/orders")
    print("   GET  /api/users")
    print("   GET  /api/health")
    
    # Get port from environment variable for deployment, or use 5000 for local
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    
    app.run(debug=debug_mode, port=port, host='0.0.0.0')

# Load data on startup and initialize admin
load_data()
init_default_admin()