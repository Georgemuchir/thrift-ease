# ThriftEase Deployment Guide

## Step 1: Push Current Changes
```bash
git add .
git commit -m "Setup full-stack deployment with backend serving frontend"
git push origin main
```

## Step 2: Update Render Service
1. Go to your Render dashboard
2. Either:
   - **Update existing service** to use new render.yaml
   - **Create new web service** from your GitHub repo

## Step 3: Configure Render Service
- **Environment:** Docker
- **Dockerfile Path:** ./Dockerfile
- **Auto-Deploy:** Yes
- **Health Check Path:** /health

## Step 4: Environment Variables (Auto-configured via render.yaml)
- ENVIRONMENT=production
- SECRET_KEY=(auto-generated)
- DATABASE_URL=(from database)
- DEBUG=false

## Step 5: Database
- Use existing Render PostgreSQL database
- Or create new one if needed

## Benefits of New Setup:
✅ Single service (easier to manage)
✅ No CORS issues
✅ Faster deployment
✅ Lower costs (one service instead of two)
✅ Simplified architecture
✅ Better performance (no cross-origin requests)

## Your App URLs After Deployment:
- Main App: https://your-app-name.onrender.com
- API Docs: https://your-app-name.onrender.com/docs
- Health Check: https://your-app-name.onrender.com/health
- API Endpoints: https://your-app-name.onrender.com/api/*

## Local Development:
```bash
npm run start:fullstack  # Full stack (what we just tested)
npm run dev              # Frontend only (for UI development)
cd backend && bash start.sh  # Backend only
```
