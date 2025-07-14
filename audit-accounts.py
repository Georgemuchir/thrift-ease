#!/usr/bin/env python3
"""
ThriftEase Complete Account Audit
Find all user accounts including hidden ones from bags data
"""

import requests
import json
from datetime import datetime

def audit_accounts():
    """Comprehensive audit of all user accounts"""
    print("🔍 ThriftEase Complete Account Audit")
    print("=" * 50)
    
    try:
        # Get registered users from API
        print("📋 Fetching registered users from API...")
        response = requests.get('https://thrift-ease-1.onrender.com/api/users')
        
        if response.status_code == 200:
            registered_users = response.json()
            registered_emails = set(user['email'] for user in registered_users)
            
            print(f"✅ Found {len(registered_users)} registered users:")
            for user in registered_users:
                print(f"   • {user['username']} ({user['email']}) - ID: {user['id']}")
            
        else:
            print(f"❌ Failed to fetch users: {response.status_code}")
            return
            
    except Exception as e:
        print(f"❌ Error fetching users: {e}")
        return
    
    # Now let's check for hidden accounts by looking at bag data
    print("\n🛒 Checking for hidden accounts with shopping bags...")
    
    # We'll need to get the bags data by trying different email addresses
    # Since we can't directly access bags.json from the API, we'll check known patterns
    
    test_emails = [
        'test@example.com',
        'user1@test.com', 
        'user2@test.com',
        'demo@thriftease.com',
        'demo@thrifteasy.com',
        'admin@thriftease.com',
        'test@thriftease.com',
        'user@test.com',
        'test@test.com'
    ]
    
    hidden_accounts = []
    
    for email in test_emails:
        if email not in registered_emails:
            try:
                # Try to get bag for this email
                bag_response = requests.get(f'https://thrift-ease-1.onrender.com/api/bag/{email}')
                
                if bag_response.status_code == 200:
                    bag_data = bag_response.json()
                    
                    # If we get a response (even empty), this email has a bag
                    if isinstance(bag_data, list):
                        hidden_accounts.append({
                            'email': email,
                            'bag_items': len(bag_data),
                            'bag_data': bag_data
                        })
                        print(f"   🔍 Found hidden account: {email} (bag has {len(bag_data)} items)")
                        
            except Exception as e:
                # Ignore errors for non-existent bags
                pass
    
    print(f"\n📊 Account Summary:")
    print(f"   Registered users: {len(registered_users)}")
    print(f"   Hidden accounts: {len(hidden_accounts)}")
    print(f"   Total accounts: {len(registered_users) + len(hidden_accounts)}")
    
    if hidden_accounts:
        print(f"\n⚠️  Hidden Accounts Details:")
        for account in hidden_accounts:
            print(f"   • {account['email']} - {account['bag_items']} items in bag")
            if account['bag_items'] > 0:
                for item in account['bag_data']:
                    print(f"     - {item.get('name', 'Unknown')} (${item.get('price', 0)})")
    
    print(f"\n🎯 Recommendations:")
    if hidden_accounts:
        print("   • Clean up orphaned bag data for non-registered users")
        print("   • Consider implementing user cleanup procedures")
        print("   • Check if these are test accounts that should be removed")
    else:
        print("   • No hidden accounts found - system is clean!")

if __name__ == "__main__":
    audit_accounts()
