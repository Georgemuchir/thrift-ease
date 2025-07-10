# 🚀 DEPLOY BOTH MAIN & DEV BRANCHES - KEEP SEPARATE

## 📋 **INDEPENDENT DEPLOYMENT STRATEGY**

**✅ NO MERGING** - Keep `main` and `dev` as separate environments

### **� Two Live Sites:**
- **`main` branch** → **Production** (Stable ThriftEase)
- **`dev` branch** → **Staging** (New QuickThrift features)

---

## 🌟 **NETLIFY DEPLOYMENT (RECOMMENDED)**

### **Step 1: Deploy Production (main branch)**

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login** with GitHub
3. **Click "New site from Git"**
4. **Select your `thrift-ease` repository**
5. **Production Settings:**
   ```
   Branch to deploy: main
   Build command: (leave empty)
   Publish directory: (leave empty)
   Site name: quickthrift-production
   ```
6. **Click "Deploy site"**
7. **Result: `https://quickthrift-production.netlify.app`**

#### **Step 2: Deploy Staging (dev branch)**

1. **In Netlify Dashboard → "New site from Git"**
2. **Select same `thrift-ease` repository again**
3. **Staging Settings:**
   ```
   Branch to deploy: dev
   Build command: (leave empty)
   Publish directory: (leave empty)
   Site name: quickthrift-staging
   ```
4. **Click "Deploy site"**
5. **Result: `https://quickthrift-staging.netlify.app`**

---

## 🌐 **ALTERNATIVE: VERCEL**

#### **Single Setup - Auto-deploys Both:**

1. **Go to [vercel.com](https://vercel.com)**
2. **Import your GitHub `thrift-ease` repository**
3. **Vercel automatically creates:**
   - **Production:** `main` → `https://thrift-ease.vercel.app`
   - **Preview:** `dev` → `https://thrift-ease-git-dev.vercel.app`

---

## 🔧 **DEPLOY BACKEND (OPTIONAL)**

### **Deploy to Render:**

1. **Go to [render.com](https://render.com)**
2. **Create Web Service**
3. **Connect GitHub repository**
4. **Settings:**
   ```
   Repository: thrift-ease
   Branch: main
   Root Directory: backend-new
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: python app.py
   ```

---

## 📱 **WHAT YOU'LL HAVE AFTER DEPLOYMENT**

### **✅ Production Environment (main branch):**
- **URL:** `https://quickthrift-production.netlify.app`
- **Purpose:** Stable version for real users
- **Features:** Your stable, tested QuickThrift features
- **Auto-deploys:** When you push to `main`

### **✅ Staging Environment (dev branch):**
- **URL:** `https://quickthrift-staging.netlify.app`
- **Purpose:** Testing your latest features
- **Features:** Your newest QuickThrift development
- **Auto-deploys:** When you push to `dev`

### **✅ Both Sites Include:**
- 🎨 Beautiful QuickThrift UI
- 🔐 Working authentication with demo account
- 🛍️ Shopping cart and wishlist
- 📱 Mobile responsive design
- ⚡ Fast loading and offline support

---

## 🎯 **TESTING YOUR DEPLOYMENTS**

### **Demo Account (Works on Both):**
- **Email:** `demo@quickthrift.com`
- **Password:** `demo123`

### **Test Features:**
- ✅ Sign in with demo account
- ✅ Browse products and use filters
- ✅ Add items to cart and wishlist
- ✅ Test search functionality
- ✅ Try responsive design on mobile

---

## 🚀 **WORKFLOW AFTER DEPLOYMENT**

### **Development Process:**
1. **Work on new features** → Push to `dev` branch
2. **Test on staging** → `https://quickthrift-staging.netlify.app`
3. **When ready** → Merge `dev` to `main`
4. **Production updates** → `https://quickthrift-production.netlify.app`

### **Commands:**
```bash
# Push to staging (dev)
git push origin dev

# Deploy to production
git checkout main
git merge dev
git push origin main
```

---

## 🎉 **READY TO DEPLOY!**

Choose your platform and follow the steps above. Your QuickThrift app will be live in minutes! 🚀
