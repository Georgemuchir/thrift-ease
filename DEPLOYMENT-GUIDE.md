# 🚀 ThriftEase Deployment Guide

## Backend Deployment on Render

### 1. Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository (`Georgemuchir/thrift-ease`)
4. Configure service:
   - **Name**: `thriftease-api`
   - **Root Directory**: `backend`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 2. Add PostgreSQL Database
1. In Render Dashboard → "New" → "PostgreSQL" 
2. **Name**: `thriftease-db`
3. **Database Name**: `thriftease`
4. **User**: `thriftease`
5. Copy the connection string after creation

### 3. Set Environment Variables
Go to your web service → "Environment" and add:

```
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=<generate-random-32-char-string>
DATABASE_URL=<postgres-connection-string-from-step-2>
CORS_ORIGINS=https://thriftease.netlify.app,http://localhost:5173
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Deploy
Click "Deploy" - your API will be available at: `https://thriftease-api.onrender.com`

## Frontend Deployment on Netlify

### 1. Create New Site
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. "New site from Git" → Connect GitHub
3. Select `Georgemuchir/thrift-ease` repository
4. Configure build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: (leave empty for root)

### 2. Set Environment Variables
Go to Site settings → Environment variables:

```
VITE_API_URL=https://thriftease-api.onrender.com/api
```

### 3. Update Domain in Backend
After Netlify gives you a domain (e.g., `https://thriftease.netlify.app`):
1. Go back to Render service environment variables
2. Update `CORS_ORIGINS` to: `https://thriftease.netlify.app,http://localhost:5173`
3. Redeploy the backend service

## Verification Steps

### Backend Health Check
```bash
curl https://thriftease-api.onrender.com/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "ThriftEase API is healthy", 
  "timestamp": "2025-08-16T...",
  "environment": "production"
}
```

### Frontend API Connection
Open browser console on your Netlify site:
```javascript
fetch(`${import.meta.env.VITE_API_URL}/health`)
  .then(r => r.json())
  .then(console.log)
```

### Test Authentication
1. Try registering a new user
2. Try logging in
3. Check browser network tab for CORS errors

## Troubleshooting

### Common Issues:

1. **CORS Errors**: 
   - Ensure Netlify domain is in `CORS_ORIGINS`
   - Check exact domain (with/without www)

2. **API Connection Fails**:
   - Verify `VITE_API_URL` points to Render service
   - Check Render service logs for errors

3. **Database Connection Issues**:
   - Ensure `DATABASE_URL` is correctly set
   - Check PostgreSQL service is running

4. **Build Failures**:
   - Check all environment variables are set
   - Review build logs in Render/Netlify

## Custom Domains (Optional)

### Backend Custom Domain
1. Render service → Settings → Custom Domains
2. Add your domain (e.g., `api.thriftease.com`)
3. Update frontend `VITE_API_URL` accordingly

### Frontend Custom Domain  
1. Netlify site → Domain settings
2. Add custom domain (e.g., `thriftease.com`)
3. Update backend `CORS_ORIGINS` accordingly

## Production Optimizations

1. **Enable Gzip**: Already configured in netlify.toml
2. **Add CDN**: Cloudflare for additional performance
3. **Monitoring**: Add Render service monitoring
4. **Backup**: Set up automatic database backups
5. **SSL**: Automatic with both Render and Netlify

## Environment-specific URLs

- **Production API**: `https://thriftease-api.onrender.com`
- **Production Frontend**: `https://thriftease.netlify.app` 
- **Development**: `http://localhost:5000` + `http://localhost:5173`
