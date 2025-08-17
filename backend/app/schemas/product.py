from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.models import ProductCondition

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: str
    brand: Optional[str] = None
    condition: ProductCondition = ProductCondition.GOOD
    size: Optional[str] = None
    color: Optional[str] = None
    material: Optional[str] = None
    image: Optional[str] = None
    featured: bool = False

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    condition: Optional[ProductCondition] = None
    size: Optional[str] = None
    color: Optional[str] = None
    material: Optional[str] = None
    image: Optional[str] = None
    featured: Optional[bool] = None
    is_available: Optional[bool] = None

class ProductResponse(ProductBase):
    id: int
    is_available: bool
    views_count: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    id: int
    name: str
    price: float
    category: str
    image: Optional[str] = None
    featured: bool
    condition: ProductCondition
    
    class Config:
        from_attributes = True
