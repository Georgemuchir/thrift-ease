#!/bin/bash
# Script to test the API and show logs

echo "=== Testing ThriftEase API ==="
echo "1. Direct Backend Test:"
curl -s -X POST https://thrift-ease-1.onrender.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@thrifteasy.com", "password": "demo123"}' | jq .

echo ""
echo "2. Backend Health:"
curl -s https://thrift-ease-1.onrender.com/api/health | jq .

echo ""
echo "3. Local Server Test:"
curl -s http://localhost:8080/fresh-test.html | grep -o "<title>.*</title>"

echo ""
echo "4. Checking JavaScript Files:"
if [ -f "api-service-new.js" ]; then
    echo "✅ api-service-new.js exists"
    # Check for any syntax errors
    node -c api-service-new.js && echo "✅ No syntax errors" || echo "❌ Syntax errors found"
else
    echo "❌ api-service-new.js not found"
fi

if [ -f "sign-in.js" ]; then
    echo "✅ sign-in.js exists"
    node -c sign-in.js && echo "✅ No syntax errors" || echo "❌ Syntax errors found"
else
    echo "❌ sign-in.js not found"
fi

echo ""
echo "5. Browser Console Simulation:"
echo "Opening test page and checking console..."
