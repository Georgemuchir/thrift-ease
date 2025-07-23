#!/bin/bash

echo "=== 📊 THRIFT EASE DATABASE STATUS ==="
echo

echo "🏠 LOCAL DEVELOPMENT:"
echo "--------------------"
echo "📍 Backend: http://localhost:5000"

if curl -s http://localhost:5000/api/health >/dev/null 2>&1; then
    echo "✅ Backend Status: RUNNING"
    echo "📊 Health Check:"
    curl -s http://localhost:5000/api/health | jq '.' 2>/dev/null || curl -s http://localhost:5000/api/health
    echo
    echo "👥 Local Users Count: $(curl -s http://localhost:5000/api/health | jq '.users_count' 2>/dev/null || echo 'N/A')"
else
    echo "❌ Backend Status: NOT RUNNING"
fi

echo
echo "☁️ PRODUCTION:"
echo "---------------"
echo "📍 Backend: https://thrift-ease-backend.onrender.com"

if curl -s https://thrift-ease-backend.onrender.com/api/health >/dev/null 2>&1; then
    echo "✅ Backend Status: RUNNING"
    echo "📊 Health Check:"
    curl -s https://thrift-ease-backend.onrender.com/api/health | jq '.' 2>/dev/null || curl -s https://thrift-ease-backend.onrender.com/api/health
    echo
    echo "👥 Production Users Count: $(curl -s https://thrift-ease-backend.onrender.com/api/health | jq '.users_count' 2>/dev/null || echo 'N/A')"
else
    echo "❌ Backend Status: NOT ACCESSIBLE"
fi

echo
echo "💾 LOCAL DATABASE FILES:"
echo "------------------------"
echo "👥 Users in backend/data/users.json:"
if [ -f "backend/data/users.json" ]; then
    cat backend/data/users.json | jq '.[] | {id, email, username, role, created_at}' 2>/dev/null || cat backend/data/users.json
else
    echo "❌ File not found"
fi

echo
echo "🛍️ Products count: $(cat backend/data/products.json | jq 'length' 2>/dev/null || echo 'N/A')"
echo "📦 Orders count: $(cat backend/data/orders.json | jq 'length' 2>/dev/null || echo 'N/A')"
echo "🛒 Bags count: $(cat backend/data/bags.json | jq 'keys | length' 2>/dev/null || echo 'N/A')"
