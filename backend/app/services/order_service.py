from sqlalchemy.orm import Session
from typing import Optional, List
import uuid
from datetime import datetime
from app.models import Order, OrderItem, CartItem, OrderStatus
from app.schemas import OrderCreate, OrderUpdate

class OrderService:
    @staticmethod
    def create_order_from_cart(db: Session, user_id: int, order_data: OrderCreate) -> Order:
        """Create order from cart items"""
        # Get cart items
        cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
        
        if not cart_items:
            raise ValueError("Cart is empty")
        
        # Calculate totals
        subtotal = 0.0
        for cart_item in cart_items:
            if cart_item.product and cart_item.product.is_available:
                subtotal += cart_item.product.price * cart_item.quantity
        
        shipping = 10.0 if subtotal < 100 else 0.0  # Free shipping over $100
        tax = subtotal * 0.08  # 8% tax
        total = subtotal + shipping + tax
        
        # Generate order number
        order_number = f"TE{datetime.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:8].upper()}"
        
        # Create order
        db_order = Order(
            user_id=user_id,
            order_number=order_number,
            subtotal=subtotal,
            shipping=shipping,
            tax=tax,
            total=total,
            **order_data.dict(exclude={"items"})
        )
        
        db.add(db_order)
        db.flush()  # Get order ID without committing
        
        # Create order items
        for cart_item in cart_items:
            if cart_item.product and cart_item.product.is_available:
                order_item = OrderItem(
                    order_id=db_order.id,
                    product_id=cart_item.product_id,
                    quantity=cart_item.quantity,
                    price=cart_item.product.price,
                    size=cart_item.size
                )
                db.add(order_item)
        
        # Clear cart
        db.query(CartItem).filter(CartItem.user_id == user_id).delete()
        
        db.commit()
        db.refresh(db_order)
        return db_order
    
    @staticmethod
    def get_order_by_id(db: Session, order_id: int, user_id: Optional[int] = None) -> Optional[Order]:
        """Get order by ID"""
        query = db.query(Order).filter(Order.id == order_id)
        
        if user_id:
            query = query.filter(Order.user_id == user_id)
        
        return query.first()
    
    @staticmethod
    def get_orders_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Order]:
        """Get orders for a user"""
        return db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_all_orders(db: Session, skip: int = 0, limit: int = 100) -> List[Order]:
        """Get all orders (admin only)"""
        return db.query(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_order(db: Session, order_id: int, update_data: OrderUpdate) -> Optional[Order]:
        """Update order"""
        order = db.query(Order).filter(Order.id == order_id).first()
        
        if not order:
            return None
        
        update_fields = update_data.dict(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(order, field, value)
        
        db.commit()
        db.refresh(order)
        return order
    
    @staticmethod
    def cancel_order(db: Session, order_id: int, user_id: Optional[int] = None) -> bool:
        """Cancel an order"""
        query = db.query(Order).filter(Order.id == order_id)
        
        if user_id:
            query = query.filter(Order.user_id == user_id)
        
        order = query.first()
        
        if not order or order.status in [OrderStatus.SHIPPED, OrderStatus.DELIVERED]:
            return False
        
        order.status = OrderStatus.CANCELLED
        db.commit()
        return True
