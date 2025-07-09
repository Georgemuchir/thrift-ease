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
