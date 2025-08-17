# 🏠 **Thrift Ease Home Page - Complete Backend Requirements**

## 📋 **Overview**
The home page is the **landing page** of your thrift store e-commerce site. It displays a hero section, category navigation, and a complete products showcase. Here's everything the backend needs to support.

---

## 🌐 **API Endpoints Required**

### **1. GET /api/products**
**Purpose**: Fetch ALL products for home page display  
**Used by**: Home page "All Products" section  
**Authentication**: None required (public endpoint)  

**Request:**
```http
GET /api/products
Content-Type: application/json
```

**Expected Response Format:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Vintage Denim Jacket",
      "price": 45.99,
      "description": "Classic vintage denim jacket in excellent condition. Perfect for layering.",
      "category": "women",
      "brand": "Levi's",
      "condition": "excellent",
      "image": "https://your-cdn.com/images/jacket1.jpg",
      "sizes": ["S", "M", "L"],
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    },
    {
      "id": 2, 
      "name": "Classic Leather Boots",
      "price": 89.99,
      "description": "Genuine leather boots with minimal wear. Comfortable and stylish.",
      "category": "shoes",
      "brand": "Dr. Martens", 
      "condition": "good",
      "image": "https://your-cdn.com/images/boots1.jpg",
      "sizes": ["8", "9", "10"],
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 156,
  "page": 1,
  "limit": 50
}
```

**Alternative Response Format** (also supported):
```json
[
  {
    "id": 1,
    "name": "Vintage Denim Jacket",
    // ... same product structure
  }
]
```

---

## 🏗️ **Database Schema Requirements**

### **Products Table:**
```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(100),
    condition VARCHAR(20) NOT NULL,
    image VARCHAR(500),
    sizes TEXT, -- JSON array: ["S", "M", "L"]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

### **Required Categories:**
The frontend expects these exact category values:
- `"women"` - Women's clothing
- `"men"` - Men's clothing  
- `"kids"` - Children's clothing
- `"shoes"` - Footwear for all

### **Required Condition Values:**
- `"excellent"` - Like new condition
- `"good"` - Minor wear, good condition
- `"fair"` - Noticeable wear but functional

---

## 🎨 **Frontend Home Page Structure**

### **1. Hero Section**
**Static content** - no backend needed
- Title: "Thrift is Old School"
- Subtitle: "Discover premium quality thrift fashion at unbeatable prices"
- Call-to-action: "Shop Now" button → `/all` page

### **2. Category Grid**
**Static navigation** - no backend needed
- 5 category cards with hardcoded images
- Links to category pages:
  - `/all` → All Products
  - `/new-women` → Women's section
  - `/new-men` → Men's section  
  - `/new-kids` → Kids section
  - `/new-shoes` → Shoes section

### **3. Featured Products Section**
**Dynamic content** - requires backend
- **API Call**: `GET /api/products`
- **Display**: All products in a grid layout
- **Product Card Data Used**:
  - `product.id` (for cart functionality)
  - `product.name` (product title)
  - `product.price` (displayed as `$${product.price}`)
  - `product.description` (product description)
  - `product.category` (category badge)
  - `product.brand` (brand name)
  - `product.condition` (condition label)
  - `product.image` (product photo)

### **4. Features Section**
**Static content** - no backend needed
- Quality Guaranteed
- Affordable Prices  
- Sustainable Fashion
- Easy Returns

---

## 🛒 **Cart Integration Requirements**

### **Add to Cart Functionality:**
When user clicks "Add to Cart" on home page:

**Frontend Action:**
```javascript
const handleAddToCart = (product) => {
  addToCart(product, 'M', 1) // Default size M, quantity 1
  alert(`${product.name} added to cart!`)
}
```

**Cart Storage:**
- **Local Storage**: Cart items stored in browser localStorage
- **No immediate backend call** for add to cart
- **Product object structure** saved to cart:
```json
{
  "id": 1,
  "name": "Vintage Denim Jacket", 
  "price": 45.99,
  "image": "https://your-cdn.com/images/jacket1.jpg",
  "category": "women",
  "brand": "Levi's",
  "condition": "excellent",
  "size": "M",
  "quantity": 1
}
```

**Note**: Cart persistence to backend happens later during checkout process.

---

## 🖼️ **Image Handling Requirements**

### **Product Images:**
**Expected Format**: Full URLs or relative paths
```json
{
  "image": "https://your-cdn.com/images/product123.jpg"
  // OR
  "image": "/uploads/product123.jpg"  
}
```

### **Fallback Images:**
**Frontend handles fallbacks automatically**:
- If `product.image` is null/empty → uses `/api/placeholder/300/400`
- If image fails to load → automatically switches to placeholder
- **Your backend should**:
  - Provide placeholder endpoint: `GET /api/placeholder/300/400` 
  - Or serve static placeholder from `/uploads/placeholder.jpg`

### **Image Upload Endpoint** (for admin):
```http
POST /api/upload-image
Content-Type: multipart/form-data
Authorization: Bearer {admin_token}

Response:
{
  "url": "https://your-cdn.com/images/uploaded-123.jpg",
  "filename": "uploaded-123.jpg" 
}
```

---

## 🔧 **Error Handling Requirements**

### **Loading States:**
Frontend shows different states based on API response:

**1. Loading State:**
```html
<div class="loading">Loading products...</div>
```

**2. Error State (no products loaded):**
```html
<div class="error">Error: Failed to load products</div>
```

**3. Empty State (no products exist):**
```html
<h3>🛍️ No products available yet</h3>
<p>Our store is currently empty. Check back soon for new arrivals!</p>
```

**4. Partial Error (some products loaded):**
```html
<div class="error-notice">
  ⚠️ Some products may not be displaying correctly
</div>
```

### **Expected Error Responses:**
```json
// 500 Server Error
{
  "error": "Internal server error",
  "message": "Database connection failed"
}

// 404 Not Found  
{
  "error": "Endpoint not found",
  "message": "The requested resource was not found"
}
```

---

## 🚀 **Performance Requirements**

### **Response Time:**
- **GET /api/products**: Should respond within 500ms
- **Image loading**: Should be optimized (compressed, proper format)

### **Pagination Support** (optional but recommended):
```http
GET /api/products?page=1&limit=20
```

**Response with pagination:**
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 20, 
    "total": 156,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🔒 **Security Requirements**

### **CORS Configuration:**
```python
# Allow frontend domain
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "https://your-frontend.com"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

### **Rate Limiting** (recommended):
- GET /api/products: 100 requests per minute per IP
- No authentication required for public product viewing

---

## 🧪 **Sample Test Data**

### **Minimum Test Products:**
Your backend should have at least 10-15 products across all categories for demo:

```json
[
  {
    "name": "Vintage Denim Jacket",
    "price": 45.99,
    "category": "women", 
    "brand": "Levi's",
    "condition": "excellent"
  },
  {
    "name": "Classic White Sneakers", 
    "price": 35.50,
    "category": "shoes",
    "brand": "Converse", 
    "condition": "good"
  },
  {
    "name": "Boys Summer T-Shirt",
    "price": 12.99, 
    "category": "kids",
    "brand": "Gap Kids",
    "condition": "good"
  },
  {
    "name": "Men's Wool Sweater",
    "price": 28.75,
    "category": "men",
    "brand": "J.Crew", 
    "condition": "excellent"
  }
]
```

---

## 📊 **Success Metrics**

### **Home Page Should Display:**
- ✅ Hero section loads immediately 
- ✅ Category grid shows 5 category cards
- ✅ Products section shows all available products
- ✅ Each product card shows: name, price, brand, condition, category, image
- ✅ "Add to Cart" works for each product
- ✅ No console errors
- ✅ Images load or show placeholder gracefully

### **Backend Success Criteria:**
- ✅ GET /api/products returns 200 status
- ✅ Response includes all required product fields
- ✅ Images are accessible via returned URLs
- ✅ Response time under 500ms
- ✅ Handles empty product list gracefully
- ✅ Proper error responses for failures

---

This covers everything your backend needs to support the home page! The home page is primarily a **product showcase** that fetches and displays all products with cart functionality. 🎯
