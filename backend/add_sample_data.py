#!/usr/bin/env python3
"""
Script to add sample data to the ThriftEase database
"""
import sys
import os

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

from app.core.database import SessionLocal
from app.models.models import Product, User
from sqlalchemy.exc import IntegrityError
import bcrypt

def create_sample_data():
    """Create sample users and products"""
    db = SessionLocal()
    
    try:
        # Create admin user
        admin_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        admin_user = User(
            first_name='Admin',
            last_name='User',
            email='admin@thriftease.com',
            password_hash=admin_password,
            role='admin',
            is_active=True,
            email_verified=True
        )
        
        try:
            db.add(admin_user)
            db.commit()
            print('✅ Admin user created successfully')
        except IntegrityError:
            db.rollback()
            print('ℹ️ Admin user already exists')
        
        # Create sample products
        sample_products = [
            {
                'name': 'Vintage Levi\'s Denim Jacket',
                'description': 'Classic vintage denim jacket in excellent condition. Perfect for layering and adding a timeless touch to any outfit.',
                'price': 45.99,
                'category': 'men',
                'brand': 'Levi\'s',
                'condition': 'EXCELLENT',
                'size': 'M',
                'color': 'Blue',
                'material': 'Denim',
                'is_available': True,
                'featured': True,
                'views_count': 0
            },
            {
                'name': 'Designer Leather Handbag',
                'description': 'Authentic Coach handbag in black leather. Gently used with minimal signs of wear.',
                'price': 89.99,
                'category': 'women',
                'brand': 'Coach',
                'condition': 'GOOD',
                'color': 'Black',
                'material': 'Leather',
                'is_available': True,
                'featured': True,
                'views_count': 0
            },
            {
                'name': 'Kids Winter Parka',
                'description': 'Warm and cozy winter coat for kids. Perfect for cold weather.',
                'price': 25.99,
                'category': 'kids',
                'brand': 'Gap Kids',
                'condition': 'VERY_GOOD',
                'size': '6',
                'color': 'Red',
                'material': 'Polyester',
                'is_available': True,
                'featured': False,
                'views_count': 0
            },
            {
                'name': 'Nike Running Shoes',
                'description': 'Comfortable running shoes in great condition. Perfect for jogging or casual wear.',
                'price': 35.99,
                'category': 'shoes',
                'brand': 'Nike',
                'condition': 'GOOD',
                'size': '9',
                'color': 'White',
                'material': 'Synthetic',
                'is_available': True,
                'featured': False,
                'views_count': 0
            },
            {
                'name': 'Floral Summer Dress',
                'description': 'Beautiful floral summer dress in excellent condition. Perfect for warm weather.',
                'price': 28.99,
                'category': 'women',
                'brand': 'Zara',
                'condition': 'EXCELLENT',
                'size': 'S',
                'color': 'Floral',
                'material': 'Cotton',
                'is_available': True,
                'featured': True,
                'views_count': 0
            },
            {
                'name': 'Men\'s Casual Blazer',
                'description': 'Smart casual blazer in navy blue. Great for office or evening events.',
                'price': 55.99,
                'category': 'men',
                'brand': 'H&M',
                'condition': 'VERY_GOOD',
                'size': 'L',
                'color': 'Navy',
                'material': 'Cotton Blend',
                'is_available': True,
                'featured': False,
                'views_count': 0
            }
        ]
        
        for product_data in sample_products:
            try:
                # Check if product already exists
                existing_product = db.query(Product).filter(Product.name == product_data['name']).first()
                if existing_product:
                    print(f'ℹ️ Product already exists: {product_data["name"]}')
                    continue
                
                product = Product(**product_data)
                db.add(product)
                db.commit()
                print(f'✅ Product created: {product_data["name"]}')
            except Exception as e:
                db.rollback()
                print(f'❌ Error creating product {product_data["name"]}: {e}')
        
        # Count total products
        total_products = db.query(Product).count()
        total_users = db.query(User).count()
        
        print(f'\n🎉 Sample data creation completed!')
        print(f'📊 Total users: {total_users}')
        print(f'📦 Total products: {total_products}')
        
    except Exception as e:
        print(f'❌ Error: {e}')
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()
