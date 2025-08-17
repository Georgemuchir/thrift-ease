from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .product import ProductListResponse

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1
    size: Optional[str] = None

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: Optional[int] = None
    size: Optional[str] = None

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    size: Optional[str] = None
    product: ProductListResponse
    created_at: datetime
    
    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    items: List[CartItemResponse]
    total_items: int
    total_price: float
