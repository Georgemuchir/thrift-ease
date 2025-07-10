# ThriftEase Deployment Guide

## 🌐 Deploy to GitHub Pages (Frontend Only)

### Quick Deploy:
1. **Push your code to GitHub**
2. **Go to repository Settings → Pages**
3. **Select Source: Deploy from branch → main**
4. **Your site will be available at: `https://yourusername.github.io/repository-name`**

### The app will automatically work in demo mode with:
- ✅ Default products visible
- ✅ Demo authentication (demo@thriftease.com / demo123)
- ✅ Local storage for shopping bag
- ✅ Full offline functionality

---

## 🚀 Deploy Full Stack (Frontend + Backend)

### Option 1: Heroku (Free Tier Available)

#### Backend Deployment:
1. Create `requirements.txt` in `thrift-ease-react/backend/`:
```
Flask==2.3.3
Flask-CORS==4.0.0
```

2. Create `Procfile` in `thrift-ease-react/backend/`:
```
web: python app.py
```

3. Update `app.py` for production:
```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, port=port, host='0.0.0.0')
```

4. Deploy to Heroku and get your backend URL

#### Frontend Update:
Update `api-service.js` with your backend URL:
```javascript
const API_BASE_URL = 'https://your-backend-app.herokuapp.com';
```

### Option 2: Netlify + Railway/Render

#### Frontend (Netlify):
1. Connect GitHub repo to Netlify
2. Deploy frontend files
3. Get frontend URL

#### Backend (Railway/Render):
1. Deploy backend folder
2. Get backend URL
3. Update API_BASE_URL in frontend

### Option 3: Vercel (Frontend) + Render (Backend)

#### Frontend (Vercel):
1. Connect GitHub repo to Vercel
2. Deploy automatically
3. Get Vercel URL (e.g., `https://thrift-ease-xyz.vercel.app`)

#### Configuration:
- ✅ `vercel.json` already configured for SPA routing
- ✅ API automatically uses Render backend when deployed on Vercel

---

## 🌐 Current Live Deployment

### Backend (Render):
**URL:** `https://thrift-ease-1.onrender.com`
- ✅ API is live and responding
- ✅ Products endpoint: `/api/products`
- ✅ Authentication: `/api/auth/signin` & `/api/auth/signup`
- ✅ Shopping bag: `/api/bag/<user_email>`
- ✅ Orders: `/api/orders`
- ✅ Health check: `/api/health`

### Frontend Configuration:
The frontend is automatically configured to use the Render backend when deployed to:
- GitHub Pages (`github.io`)
- Netlify (`netlify.app`)
- Vercel (`vercel.app`)

**Auto-detection:** The app automatically detects the environment and uses the appropriate API URL.

---

## 🚀 **RECOMMENDED: Deploy to Netlify**

### **Quick Deploy Steps:**
1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login** with GitHub
3. **Click "New site from Git"**
4. **Choose GitHub** → Select `thrift-ease` repository
5. **Deploy settings:**
   - Branch: `main`
   - Build command: (leave empty)
   - Publish directory: (leave empty)
6. **Click "Deploy site"**

### **Your site will be live at:** `https://your-site-name.netlify.app`

✅ **Auto-configured with:**
- SPA routing support
- Render backend integration
- Performance optimizations
- Security headers

---

## 🔧 Current Demo Mode Features

When backend is unavailable, the app automatically:

- **Shows demo products** with all categories (Women, Men, Kids, Shoes)
- **Provides demo authentication** with test accounts
- **Stores data locally** in browser storage
- **Works completely offline** after first load

### Demo Accounts:
- Email: `demo@thriftease.com` / Password: `demo123`
- Email: `test@thriftease.com` / Password: `test123`

---

## 📱 Mobile Responsive

The app is fully responsive and works on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones
- ✅ All modern browsers

---

## 🛠️ Local Development

```bash
# Start backend
cd thrift-ease-react/backend
python3 app.py

# Open frontend
# Simply open index.html in browser or use live server
```

The app automatically detects local vs deployed environment and adjusts accordingly.
