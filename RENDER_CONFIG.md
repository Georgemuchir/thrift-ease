# Render Service Configuration

## Basic Settings:
- **Name:** thriftease-fullstack
- **Environment:** Docker
- **Region:** Choose closest to your users
- **Branch:** main
- **Dockerfile Path:** ./Dockerfile

## Build & Deploy:
- **Build Command:** (Leave empty - Docker handles this)
- **Start Command:** (Leave empty - Docker handles this)
- **Auto-Deploy:** Yes

## Health & Alerts:
- **Health Check Path:** /health

## Environment Variables:
Add these manually or they'll be auto-configured via render.yaml:

- ENVIRONMENT = production
- SECRET_KEY = (click "Generate" for secure key)
- DEBUG = false
- DATABASE_URL = (will be set when you connect database)

## Advanced:
- **Instance Type:** Starter (free tier) or higher based on your needs
- **Disk:** Persistent disk not needed for this setup
