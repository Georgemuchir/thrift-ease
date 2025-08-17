from sqlalchemy.orm import Session
from typing import Optional, List
from app.models import CartItem, Product
from app.schemas import CartItemCreate, CartItemUpdate

class CartService:
    @staticmethod
    def add_to_cart(db: Session, user_id: int, cart_item: CartItemCreate) -> CartItem:
        """Add item to cart or update quantity if exists"""
        # Check if item already exists in cart
        existing_item = db.query(CartItem).filter(
            CartItem.user_id == user_id,
            CartItem.product_id == cart_item.product_id,
            CartItem.size == cart_item.size
        ).first()
        
        if existing_item:
            # Update quantity
            existing_item.quantity += cart_item.quantity
            db.commit()
            db.refresh(existing_item)
            return existing_item
        else:
            # Create new cart item
            db_cart_item = CartItem(
                user_id=user_id,
                **cart_item.dict()
            )
            db.add(db_cart_item)
            db.commit()
            db.refresh(db_cart_item)
            return db_cart_item
    
    @staticmethod
    def get_cart_items(db: Session, user_id: int) -> List[CartItem]:
        """Get all cart items for a user"""
        return db.query(CartItem).filter(CartItem.user_id == user_id).all()
    
    @staticmethod
    def update_cart_item(db: Session, user_id: int, item_id: int, update_data: CartItemUpdate) -> Optional[CartItem]:
        """Update cart item"""
        cart_item = db.query(CartItem).filter(
            CartItem.id == item_id,
            CartItem.user_id == user_id
        ).first()
        
        if not cart_item:
            return None
        
        update_fields = update_data.dict(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(cart_item, field, value)
        
        db.commit()
        db.refresh(cart_item)
        return cart_item
    
    @staticmethod
    def remove_from_cart(db: Session, user_id: int, item_id: int) -> bool:
        """Remove item from cart"""
        cart_item = db.query(CartItem).filter(
            CartItem.id == item_id,
            CartItem.user_id == user_id
        ).first()
        
        if not cart_item:
            return False
        
        db.delete(cart_item)
        db.commit()
        return True
    
    @staticmethod
    def clear_cart(db: Session, user_id: int) -> bool:
        """Clear all items from cart"""
        db.query(CartItem).filter(CartItem.user_id == user_id).delete()
        db.commit()
        return True
    
    @staticmethod
    def get_cart_total(db: Session, user_id: int) -> dict:
        """Get cart totals"""
        cart_items = CartService.get_cart_items(db, user_id)
        
        total_items = sum(item.quantity for item in cart_items)
        total_price = 0.0
        
        for item in cart_items:
            if item.product and item.product.is_available:
                total_price += item.product.price * item.quantity
        
        return {
            "total_items": total_items,
            "total_price": total_price
        }
