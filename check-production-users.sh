#!/bin/bash

# Check user accounts on the production ThriftEase site

PRODUCTION_URL="https://thrift-ease-1.onrender.com"

echo "🌐 Checking user accounts on production site..."
echo "📍 URL: $PRODUCTION_URL"
echo "----------------------------------------"

# Check if jq is available
if ! command -v jq &> /dev/null; then
    echo "📦 jq not found, using curl only..."
    curl -s "$PRODUCTION_URL/api/users"
    echo
else
    echo "👥 User Accounts:"
    curl -s "$PRODUCTION_URL/api/users" | jq -r '.[] | "• \(.username) (\(.email)) - ID: \(.id) - Created: \(.created_at | split("T")[0])"'
    
    echo
    echo "📊 User Count:"
    USER_COUNT=$(curl -s "$PRODUCTION_URL/api/users" | jq 'length')
    echo "Total users: $USER_COUNT"
fi

echo
echo "📦 Checking orders..."
ORDER_COUNT=$(curl -s "$PRODUCTION_URL/api/orders" | jq 'length' 2>/dev/null || echo "0")
echo "Total orders: $ORDER_COUNT"

echo
echo "🏥 API Health:"
curl -s "$PRODUCTION_URL/api/health" | jq -r '.status' 2>/dev/null || echo "Could not check health"

echo
echo "✅ Production check complete!"
