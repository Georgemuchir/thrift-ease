#!/usr/bin/env python3
"""
Database initialization script for ThriftEase Backend
"""
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

print("=== ThriftEase Database Initialization ===")

try:
    print("1. Importing database components...")
    from app.core.database import engine, Base
    from app.models import User, Product, CartItem, Order, OrderItem
    
    print("2. Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    print("3. Verifying tables created...")
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    print(f"Created tables: {tables}")
    
    if len(tables) > 0:
        print("✅ Database initialization successful!")
        print("✅ All tables created successfully!")
        
        # Add some sample data
        print("4. Adding sample data...")
        from sqlalchemy.orm import sessionmaker
        from app.models import ProductCondition, UserRole
        from app.core.security import get_password_hash
        
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        try:
            # Create admin user
            admin_user = User(
                first_name="Admin",
                last_name="User",
                email="admin@thriftease.com",
                password_hash=get_password_hash("admin123"),
                role=UserRole.ADMIN,
                is_active=True,
                email_verified=True
            )
            db.add(admin_user)
            
            # Create sample products
            sample_products = [
                Product(
                    name="Vintage Denim Jacket",
                    description="Classic vintage denim jacket in excellent condition",
                    price=45.99,
                    category="men",
                    brand="Levi's",
                    condition=ProductCondition.EXCELLENT,
                    featured=True,
                    size="M",
                    color="Blue"
                ),
                Product(
                    name="Floral Summer Dress",
                    description="Beautiful floral print summer dress",
                    price=32.50,
                    category="women",
                    brand="H&M",
                    condition=ProductCondition.VERY_GOOD,
                    featured=True,
                    size="S",
                    color="Floral"
                ),
                Product(
                    name="Kids Sneakers",
                    description="Comfortable kids sneakers in great condition",
                    price=18.99,
                    category="kids",
                    brand="Nike",
                    condition=ProductCondition.GOOD,
                    size="12",
                    color="White"
                ),
                Product(
                    name="Running Shoes",
                    description="Professional running shoes",
                    price=65.00,
                    category="shoes",
                    brand="Adidas",
                    condition=ProductCondition.EXCELLENT,
                    featured=True,
                    size="10",
                    color="Black"
                )
            ]
            
            for product in sample_products:
                db.add(product)
            
            db.commit()
            print("✅ Sample data added successfully!")
            print(f"   - Created admin user: admin@thriftease.com (password: admin123)")
            print(f"   - Added {len(sample_products)} sample products")
            
        except Exception as e:
            db.rollback()
            print(f"⚠️  Error adding sample data: {e}")
        finally:
            db.close()
    else:
        print("❌ No tables were created!")
        
except Exception as e:
    print(f"❌ Database initialization failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n🎉 Database ready! You can now start the backend server.")
