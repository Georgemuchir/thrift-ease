# 🔧 Authentication Fix Guide

## ❌ **Problem**: Authentication not working after deployment

## 🎯 **Root Cause**: Frontend trying to connect to wrong backend URL

---

## 🚀 **Quick Fix Instructions**

### **Step 1: Find Your Backend URL**

1. Go to your backend hosting platform:
   - **Render**: Check your dashboard for the backend service URL
   - **Heroku**: Check your app dashboard for the domain

2. Your backend URL should look like:
   - `https://quickthrift-backend-XXXXX.onrender.com`
   - `https://your-app-name.herokuapp.com`

### **Step 2: Test Your Backend**

Visit: `YOUR_BACKEND_URL/api/health`

You should see:
```json
{
  "status": "healthy",
  "users_count": 1,
  "products_count": 0,
  "orders_count": 0,
  "bags_count": 0
}
```

### **Step 3: Update Frontend Files**

Replace `YOUR_BACKEND_URL_HERE` in these files:

#### **File 1: `auth-system.js` (line ~6)**
```javascript
this.apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:5000'
  : 'https://YOUR_ACTUAL_BACKEND_URL.onrender.com';
```

#### **File 2: `admin.js` (lines ~317 and ~842)**
```javascript
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5000'
    : 'https://YOUR_ACTUAL_BACKEND_URL.onrender.com';
```

### **Step 4: Redeploy Frontend**

After updating the URLs:
1. **Netlify**: Commit changes and push to GitHub (auto-deploy)
2. **Vercel**: Run `vercel --prod` or push to connected repo

---

## 🧪 **Test Authentication**

After redeploying:

1. **User Registration**: Visit `your-site.com/sign-up.html`
2. **User Login**: Visit `your-site.com/sign-in.html`
3. **Admin Panel**: Visit `your-site.com/admin.html`
4. **Production Test**: Visit `your-site.com/production-test.html`

---

## 🔍 **Debugging Steps**

### **Check Browser Console**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for errors like:
   - `Failed to fetch`
   - `CORS error`
   - `404 Not Found`

### **Common Issues & Solutions**

#### **Issue**: CORS Error
**Solution**: Backend might not be configured for your frontend domain

#### **Issue**: 404 Not Found
**Solution**: Wrong backend URL or backend not deployed

#### **Issue**: 500 Internal Server Error
**Solution**: Backend configuration issue, check backend logs

---

## 📞 **Need Help?**

Share:
1. Your backend URL
2. Your frontend URL  
3. Any console errors
4. What happens when you try to register/login

And I'll help you fix it immediately! 🚀
