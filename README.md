# 🛍️ QuickThrift - Full Stack E-commerce Platform

A modern, secure thrift store e-commerce platform built with vanilla JavaScript frontend, Python Flask API, and Node.js static server. Features a comprehensive admin panel with role-based access control.

![QuickThrift Demo](demo1.jpeg)

## 🚀 Live Demo

- **Frontend**: [https://quickthrift.netlify.app](https://quickthrift.netlify.app)
- **Backend API**: [https://thrift-ease-1.onrender.com](https://thrift-ease-1.onrender.com)
- **Admin Panel**: [https://quickthrift.netlify.app/admin.html](https://quickthrift.netlify.app/admin.html)

### 🔐 Admin Credentials
- **Email**: `admin@quickthrift.com`
- **Password**: `TempPass123!` (must be changed on first login)

---

## 📁 Project Architecture

```
thrift-ease/
├── 🎨 Frontend (Vanilla JS/HTML/CSS)
│   ├── index.html                 # Main shop page
│   ├── admin.html                 # Admin dashboard
│   ├── change-password.html       # Password change page
│   ├── new-*.html                 # Category pages (Women, Men, Kids, Shoes)
│   ├── css/                       # Modular CSS architecture
│   │   ├── guza-style.css         # Main styles
│   │   ├── admin.css              # Admin panel styles
│   │   └── variables.css          # CSS custom properties
│   ├── js/                        # JavaScript modules
│   │   ├── quickthrift-functional.js  # Main app logic
│   │   ├── admin.js               # Admin functionality
│   │   ├── auth-system.js         # Authentication system
│   │   └── admin-auth.js          # Admin role management
│   └── icons/                     # PWA icons & assets
├── 🐍 Backend (Python Flask API)
│   ├── app.py                     # Flask API server
│   ├── requirements.txt           # Python dependencies
│   ├── runtime.txt                # Python version (3.9.18)
│   ├── Procfile                   # Render deployment config
│   └── data/                      # JSON data storage
│       ├── products.json          # Product catalog
│       ├── users.json             # User accounts
│       ├── orders.json            # Order history
│       └── bags.json              # Shopping cart data
└── 🟢 Server (Node.js Express)
    ├── server.js                  # Static file server
    ├── package.json               # Node.js dependencies
    └── render.yaml                # Multi-service deployment
```

---

## ✅ Stack Responsibilities

### 🎨 Frontend (Vanilla JavaScript + HTML/CSS)
> **Location**: Root directory

#### **Responsibilities:**
- ✅ User interface rendering and responsive design
- ✅ User interaction handling (forms, buttons, navigation)
- ✅ Client-side state management (cart, user session)
- ✅ API consumption via `fetch()` calls to Flask backend
- ✅ Progressive Web App (PWA) features
- ✅ Form validation and real-time feedback
- ✅ Dynamic content updates without page refresh

#### **Key Features:**
- 📱 Mobile-first responsive design
- 🛒 Shopping cart with localStorage persistence
- 🔐 Role-based authentication UI
- ⚡ Fast, vanilla JS (no frameworks)
- 🎯 Accessibility features (ARIA, keyboard navigation)

#### **🚫 Not Responsible For:**
- Data storage or processing
- Business logic execution
- File serving (handled by Express)

---

### 🐍 Backend (Python Flask API)
> **Location**: `backend/`

#### **Responsibilities:**
- ✅ RESTful API endpoints for all data operations
- ✅ Business logic (CRUD operations, validation)
- ✅ Data persistence to JSON files
- ✅ User authentication and authorization
- ✅ Admin-only user creation system
- ✅ Password security and mandatory changes
- ✅ CORS handling for cross-origin requests

#### **API Endpoints:**
```python
# Products
GET    /api/products           # Get all products
POST   /api/products           # Add new product (admin only)
PUT    /api/products/{id}      # Update product (admin only)
DELETE /api/products/{id}      # Delete product (admin only)

# Users & Authentication
GET    /api/users              # Get all users (admin only)
POST   /api/users              # Create user (admin only)
PUT    /api/users/{id}         # Update user
POST   /api/auth/login         # User login with password check
POST   /api/users/{id}/change-password  # Mandatory password change

# Orders & Shopping
GET    /api/orders             # Get orders (admin only)
POST   /api/orders             # Create order
GET    /api/bag/{email}        # Get user's shopping bag
POST   /api/bag/{email}        # Save shopping bag
DELETE /api/bag/{email}        # Clear shopping bag
```

#### **Security Features:**
- 🔐 Admin-only user creation with authorization headers
- 🛡️ Temporary password system with mandatory changes
- 🔑 Strong password validation requirements
- 👤 Role-based access control (admin/user)

#### **🚫 Not Responsible For:**
- Frontend rendering or UI logic
- Static file serving
- Client-side state management

---

### 🟢 Server (Node.js Express)
> **Location**: `server.js`

#### **Responsibilities:**
- ✅ Static file serving ONLY (HTML, CSS, JS, images)
- ✅ SPA routing (all routes → index.html)
- ✅ Development server functionality
- ✅ PWA manifest and service worker serving

#### **Configuration:**
```javascript
// Pure static server - NO business logic
app.use(express.static(__dirname));
app.get('*', (req, res) => res.sendFile('index.html'));
```

#### **🚫 Not Responsible For:**
- Business logic or data processing
- API endpoints or database operations
- User authentication logic

---

## 🔄 Application Flow

### **User Shopping Experience:**
1. **Page Load**: Express serves `index.html` + assets
2. **Product Display**: JS fetches from Flask `/api/products`
3. **Add to Cart**: JS stores in localStorage + syncs to Flask `/api/bag/{email}`
4. **Checkout**: JS sends order to Flask `/api/orders`
5. **UI Update**: Frontend updates dynamically without page reload

### **Admin User Management:**
1. **Admin Login**: Checks credentials via Flask `/api/auth/login`
2. **Create User**: Admin posts to Flask `/api/users` (authorization required)
3. **User Gets Temp Password**: System assigns `TempPass123!`
4. **First Login**: User redirected to `/change-password.html`
5. **Password Change**: Validates + saves via Flask `/api/users/{id}/change-password`
6. **Access Granted**: User can now use the system normally

---

## 🛠️ Installation & Setup

### **Prerequisites:**
- Node.js 14+ 
- Python 3.9+
- Git

### **Local Development:**

```bash
# Clone repository
git clone https://github.com/Georgemuchir/thrift-ease.git
cd thrift-ease

# Start Frontend Server (Node.js)
npm install
npm start
# → http://localhost:3000

# Start Backend API (Python Flask) - New Terminal
cd backend
pip install -r requirements.txt
python app.py
# → http://localhost:5000
```

### **Environment Configuration:**
The app automatically detects environment:
- **Development**: Uses `http://127.0.0.1:5000` (local Flask)
- **Production**: Uses `https://thrift-ease-1.onrender.com` (deployed API)

---

## 🔐 Security Features

### **Admin-Only User Creation:**
- ✅ Only existing admins can create new users
- ✅ Authorization header validation: `Authorization: Admin {email}`
- ✅ New users get temporary password: `TempPass123!`
- ✅ Mandatory password change on first login

### **Password Security:**
- ✅ Strong password requirements (8+ chars, upper, lower, number, special)
- ✅ Real-time validation with visual feedback
- ✅ Secure password change flow
- ✅ Session management with localStorage

### **Role-Based Access:**
- 👑 **Admin**: Full access to admin panel, user creation, product management
- 👤 **User**: Shopping, order history, profile management
- 🚫 **Guest**: Browse products only

---

## 🚀 Deployment

### **Frontend (Netlify):**
```bash
# Deploy frontend as static site
netlify deploy --prod --dir=.
```

### **Backend (Render.com):**
```yaml
# render.yaml configuration included
# Automatically deploys Flask API with Gunicorn
```

### **Multi-Service Architecture:**
- **Frontend**: Static CDN hosting (Netlify/Vercel)
- **Backend**: API hosting (Render/Railway)
- **Data**: JSON file persistence (upgradeable to PostgreSQL)

---

## 📱 Progressive Web App (PWA)

✅ **PWA Features:**
- 📱 Installable on mobile devices
- ⚡ Service worker caching
- 📶 Offline functionality
- 🎨 Custom splash screen
- 🔔 Push notification ready

---

## 🧪 Testing

### **Admin Panel Testing:**
1. Login: `admin@quickthrift.com` / `TempPass123!`
2. Change password on first login
3. Create new user account
4. Test user creation flow

### **API Testing:**
```bash
# Test API endpoints
curl https://thrift-ease-1.onrender.com/api/products
curl -X POST https://thrift-ease-1.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@quickthrift.com","password":"YourNewPassword"}'
```

---

## 📈 Performance Features

- ⚡ **Vanilla JS**: No framework overhead
- 🎯 **Lazy Loading**: Images and components load on demand
- 📦 **Modular CSS**: Component-based styling
- 🗂️ **JSON Storage**: Fast file-based data access
- 🌐 **CDN Ready**: Optimized for static hosting

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**George Muchiri**
- GitHub: [@Georgemuchir](https://github.com/Georgemuchir)
- Project: [QuickThrift](https://github.com/Georgemuchir/thrift-ease)

---

## 🙏 Acknowledgments

- Built with modern web standards
- Responsive design principles
- Security-first approach
- Accessible user interface

---

*QuickThrift - Making thrift shopping modern, secure, and accessible.* 🛍️✨
