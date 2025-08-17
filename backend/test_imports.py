#!/usr/bin/env python3
"""
Simple test script to debug backend imports
"""
import sys
import os

print("=== ThriftEase Backend Test ===")
print(f"Python version: {sys.version}")
print(f"Current directory: {os.getcwd()}")
print(f"Python path: {sys.path}")

try:
    print("\n1. Testing FastAPI import...")
    from fastapi import FastAPI
    print("✅ FastAPI import successful")
    
    print("\n2. Testing app.core.config import...")
    from app.core.config import settings
    print("✅ Config import successful")
    print(f"   Database URL: {settings.DATABASE_URL}")
    print(f"   Environment: {settings.ENVIRONMENT}")
    
    print("\n3. Testing app.core.database import...")
    from app.core.database import engine, Base
    print("✅ Database import successful")
    
    print("\n4. Testing models import...")
    from app.models import User, Product
    print("✅ Models import successful")
    
    print("\n5. Testing schemas import...")
    from app.schemas import UserCreate, ProductCreate
    print("✅ Schemas import successful")
    
    print("\n6. Testing services import...")
    from app.services import UserService, ProductService
    print("✅ Services import successful")
    
    print("\n7. Testing routers import...")
    from app.routers import auth_router, products_router
    print("✅ Routers import successful")
    
    print("\n8. Testing main app creation...")
    from main import app
    print("✅ Main app import successful")
    
    print("\n🎉 All imports successful! Backend is ready.")
    
except Exception as e:
    print(f"\n❌ Import error: {e}")
    import traceback
    traceback.print_exc()
