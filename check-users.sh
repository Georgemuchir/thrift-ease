#!/bin/bash

# ThriftEase User Accounts Log Checker
# Quick script to check all registered user accounts

echo "🔍 ThriftEase User Accounts Log"
echo "================================="
echo

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo "❌ curl is not installed. Please install curl to use this script."
    exit 1
fi

# Make API request and format output
echo "📊 Fetching user accounts from API..."
echo

# Raw API call
response=$(curl -s "https://thrift-ease-1.onrender.com/api/users")

# Check if request was successful
if [ $? -eq 0 ]; then
    echo "✅ API Response received"
    echo
    
    # Pretty print JSON if python3 is available
    if command -v python3 &> /dev/null; then
        echo "📋 User Accounts:"
        echo "$response" | python3 -c "
import json
import sys
from datetime import datetime

try:
    users = json.load(sys.stdin)
    
    if users:
        print(f'Total accounts: {len(users)}')
        print()
        
        for i, user in enumerate(users, 1):
            print(f'--- Account {i} ---')
            print(f'ID: {user.get(\"id\", \"N/A\")}')
            print(f'Username: {user.get(\"username\", \"N/A\")}')
            print(f'Email: {user.get(\"email\", \"N/A\")}')
            
            # Format creation date
            created = user.get('created_at', 'N/A')
            if created != 'N/A':
                try:
                    date_obj = datetime.fromisoformat(created.replace('Z', '+00:00'))
                    created = date_obj.strftime('%Y-%m-%d %H:%M:%S')
                except:
                    pass
            
            print(f'Created: {created}')
            print()
    else:
        print('No user accounts found')
        
except json.JSONDecodeError:
    print('❌ Invalid JSON response')
    print('Raw response:')
    print(sys.stdin.read())
"
    else
        echo "📋 Raw JSON Response:"
        echo "$response"
    fi
else
    echo "❌ Failed to fetch user accounts from API"
fi

echo
echo "🔗 Debug Console: file://$(pwd)/debug-console.html"
echo "🐍 Python Script: python3 check-users.py"
