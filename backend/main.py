from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import uvicorn
from datetime import datetime

from app.core.config import settings
from app.core.database import engine, Base
from app.routers import auth_router, products_router, cart_router, orders_router, admin_router

# Create database tables
Base.metadata.create_all(bind=engine)

# Print startup configuration
print("=== ThriftEase API Startup Configuration ===")
print(f"Environment: {settings.ENVIRONMENT}")
print(f"Database URL: {settings.DATABASE_URL}")
print(f"Debug Mode: {settings.DEBUG}")
print(f"CORS Origins: {settings.ALLOWED_ORIGINS}")
print("=============================================")

# Create FastAPI application
app = FastAPI(
    title="ThriftEase API",
    description="Backend API for ThriftEase - A modern thrift store platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration - Dynamic origins based on environment
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    max_age=600,
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "success",
        "message": "ThriftEase API is running",
        "timestamp": datetime.now().isoformat(),
        "environment": settings.ENVIRONMENT
    }

# API health check endpoint (required by Render)
@app.get("/api/health")
async def api_health_check():
    return {
        "status": "success", 
        "message": "ThriftEase API is healthy",
        "timestamp": datetime.now().isoformat(),
        "environment": settings.ENVIRONMENT
    }

# API Routes
app.include_router(auth_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(cart_router, prefix="/api")
app.include_router(orders_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.now().isoformat()
        }
    )

# Method not allowed handler for Starlette HTTP exceptions
@app.exception_handler(StarletteHTTPException)
async def starlette_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 405:
        return JSONResponse(
            status_code=405,
            content={
                "error": "Method not allowed",
                "hint": "Check the HTTP method (GET, POST, PUT, DELETE) for this endpoint",
                "status_code": 405,
                "timestamp": datetime.now().isoformat()
            }
        )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": str(exc.detail),
            "status_code": exc.status_code,
            "timestamp": datetime.now().isoformat()
        }
    )

# Placeholder image endpoint to prevent 404 errors
@app.get("/api/placeholder/{width}/{height}")
async def placeholder_image(width: int, height: int):
    """Returns placeholder image data for frontend development"""
    return {
        "url": f"https://via.placeholder.com/{width}x{height}",
        "width": width,
        "height": height,
        "message": "Placeholder image endpoint"
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to ThriftEase API",
        "docs": "/docs",
        "health": "/health",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=5000, 
        reload=settings.DEBUG,
        log_level="debug" if settings.DEBUG else "info"
    )
