from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.models import UserRole

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    avatar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(UserBase):
    id: int
    role: UserRole
    is_active: bool
    email_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserPublic(BaseModel):
    id: int
    first_name: str
    last_name: str
    avatar: Optional[str] = None
    
    class Config:
        from_attributes = True
