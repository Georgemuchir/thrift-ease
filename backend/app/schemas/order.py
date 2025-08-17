from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.models import OrderStatus
from .user import UserPublic

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float
    size: Optional[str] = None

class OrderItemResponse(OrderItemBase):
    id: int
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    shipping_first_name: str
    shipping_last_name: str
    shipping_address: str
    shipping_city: str
    shipping_state: str
    shipping_zip_code: str
    shipping_country: str = "United States"
    shipping_phone: Optional[str] = None
    payment_method: str
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemBase]

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    payment_status: Optional[str] = None
    payment_id: Optional[str] = None
    notes: Optional[str] = None

class OrderResponse(OrderBase):
    id: int
    order_number: str
    status: OrderStatus
    subtotal: float
    shipping: float
    tax: float
    total: float
    payment_status: str
    payment_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse]
    
    class Config:
        from_attributes = True

class OrderListResponse(BaseModel):
    id: int
    order_number: str
    status: OrderStatus
    total: float
    created_at: datetime
    
    class Config:
        from_attributes = True
