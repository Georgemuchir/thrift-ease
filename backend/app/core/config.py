from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./thrift_ease.db"
    
    # Security
    SECRET_KEY: str = "thriftease-super-secret-key-for-development-only"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS Origins - Updated with CORRECT Netlify domain (hrift-ease not thrift-ease)
    CORS_ORIGINS: str = "https://hrift-ease.netlify.app,http://localhost:3000,http://localhost:3001,http://localhost:5173,http://127.0.0.1:3000"
    
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        """Parse CORS_ORIGINS string into list"""
        if self.CORS_ORIGINS:
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
        return [
            "https://hrift-ease.netlify.app",  # CORRECTED - missing 't' is intentional
            "http://localhost:3000",
            "http://localhost:3001", 
            "http://localhost:5173",
            "http://127.0.0.1:3000"
        ]
    
    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10485760  # 10MB
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    class Config:
        env_file = "/home/muchiri/development/thrift-ease/backend/.env"
        case_sensitive = True

settings = Settings()
