# 🚀 QuickThrift Dual Environment Deployment

## 📋 **DEPLOYMENT STRATEGY**

**Repository:** `github.com:Georgemuchir/thrift-ease.git`  

### **🎯 Two Independent Environments:**
1. **`main` branch** → **PRODUCTION** (Stable, live site)
2. **`dev` branch** → **STAGING** (Latest features, testing)

**❌ NO MERGING** - Keep branches separate for independent testing

---

## 🌐 **OPTION 1: NETLIFY (RECOMMENDED)**

### **Step 1: Deploy PRODUCTION (main branch)**

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login** with GitHub
3. **Click "New site from Git"**
4. **Select your `thrift-ease` repository**
5. **Configure:**
   - **Branch:** `main`
   - **Build command:** (leave empty)
   - **Publish directory:** (leave empty)
6. **Deploy**

**Result:** `https://quickthrift-prod.netlify.app` (production site)

### **Step 2: Deploy STAGING (dev branch)**

1. **In Netlify, click "New site from Git" again**
2. **Select the SAME `thrift-ease` repository**
3. **Configure:**
   - **Branch:** `dev` 
   - **Build command:** (leave empty)
   - **Publish directory:** (leave empty)
4. **Deploy**

**Result:** `https://quickthrift-dev.netlify.app` (staging site)

### **Benefits:**
- ✅ **Two separate URLs** for testing
- ✅ **Auto-deploy** when you push to each branch
- ✅ **Independent environments**
- ✅ **Free hosting**

---

## 🚀 **OPTION 2: VERCEL (ALTERNATIVE)**

### **Deploy Both Branches:**

1. **Go to [vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **First deployment (main):**
   - Branch: `main`
   - Deploy
4. **Add second deployment (dev):**
   - Go to Settings → Git
   - Add branch: `dev`
   - Deploy

**Result:** 
- Production: `https://thrift-ease.vercel.app`
- Staging: `https://thrift-ease-git-dev.vercel.app`

---

## 🎭 **OPTION 3: GITHUB PAGES (MAIN ONLY)**

### **For Production:**

1. **Go to your GitHub repository**
2. **Settings → Pages**
3. **Source:** Deploy from branch
4. **Branch:** `main`
5. **Save**

**Result:** `https://georgemuchir.github.io/thrift-ease`

**Note:** GitHub Pages only deploys one branch, so use this for `main` only.

---

## 🔧 **WHAT EACH ENVIRONMENT CONTAINS**

### **🟢 PRODUCTION (`main` branch):**
- Stable ThriftEase version
- Basic functionality
- Tested features only

### **🟡 STAGING (`dev` branch):**
- ✨ **New QuickThrift transformation**
- 🔐 **New authentication system**
- 🛍️ **Enhanced shopping features**
- 🎨 **Modern UI/UX**
- 📱 **Responsive design**
- **Demo account:** `demo@quickthrift.com` / `demo123`

---

## 📊 **RECOMMENDED DEPLOYMENT WORKFLOW**

### **Current Setup:**
```
main branch (stable) → Production site
  ↑
dev branch (latest) → Staging site
```

### **Testing Flow:**
1. **Test new features** on staging (`dev` deployment)
2. **When satisfied**, merge `dev` → `main` 
3. **Production** automatically updates

### **For Now (No Merging):**
- **Deploy both branches** to separate URLs
- **Test independently**
- **Compare versions**
- **Merge when ready**

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
