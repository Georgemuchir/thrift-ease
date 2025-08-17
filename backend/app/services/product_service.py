from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import Optional, List
from app.models import Product, ProductCondition
from app.schemas import ProductCreate, ProductUpdate

class ProductService:
    @staticmethod
    def create_product(db: Session, product_data: ProductCreate) -> Product:
        """Create a new product"""
        db_product = Product(**product_data.dict())
        
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product
    
    @staticmethod
    def get_product_by_id(db: Session, product_id: int) -> Optional[Product]:
        """Get product by ID"""
        product = db.query(Product).filter(Product.id == product_id).first()
        if product:
            # Increment view count
            product.views_count += 1
            db.commit()
        return product
    
    @staticmethod
    def get_products(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        category: Optional[str] = None,
        search: Optional[str] = None,
        featured: Optional[bool] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None
    ) -> List[Product]:
        """Get products with filtering"""
        query = db.query(Product).filter(Product.is_available == True)
        
        if category:
            query = query.filter(Product.category == category)
            
        if search:
            query = query.filter(
                or_(
                    Product.name.ilike(f"%{search}%"),
                    Product.description.ilike(f"%{search}%"),
                    Product.brand.ilike(f"%{search}%")
                )
            )
            
        if featured is not None:
            query = query.filter(Product.featured == featured)
            
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
            
        if max_price is not None:
            query = query.filter(Product.price <= max_price)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def update_product(db: Session, product_id: int, product_data: ProductUpdate) -> Optional[Product]:
        """Update product"""
        product = ProductService.get_product_by_id(db, product_id)
        if not product:
            return None
        
        update_data = product_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(product, field, value)
        
        db.commit()
        db.refresh(product)
        return product
    
    @staticmethod
    def delete_product(db: Session, product_id: int) -> bool:
        """Delete product (mark as unavailable)"""
        product = ProductService.get_product_by_id(db, product_id)
        if not product:
            return False
        
        product.is_available = False
        db.commit()
        return True
    
    @staticmethod
    def get_featured_products(db: Session, limit: int = 8) -> List[Product]:
        """Get featured products"""
        return db.query(Product).filter(
            and_(Product.featured == True, Product.is_available == True)
        ).limit(limit).all()
    
    @staticmethod
    def get_categories(db: Session) -> List[str]:
        """Get all product categories"""
        result = db.query(Product.category).filter(Product.is_available == True).distinct().all()
        return [category[0] for category in result]
    
    @staticmethod
    def search_products(db: Session, query: str, limit: int = 20) -> List[Product]:
        """Search products by name, description, or brand"""
        return db.query(Product).filter(
            and_(
                Product.is_available == True,
                or_(
                    Product.name.ilike(f"%{query}%"),
                    Product.description.ilike(f"%{query}%"),
                    Product.brand.ilike(f"%{query}%")
                )
            )
        ).limit(limit).all()
