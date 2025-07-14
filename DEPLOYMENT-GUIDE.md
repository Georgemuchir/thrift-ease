# 🚀 QuickThrift Deployment Guide

## Backend Deployment (Render)

### Option 1: Render Deployment
1. Push the `/backend` folder to a GitHub repository
2. Connect to Render.com
3. Create new Web Service
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `python app.py`
6. **Environment**: Python 3.9+
7. Set environment variable: `PORT=5000`

### Option 2: Heroku Deployment
1. Install Heroku CLI
2. Navigate to `/backend` folder
3. Run:
```bash
heroku create quickthrift-backend
git init
git add .
git commit -m "Deploy backend"
heroku git:remote -a quickthrift-backend
git push heroku main
```

## Frontend Deployment (Netlify)

### Option 1: Netlify Drag & Drop
1. Zip all files in root directory (excluding `/backend`)
2. Go to netlify.com
3. Drag & drop the zip file
4. Update API URL in deployed site

### Option 2: Netlify Git
1. Push frontend files to GitHub
2. Connect repository to Netlify
3. **Build Command**: (none needed - static files)
4. **Publish Directory**: `/` (root)

### Option 3: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in project root
3. Follow prompts for deployment

## Post-Deployment Configuration

### Update API URLs
After backend deployment, update the API URL in:
- `/auth-system.js` line 6
- `/admin-auth.js` (if applicable)

Replace:
```javascript
this.apiBaseUrl = 'http://127.0.0.1:5000'
```

With your deployed backend URL:
```javascript
this.apiBaseUrl = 'https://your-backend-url.onrender.com'
```

### Environment Variables
Set on your hosting platform:
- `FLASK_ENV=production`
- `PORT=5000` (or as required by host)

## Default Admin Access

After deployment, login to admin panel with:
- **URL**: `https://your-frontend-url.netlify.app/admin.html`
- **Email**: `admin@quickthrift.com`
- **Password**: `TempPass123!`

## Testing Production

1. Test user registration: `your-site.com/sign-up.html`
2. Test user login: `your-site.com/sign-in.html`
3. Test admin panel: `your-site.com/admin.html`
4. Verify API health: `your-backend.com/api/health`

## Success Metrics

✅ Users can register/login without admin auth
✅ Admin can create users with proper authorization
✅ All data persists in backend JSON files
✅ Cross-device sessions work properly
✅ No localStorage dependencies for critical data

---

**Your QuickThrift app is now LIVE and PRODUCTION READY! 🎉**
