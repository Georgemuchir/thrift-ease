#!/usr/bin/env python3
"""
ThriftEase User Accounts Checker
Check all registered user accounts in the system.
"""

import requests
import json
from datetime import datetime

def format_date(date_str):
    """Format ISO date string to readable format"""
    try:
        date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        return date_obj.strftime('%Y-%m-%d %H:%M:%S')
    except:
        return date_str

def check_user_accounts():
    """Fetch and display all user accounts"""
    try:
        print("🔍 Checking ThriftEase User Accounts...")
        print("=" * 50)
        
        # Make request to API
        response = requests.get('https://thrift-ease-1.onrender.com/api/users')
        
        if response.status_code == 200:
            users = response.json()
            
            if users:
                print(f"✅ Found {len(users)} registered accounts:\n")
                
                for i, user in enumerate(users, 1):
                    print(f"--- Account {i} ---")
                    print(f"ID: {user.get('id', 'N/A')}")
                    print(f"Username: {user.get('username', 'N/A')}")
                    print(f"Email: {user.get('email', 'N/A')}")
                    print(f"Created: {format_date(user.get('created_at', 'N/A'))}")
                    print()
                
                print("📊 Summary:")
                print(f"Total accounts: {len(users)}")
                
                # Count recent accounts (last 24 hours)
                now = datetime.now()
                recent_count = 0
                for user in users:
                    if user.get('created_at'):
                        try:
                            created = datetime.fromisoformat(user['created_at'].replace('Z', '+00:00'))
                            if (now - created).days == 0:
                                recent_count += 1
                        except:
                            pass
                
                print(f"Created today: {recent_count}")
                
            else:
                print("ℹ️ No user accounts found")
                
        else:
            print(f"❌ API request failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    check_user_accounts()
