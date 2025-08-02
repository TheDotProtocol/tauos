#!/bin/bash

echo "🧪 Testing PostgreSQL Integration for TauOS Applications"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local method="$2"
    local url="$3"
    local data="$4"
    local token="$5"
    
    echo -n "Testing $name... "
    
    if [ -n "$token" ]; then
        if [ -n "$data" ]; then
            response=$(curl -s -w "%{http_code}" -X $method -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d "$data" "$url")
        else
            response=$(curl -s -w "%{http_code}" -H "Authorization: Bearer $token" "$url")
        fi
    else
        if [ -n "$data" ]; then
            response=$(curl -s -w "%{http_code}" -X $method -H "Content-Type: application/json" -d "$data" "$url")
        else
            response=$(curl -s -w "%{http_code}" "$url")
        fi
    fi
    
    http_code="${response: -3}"
    body="${response%???}"
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL (HTTP $http_code)${NC}"
        echo "Response: $body"
        ((FAILED++))
    fi
}

echo -e "\n${BLUE}🔍 Testing Server Availability${NC}"
echo "----------------------------------------"

# Test server availability
test_endpoint "TauMail Server" "GET" "http://localhost:3001/api/profile"
test_endpoint "TauCloud Server" "GET" "http://localhost:3002/api/storage/stats"

echo -e "\n${BLUE}👤 Testing User Registration${NC}"
echo "----------------------------------------"

# Test TauMail registration
test_endpoint "TauMail Registration" "POST" "http://localhost:3001/api/register" '{"username":"testmail","password":"testpass123","recovery_email":"testmail@example.com"}'

# Test TauCloud registration
test_endpoint "TauCloud Registration" "POST" "http://localhost:3002/api/register" '{"username":"testcloud","password":"testpass123","recovery_email":"testcloud@example.com"}'

echo -e "\n${BLUE}🔐 Testing User Login${NC}"
echo "----------------------------------------"

# Test TauMail login
test_endpoint "TauMail Login" "POST" "http://localhost:3001/api/login" '{"username":"testmail","password":"testpass123"}'

# Test TauCloud login
test_endpoint "TauCloud Login" "POST" "http://localhost:3002/api/login" '{"username":"testcloud","password":"testpass123"}'

echo -e "\n${BLUE}📧 Testing TauMail Features${NC}"
echo "----------------------------------------"

# Get TauMail token for authenticated tests
MAIL_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"username":"testmail","password":"testpass123"}' http://localhost:3001/api/login | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$MAIL_TOKEN" ]; then
    test_endpoint "TauMail Profile" "GET" "http://localhost:3001/api/profile" "" "$MAIL_TOKEN"
    test_endpoint "TauMail Inbox" "GET" "http://localhost:3001/api/emails/inbox" "" "$MAIL_TOKEN"
    test_endpoint "TauMail Sent" "GET" "http://localhost:3001/api/emails/sent" "" "$MAIL_TOKEN"
    test_endpoint "TauMail Stats" "GET" "http://localhost:3001/api/emails/stats" "" "$MAIL_TOKEN"
else
    echo -e "${RED}❌ Failed to get TauMail token${NC}"
    ((FAILED++))
fi

echo -e "\n${BLUE}☁️ Testing TauCloud Features${NC}"
echo "----------------------------------------"

# Get TauCloud token for authenticated tests
CLOUD_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"username":"testcloud","password":"testpass123"}' http://localhost:3002/api/login | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$CLOUD_TOKEN" ]; then
    test_endpoint "TauCloud Profile" "GET" "http://localhost:3002/api/profile" "" "$CLOUD_TOKEN"
    test_endpoint "TauCloud Files" "GET" "http://localhost:3002/api/files" "" "$CLOUD_TOKEN"
    test_endpoint "TauCloud Storage Stats" "GET" "http://localhost:3002/api/storage/stats" "" "$CLOUD_TOKEN"
    test_endpoint "TauCloud Folders" "GET" "http://localhost:3002/api/folders" "" "$CLOUD_TOKEN"
else
    echo -e "${RED}❌ Failed to get TauCloud token${NC}"
    ((FAILED++))
fi

echo -e "\n${BLUE}📊 Test Results Summary${NC}"
echo "================================"
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo -e "${BLUE}📈 Total: $((PASSED + FAILED))${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! PostgreSQL integration is working perfectly!${NC}"
    exit 0
else
    echo -e "\n${YELLOW}⚠️ Some tests failed. Please check the server logs for details.${NC}"
    exit 1
fi 