from flask import Flask, jsonify, request, send_from_directory, send_file
from flask_cors import CORS
from datetime import datetime
import json
import os
import atexit
from io import BytesIO
import base64
from werkzeug.utils import secure_filename
import uuid

app = Flask(__name__)
# Configure CORS for production (Netlify) and development
CORS(app, origins=[
    "https://thrift-ease.netlify.app",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000"
], supports_credentials=True)

# Configuration for file uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB max file size

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Data file paths
DATA_DIR = 'data'
PRODUCTS_FILE = os.path.join(DATA_DIR, 'products.json')
USERS_FILE = os.path.join(DATA_DIR, 'users.json')
ORDERS_FILE = os.path.join(DATA_DIR, 'orders.json')
BAGS_FILE = os.path.join(DATA_DIR, 'bags.json')

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

# Initialize global variables
products_data = []
users_data = []
orders_data = []
bags_data = {}

def load_data():
    """Load data from JSON files"""
    global products_data, users_data, orders_data, bags_data
    
    # Load products
    try:
        if os.path.exists(PRODUCTS_FILE):
            print(f"Loading products from {PRODUCTS_FILE}")
            with open(PRODUCTS_FILE, 'r') as f:
                content = f.read().strip()
                print(f"Products file content: '{content}'")
                if content:
                    products_data = json.loads(content)
                else:
                    products_data = []
        else:
            print("Products file doesn't exist, creating empty list")
            products_data = []
            save_products()  # Create empty file
    except Exception as e:
        print(f"Error loading products: {e}")
        products_data = []
    
    # Load users
    try:
        if os.path.exists(USERS_FILE):
            print(f"Loading users from {USERS_FILE}")
            with open(USERS_FILE, 'r') as f:
                content = f.read().strip()
                print(f"Users file content: '{content}'")
                if content:
                    users_data = json.loads(content)
                else:
                    users_data = []
        else:
            print("Users file doesn't exist, creating empty list")
            users_data = []
    except Exception as e:
        print(f"Error loading users: {e}")
        users_data = []
    
    # Load orders
    try:
        if os.path.exists(ORDERS_FILE):
            with open(ORDERS_FILE, 'r') as f:
                content = f.read().strip()
                if content:
                    orders_data = json.loads(content)
                else:
                    orders_data = []
        else:
            orders_data = []
    except Exception as e:
        print(f"Error loading orders: {e}")
        orders_data = []
    
    # Load bags
    try:
        if os.path.exists(BAGS_FILE):
            with open(BAGS_FILE, 'r') as f:
                content = f.read().strip()
                if content:
                    bags_data = json.loads(content)
                else:
                    bags_data = {}
        else:
            bags_data = {}  # Store as {user_email: [bag_items]}
    except Exception as e:
        print(f"Error loading bags: {e}")
        bags_data = {}

def save_products():
    """Save products data to JSON file"""
    try:
        with open(PRODUCTS_FILE, 'w') as f:
            json.dump(products_data, f, indent=2)
        print(f"Products saved to {PRODUCTS_FILE}")
    except Exception as e:
        print(f"Error saving products: {e}")

def save_users():
    """Save users data to JSON file"""
    try:
        with open(USERS_FILE, 'w') as f:
            json.dump(users_data, f, indent=2)
        print(f"Users saved to {USERS_FILE}")
    except Exception as e:
        print(f"Error saving users: {e}")

def save_orders():
    """Save orders data to JSON file"""
    try:
        with open(ORDERS_FILE, 'w') as f:
            json.dump(orders_data, f, indent=2)
        print(f"Orders saved to {ORDERS_FILE}")
    except Exception as e:
        print(f"Error saving orders: {e}")

def save_bags():
    """Save bags data to JSON file"""
    try:
        with open(BAGS_FILE, 'w') as f:
            json.dump(bags_data, f, indent=2)
        print(f"Bags saved to {BAGS_FILE}")
    except Exception as e:
        print(f"Error saving bags: {e}")

def save_data():
    """Save data to JSON files"""
    save_products()
    save_users()
    save_orders()
    save_bags()

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

# Load data on startup and initialize admin
load_data()
init_default_admin()

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
        
        # Validate required fields
        required_fields = ['name', 'price', 'category']
        for field in required_fields:
            if field not in product_data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Generate new ID
        new_id = max([p.get('id', 0) for p in products_data], default=0) + 1
        product_data['id'] = new_id
        
        # Add timestamps and status
        product_data['created_at'] = datetime.now().isoformat()
        product_data['updated_at'] = datetime.now().isoformat()
        product_data['status'] = product_data.get('status', 'active')
        
        # Set default values
        product_data['views'] = 0
        product_data['sold'] = False
        
        products_data.append(product_data)
        save_products()  # Save only products data
        
        return jsonify({"message": "Product added successfully", "product": product_data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    try:
        product = next((p for p in products_data if p.get('id') == product_id), None)
        if product:
            # Increment view count
            product['views'] = product.get('views', 0) + 1
            save_products()
            return jsonify(product)
        else:
            return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        product_data = request.get_json()
        product_index = next((i for i, p in enumerate(products_data) if p.get('id') == product_id), None)
        
        if product_index is not None:
            # Update the product while preserving id and created_at
            original_product = products_data[product_index]
            product_data['id'] = product_id
            product_data['created_at'] = original_product.get('created_at')
            product_data['updated_at'] = datetime.now().isoformat()
            product_data['views'] = original_product.get('views', 0)
            
            products_data[product_index] = product_data
            save_products()
            
            return jsonify({"message": "Product updated successfully", "product": product_data})
        else:
            return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        product_index = next((i for i, p in enumerate(products_data) if p.get('id') == product_id), None)
        
        if product_index is not None:
            deleted_product = products_data.pop(product_index)
            save_products()
            
            return jsonify({"message": "Product deleted successfully", "product": deleted_product})
        else:
            return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/products/category/<category>', methods=['GET'])
def get_products_by_category(category):
    try:
        # Filter products by main category
        filtered_products = [
            p for p in products_data 
            if p.get('category', '').lower() == category.lower() 
            or p.get('mainCategory', '').lower() == category.lower()
            and p.get('status', 'active') == 'active'
        ]
        return jsonify(filtered_products)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/products/search', methods=['GET'])
def search_products():
    try:
        query = request.args.get('q', '').lower()
        category = request.args.get('category', '')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        
        filtered_products = []
        
        for product in products_data:
            if product.get('status', 'active') != 'active':
                continue
                
            # Text search
            if query:
                searchable_text = f"{product.get('name', '')} {product.get('description', '')} {product.get('category', '')} {product.get('brand', '')}".lower()
                if query not in searchable_text:
                    continue
            
            # Category filter
            if category and category.lower() not in product.get('category', '').lower():
                continue
            
            # Price filter
            price = product.get('price', 0)
            if min_price is not None and price < min_price:
                continue
            if max_price is not None and price > max_price:
                continue
                
            filtered_products.append(product)
        
        return jsonify(filtered_products)
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

@app.route('/api/auth/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        print(f"Registration attempt with data: {data}")  # Debug logging
        
        # Validate JSON data exists
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                print(f"Missing field: {field}")  # Debug logging
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        email = data['email'].lower().strip()
        username = data['username'].strip()
        password = data['password']
        
        # Extract optional firstName and lastName
        firstName = data.get('firstName', '').strip()
        lastName = data.get('lastName', '').strip()
        
        print(f"Processing registration for email: {email}, username: {username}")  # Debug logging
        
        # Check if user already exists by EMAIL ONLY (names can be duplicated)
        existing_user = next((u for u in users_data if u.get('email', '').lower() == email), None)
        if existing_user:
            print(f"Email already registered: {email}")  # Debug logging
            return jsonify({"error": "An account with this email address already exists. Please use a different email or try signing in."}), 400
        
        # Validate password strength
        if len(password) < 8:
            print("Password too short")  # Debug logging
            return jsonify({"error": "Password must be at least 8 characters long"}), 400
        
        # Generate new ID - fix the duplicate ID issue
        current_ids = [u.get('id', 0) for u in users_data if u.get('id') is not None]
        new_id = max(current_ids, default=0) + 1
        print(f"Assigning new user ID: {new_id}")  # Debug logging
        
        # Create new user
        new_user = {
            'id': new_id,
            'username': username,
            'firstName': firstName,
            'lastName': lastName,
            'email': email,
            'password': password,  # In production, this should be hashed
            'role': 'user',
            'created_at': datetime.now().isoformat(),
            'status': 'active',
            'must_change_password': False
        }
        
        users_data.append(new_user)
        save_data()
        
        print(f"User registered successfully: {email}")  # Debug logging
        
        # Return user without password
        safe_user = {k: v for k, v in new_user.items() if k != 'password'}
        return jsonify({
            "user": safe_user,
            "message": "Registration successful"
        }), 201
        
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({"error": str(e)}), 500

# Serve static files (frontend) from Flask
@app.route('/')
def serve_frontend():
    return jsonify({
        "message": "QuickThrift API Server",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "products": "/api/products",
            "auth": "/api/auth",
            "orders": "/api/orders",
            "health": "/api/health"
        }
    })

# Remove static file serving since we're using React dev server
# @app.route('/<path:filename>')
# def serve_static_files(filename):
#     pass

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

@app.route('/api/placeholder/<int:width>/<int:height>')
def placeholder_image(width, height):
    """Generate a simple placeholder image"""
    try:
        # Create a simple SVG placeholder
        svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f0f0f0"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial, sans-serif" font-size="16">
    {width} × {height}
  </text>
</svg>'''
        
        return svg_content, 200, {'Content-Type': 'image/svg+xml'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ===================================================================
# ADMIN ENDPOINTS
# ===================================================================

def require_admin():
    """Check if user has admin privileges"""
    # In a real app, this would verify JWT token and check user role
    # For now, we'll implement a simple check
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return False
    
    # Extract token and validate admin role
    # This is a simplified implementation
    return True  # For development, allow all admin requests

@app.route('/api/admin/dashboard', methods=['GET'])
def get_admin_dashboard():
    try:
        if not require_admin():
            return jsonify({"error": "Admin privileges required"}), 403
        
        # Calculate statistics
        total_products = len(products_data)
        active_products = len([p for p in products_data if p.get('status') == 'active'])
        total_orders = len(orders_data)
        total_users = len(users_data)
        
        # Calculate revenue
        total_revenue = sum(order.get('total', 0) for order in orders_data if order.get('status') == 'completed')
        
        # Recent activities
        recent_products = sorted(products_data, key=lambda x: x.get('created_at', ''), reverse=True)[:5]
        recent_orders = sorted(orders_data, key=lambda x: x.get('created_at', ''), reverse=True)[:5]
        
        return jsonify({
            "totalProducts": total_products,
            "activeProducts": active_products,
            "totalOrders": total_orders,
            "totalUsers": total_users,
            "totalRevenue": total_revenue,
            "recentProducts": recent_products,
            "recentOrders": recent_orders
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/products', methods=['GET'])
def get_admin_products():
    try:
        if not require_admin():
            return jsonify({"error": "Admin privileges required"}), 403
        
        # Return all products with admin details
        admin_products = []
        for product in products_data:
            admin_product = {
                **product,
                'views': product.get('views', 0),
                'status': product.get('status', 'active'),
                'created_at': product.get('created_at'),
                'updated_at': product.get('updated_at')
            }
            admin_products.append(admin_product)
        
        return jsonify(admin_products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/products', methods=['POST'])
def admin_add_product():
    try:
        if not require_admin():
            return jsonify({"error": "Admin privileges required"}), 403
        
        # Use the existing add_product logic
        return add_product()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/products/<int:product_id>', methods=['PUT'])
def admin_update_product(product_id):
    try:
        if not require_admin():
            return jsonify({"error": "Admin privileges required"}), 403
        
        # Use the existing update_product logic
        return update_product(product_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/products/<int:product_id>', methods=['DELETE'])
def admin_delete_product(product_id):
    try:
        if not require_admin():
            return jsonify({"error": "Admin privileges required"}), 403
        
        # Use the existing delete_product logic
        return delete_product(product_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/orders', methods=['GET'])
def get_admin_orders():
    try:
        if not require_admin():
            return jsonify({"error": "Admin privileges required"}), 403
        
        return jsonify(orders_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/orders/<int:order_id>', methods=['PUT'])
def update_order_status(order_id):
    try:
        if not require_admin():
            return jsonify({"error": "Admin privileges required"}), 403
        
        order_data = request.get_json()
        new_status = order_data.get('status')
        
        if not new_status:
            return jsonify({"error": "Status is required"}), 400
        
        order_index = next((i for i, o in enumerate(orders_data) if o.get('id') == order_id), None)
        
        if order_index is not None:
            orders_data[order_index]['status'] = new_status
            orders_data[order_index]['updated_at'] = datetime.now().isoformat()
            save_orders()
            
            return jsonify({"message": "Order status updated successfully", "order": orders_data[order_index]})
        else:
            return jsonify({"error": "Order not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/users', methods=['GET'])
def get_admin_users():
    try:
        if not require_admin():
            return jsonify({"error": "Admin privileges required"}), 403
        
        # Return users without passwords
        safe_users = []
        for user in users_data:
            safe_user = {k: v for k, v in user.items() if k != 'password'}
            safe_users.append(safe_user)
        
        return jsonify(safe_users)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/users/<int:user_id>', methods=['PUT'])
def update_user_role(user_id):
    try:
        if not require_admin():
            return jsonify({"error": "Admin privileges required"}), 403
        
        user_data = request.get_json()
        new_role = user_data.get('role')
        
        if not new_role:
            return jsonify({"error": "Role is required"}), 400
        
        user_index = next((i for i, u in enumerate(users_data) if u.get('id') == user_id), None)
        
        if user_index is not None:
            users_data[user_index]['role'] = new_role
            users_data[user_index]['updated_at'] = datetime.now().isoformat()
            save_users()
            
            # Return user without password
            safe_user = {k: v for k, v in users_data[user_index].items() if k != 'password'}
            return jsonify({"message": "User role updated successfully", "user": safe_user})
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        if not require_admin():
            return jsonify({"error": "Admin privileges required"}), 403
        
        user_index = next((i for i, u in enumerate(users_data) if u.get('id') == user_id), None)
        
        if user_index is not None:
            deleted_user = users_data.pop(user_index)
            save_users()
            
            # Return user without password
            safe_user = {k: v for k, v in deleted_user.items() if k != 'password'}
            return jsonify({"message": "User deleted successfully", "user": safe_user})
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ===================================================================
# SPECIAL OFFERS ENDPOINTS
# ===================================================================

@app.route('/api/special-offers', methods=['GET'])
def get_special_offers():
    try:
        # For now, return dynamic offers based on existing products
        current_time = datetime.now()
        
        # Create sample special offers from existing products
        offers = []
        
        # Women's offer
        women_products = [p for p in products_data if 'women' in p.get('category', '').lower()][:3]
        if women_products:
            offers.append({
                "id": "offer-women",
                "title": "Women's Flash Sale - 40% Off",
                "description": "Limited time offer on selected women's clothing",
                "discount": 40,
                "category": "Women",
                "endTime": (current_time.timestamp() + 86400) * 1000,  # 24 hours from now
                "products": women_products
            })
        
        # Men's offer
        men_products = [p for p in products_data if 'men' in p.get('category', '').lower()][:3]
        if men_products:
            offers.append({
                "id": "offer-men",
                "title": "Men's Clearance - 35% Off",
                "description": "End of season clearance on men's apparel",
                "discount": 35,
                "category": "Men",
                "endTime": (current_time.timestamp() + 259200) * 1000,  # 3 days from now
                "products": men_products
            })
        
        # Shoes offer
        shoes_products = [p for p in products_data if 'shoe' in p.get('category', '').lower()][:3]
        if shoes_products:
            offers.append({
                "id": "offer-shoes",
                "title": "Shoe Sale - 30% Off",
                "description": "Step into savings with our shoe collection",
                "discount": 30,
                "category": "Shoes",
                "endTime": (current_time.timestamp() + 432000) * 1000,  # 5 days from now
                "products": shoes_products
            })
        
        return jsonify(offers)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/special-offers', methods=['POST'])
def create_special_offer():
    try:
        if not require_admin():
            return jsonify({"error": "Admin privileges required"}), 403
        
        offer_data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'discount', 'category', 'endTime']
        for field in required_fields:
            if field not in offer_data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Here you would typically save to a special_offers.json file
        # For now, we'll just return success
        return jsonify({"message": "Special offer created successfully", "offer": offer_data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    """Upload an image file for products"""
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if file and allowed_file(file.filename):
            # Generate unique filename to avoid conflicts
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
            file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
            
            # Save the file
            file.save(file_path)
            
            # Generate file URL for frontend access
            file_url = f"/api/uploads/{unique_filename}"
            
            return jsonify({
                "message": "Image uploaded successfully",
                "filename": unique_filename,
                "url": file_url
            }), 201
        else:
            return jsonify({"error": "Invalid file type. Only PNG, JPG, JPEG, GIF, and WebP files are allowed"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/uploads/<filename>', methods=['GET'])
def serve_uploaded_file(filename):
    """Serve uploaded files"""
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except Exception as e:
        return jsonify({"error": "File not found"}), 404

if __name__ == '__main__':
    print("🚀 Starting Thrift Ease API server...")
    print("📍 API Base URL: http://localhost:5000/api")
    print("🔧 Available endpoints: /api/health, /api/products, /api/auth, etc.")
    app.run(host='0.0.0.0', port=5000, debug=True)