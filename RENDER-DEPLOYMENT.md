# 🚀 Render.com Deployment Guide for QuickThrift

## 📋 Pre-Deployment Checklist

### ✅ Files Ready for Render:
- `render.yaml` - Multi-service configuration
- `package.json` - Frontend dependencies & start script  
- `server.js` - Express server for SPA routing
- `backend/requirements.txt` - Python dependencies with Gunicorn
- `backend/runtime.txt` - Python version specification
- `backend/app.py` - Flask API configured for production

## 🛠️ Deployment Methods

### Method 1: Blueprint Deployment (Recommended)
1. **Connect Repository**: Link your GitHub repo to Render
2. **Deploy from Blueprint**: Render will auto-detect `render.yaml`
3. **Configure Environment**: All settings are in the YAML file

### Method 2: Manual Service Creation
1. **Backend Service**:
   - Type: Web Service
   - Environment: Python 3.11
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && gunicorn --bind 0.0.0.0:$PORT app:app`
   
2. **Frontend Service**:
   - Type: Web Service  
   - Environment: Node.js
   - Build Command: `npm install`
   - Start Command: `npm start`

## 🐛 Common Render Deployment Errors & Fixes

### ❌ Error: "Module not found" 
**Fix**: Check `requirements.txt` has all dependencies:
```
Flask==2.3.3
Flask-CORS==4.0.0
gunicorn==21.2.0
```

### ❌ Error: "Build failed - cannot find backend directory"
**Fix**: Ensure `render.yaml` has correct paths:
```yaml
buildCommand: cd backend && pip install -r requirements.txt
```

### ❌ Error: "Health check failed"
**Fix**: 
1. Ensure Flask binds to `0.0.0.0:$PORT`
2. Add health check endpoint (already included in app.py)
3. Verify `PORT` environment variable is set

### ❌ Error: "502 Bad Gateway"
**Fix**: 
1. Use Gunicorn instead of Flask dev server
2. Ensure correct port binding in start command
3. Check logs for WORKER timeout errors

### ❌ Error: "Build timeout"
**Fix**:
1. Optimize build commands
2. Consider using smaller dependency versions
3. Remove unnecessary build steps

## 📊 Performance Optimization

### Backend Optimization:
```yaml
# In render.yaml
envVars:
  - key: GUNICORN_WORKERS
    value: 2
  - key: GUNICORN_TIMEOUT
    value: 120
```

### Frontend Optimization:
- Express server serves static files efficiently
- Service worker caches resources for PWA
- Lazy loading images reduce initial load time

## 🔍 Debugging Render Deployments

### 1. Check Build Logs:
- Go to Render Dashboard → Service → Deploy tab
- Look for specific error messages
- Search for "error", "failed", or "timeout"

### 2. Check Runtime Logs:
- Go to Render Dashboard → Service → Logs tab
- Filter by error level
- Look for port binding issues

### 3. Health Check Verification:
```bash
# Test health endpoint after deployment
curl https://your-backend-url.onrender.com/api/health
```

### 4. Environment Variables:
Verify these are set correctly:
- `FLASK_ENV=production`
- `NODE_ENV=production`  
- `PORT` (auto-set by Render)

## 🌐 Custom Domain Setup

1. **Add Domain in Render**:
   - Go to Service Settings → Custom Domains
   - Add your domain (e.g., quickthrift.com)

2. **Configure DNS**:
   - Add CNAME record pointing to your-app.onrender.com
   - Wait for SSL certificate provisioning (automatic)

## 📈 Monitoring & Maintenance

### Automatic Deploys:
- Enable auto-deploy from main/dev branch
- Use preview deployments for testing

### Performance Monitoring:
- Use Render's built-in metrics
- Monitor response times and error rates
- Set up notifications for downtime

### Backup Strategy:
- Database backups (if using Render Postgres)
- Static file CDN integration
- Environment variable backups

## 🆘 Support Resources

- **Render Status**: https://status.render.com
- **Documentation**: https://render.com/docs
- **Community**: https://community.render.com
- **Support**: Available for paid plans

## 🎯 Current Deployment Status

✅ **Ready for Deployment**:
- All configuration files updated
- Production-ready server setup
- Health checks implemented
- Error handling in place
- PWA features enabled

🚀 **Next Steps**:
1. Commit and push all changes
2. Connect GitHub repo to Render
3. Deploy using Blueprint method
4. Verify both services are running
5. Test all functionality in production

---

**Deployment Command Summary**:
```bash
# Commit recent changes
git add .
git commit -m "fix: Update Render deployment configuration"
git push origin dev

# Then deploy via Render Dashboard
```
