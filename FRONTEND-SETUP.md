# 🎯 Thrift Ease Frontend - Standalone Setup

## 📋 **Overview**

This is the frontend-only repository for Thrift Ease, a React-based e-commerce application. The backend is maintained in a separate repository.

---

## 🏗️ **Architecture**

```
Frontend (This Repo)     Backend (Separate Repo)
┌─────────────────┐      ┌─────────────────┐
│   React App     │ ────►│   API Server    │
│   (Port 3000)   │ HTTP │   (Port 5000)   │
│                 │      │                 │
│ • User Interface│      │ • REST API      │
│ • State Mgmt    │      │ • Database      │
│ • Routing       │      │ • Auth          │
│ • API Calls     │      │ • File Upload   │
└─────────────────┘      └─────────────────┘
```

---

## 🚀 **Quick Start**

### **1. Install Dependencies**
\`\`\`bash
npm install
\`\`\`

### **2. Configure Environment**
\`\`\`bash
# Copy environment template
cp .env.example .env

# Edit .env file with your backend URL
VITE_API_URL=http://localhost:5000/api
\`\`\`

### **3. Start Development Server**
\`\`\`bash
npm run dev
\`\`\`

The app will be available at: \`http://localhost:3000\`

---

## 🔧 **Configuration**

### **Environment Variables**

Create a \`.env\` file in the root directory:

\`\`\`env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=ThriftEase
VITE_APP_VERSION=1.0.0
\`\`\`

### **Production Configuration**

For production deployments, update \`netlify.toml\` or \`vercel.json\` with your production backend URL.

---

## 📂 **Project Structure**

\`\`\`
/src
├── main.jsx                    # App entry point
├── App.jsx                     # Main app component
├── App.css                     # Global styles
│
├── components/                 # Reusable UI components
│   ├── Header.jsx              # Navigation header
│   ├── Footer.jsx              # Site footer
│   ├── ProductCard.jsx         # Product display card
│   └── ProtectedRoute.jsx      # Authentication guard
│
├── pages/                      # Page components
│   ├── Home.jsx                # Landing page
│   ├── SignIn.jsx              # Login page
│   ├── SignUp.jsx              # Registration page
│   ├── Bag.jsx                 # Shopping cart
│   ├── ProductDetails.jsx      # Product detail page
│   ├── Admin.jsx               # Admin dashboard
│   └── Category/               # Category pages
│       ├── Women.jsx
│       ├── Men.jsx
│       ├── Kids.jsx
│       └── Shoes.jsx
│
├── contexts/                   # React contexts
│   ├── AuthContext.jsx         # Authentication state
│   └── CartContext.jsx         # Shopping cart state
│
├── services/                   # API services
│   ├── index.js                # Service exports
│   ├── baseApi.js              # Base API class
│   ├── authService.js          # Authentication API
│   ├── productService.js       # Product API
│   ├── cartService.js          # Cart API
│   ├── orderService.js         # Order API
│   ├── uploadService.js        # File upload API
│   └── adminService.js         # Admin API
│
└── utils/                      # Utility functions
    ├── tokenUtils.js           # JWT token handling
    ├── errorHandler.js         # Error processing
    ├── validators.js           # Input validation
    └── formatters.js           # Data formatting
\`\`\`

---

## 🛠️ **Available Scripts**

\`\`\`bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Testing
npm test             # Run tests (if configured)
\`\`\`

---

## 🌐 **API Integration**

The frontend communicates with the backend via RESTful APIs. All API calls are handled through the service layer:

### **Service Usage Examples**

\`\`\`javascript
import { authService, productService } from '../services'

// Authentication
await authService.login(email, password)
await authService.register(userData)

// Products
const products = await productService.getProducts('women')
const product = await productService.getProduct(productId)
\`\`\`

### **Environment-Based API URLs**

- **Development**: \`http://localhost:5000/api\`
- **Production**: Set via \`VITE_API_URL\` environment variable

---

## 🚀 **Deployment**

### **Netlify**
1. Connect your GitHub repository
2. Set build command: \`npm run build\`
3. Set publish directory: \`dist\`
4. Add environment variable: \`VITE_API_URL\`

### **Vercel**
1. Import project from GitHub
2. Framework preset: Vite
3. Add environment variable: \`VITE_API_URL\`

### **Manual Build**
\`\`\`bash
npm run build
# Deploy 'dist' folder to your hosting provider
\`\`\`

---

## 🔗 **Backend Requirements**

Your backend must provide the following API endpoints:

### **Authentication**
- \`POST /api/auth/login\`
- \`POST /api/auth/register\`
- \`POST /api/auth/logout\`

### **Products**
- \`GET /api/products\`
- \`GET /api/products/:id\`
- \`POST /api/products\` (admin)
- \`PUT /api/products/:id\` (admin)
- \`DELETE /api/products/:id\` (admin)

### **Cart & Orders**
- \`GET /api/cart\`
- \`POST /api/cart/add\`
- \`PUT /api/cart/:id\`
- \`DELETE /api/cart/:id\`
- \`POST /api/orders\`
- \`GET /api/orders\`

### **File Upload**
- \`POST /api/upload-image\`
- \`GET /api/uploads/:filename\`

### **Admin**
- \`GET /api/admin/users\`
- \`GET /api/admin/dashboard/stats\`

---

## 🛡️ **Security**

- JWT tokens for authentication
- Protected routes for authenticated users
- Input validation on forms
- File upload validation
- CORS configuration required on backend

---

## 🎨 **Styling**

- Modern CSS with Flexbox/Grid
- Responsive design for all devices
- Dark/light mode support ready
- Component-based styling

---

## 📱 **Features**

- ✅ User authentication & registration
- ✅ Product catalog with categories
- ✅ Shopping cart functionality
- ✅ Product search and filtering
- ✅ Admin panel for product management
- ✅ Image upload for products
- ✅ Responsive design
- ✅ Modern React architecture

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📞 **Support**

For issues related to:
- **Frontend**: Create an issue in this repository
- **Backend**: Check your separate backend repository
- **API**: Ensure your backend implements the required endpoints

---

**Status**: ✅ **FRONTEND READY** - Cleaned and optimized for standalone deployment
