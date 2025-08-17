from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.services import OrderService
from app.schemas import OrderCreate, OrderUpdate, OrderResponse, OrderListResponse
from app.models import User, UserRole

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create order from cart"""
    try:
        order = OrderService.create_order_from_cart(db, current_user.id, order_data)
        return order
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create order"
        )

@router.get("/", response_model=List[OrderListResponse])
async def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's orders"""
    orders = OrderService.get_orders_by_user(db, current_user.id, skip, limit)
    return orders

@router.get("/admin", response_model=List[OrderListResponse])
async def get_all_orders_admin(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all orders (admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    orders = OrderService.get_all_orders(db, skip, limit)
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get order by ID"""
    # Admin can view any order, users can only view their own
    user_id = None if current_user.role == UserRole.ADMIN else current_user.id
    
    order = OrderService.get_order_by_id(db, order_id, user_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return order

@router.put("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: int,
    update_data: OrderUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update order (admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    order = OrderService.update_order(db, order_id, update_data)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return order

@router.post("/{order_id}/cancel")
async def cancel_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel order"""
    # Admin can cancel any order, users can only cancel their own
    user_id = None if current_user.role == UserRole.ADMIN else current_user.id
    
    success = OrderService.cancel_order(db, order_id, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel order or order not found"
        )
    return {"message": "Order cancelled successfully"}
