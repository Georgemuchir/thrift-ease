#!/bin/bash
cd backend
export FLASK_ENV=production
gunicorn -w 4 -b 0.0.0.0:$PORT --timeout 120 app:app
