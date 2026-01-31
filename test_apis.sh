#!/bin/bash

echo "=========================================="
echo "Testing Library Management System APIs"
echo "=========================================="
echo ""

BASE_URL="http://127.0.0.1:8000"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test counter
PASS=0
FAIL=0

# Function to test API
test_api() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local token=$5
    
    echo -e "${YELLOW}Testing: $name${NC}"
    
    if [ -z "$token" ]; then
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" \
            -w "\n%{http_code}")
    else
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d "$data" \
            -w "\n%{http_code}")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ PASS${NC} - Status: $http_code"
        echo "Response: $body" | head -c 200
        echo ""
        PASS=$((PASS + 1))
    else
        echo -e "${RED}✗ FAIL${NC} - Status: $http_code"
        echo "Response: $body" | head -c 200
        echo ""
        FAIL=$((FAIL + 1))
    fi
    echo ""
}

echo "=========================================="
echo "1. AUTHENTICATION APIs"
echo "=========================================="
echo ""

# Register
echo "1.1 Register User"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/accounts/register/" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "testowner@library.com",
        "password": "SecurePass123",
        "password_confirm": "SecurePass123",
        "first_name": "Test",
        "last_name": "Owner",
        "phone": "9876543210"
    }')
echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# Login
echo "1.2 Login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/accounts/login/" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "testowner@library.com",
        "password": "SecurePass123"
    }')
echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"

# Extract token
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['tokens']['access'])" 2>/dev/null)
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['tokens']['refresh'])" 2>/dev/null)

if [ -z "$ACCESS_TOKEN" ]; then
    echo -e "${RED}Failed to get access token. Exiting.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Got Access Token${NC}"
echo ""

# Get Profile
echo "1.3 Get Profile"
curl -s -X GET "$BASE_URL/api/v1/accounts/profile/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

# Token Refresh
echo "1.4 Token Refresh"
curl -s -X POST "$BASE_URL/api/v1/accounts/token/refresh/" \
    -H "Content-Type: application/json" \
    -d "{\"refresh\": \"$REFRESH_TOKEN\"}" | python3 -m json.tool 2>/dev/null
echo ""

echo "=========================================="
echo "2. LIBRARY APIs"
echo "=========================================="
echo ""

# Create Library
echo "2.1 Create Library"
LIBRARY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/libraries/create/" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '{
        "name": "Test Study Library",
        "address": "123 Main Street, Test City",
        "phone": "9876543210",
        "total_seats": 50,
        "opening_time": "06:00:00",
        "closing_time": "23:00:00"
    }')
echo "$LIBRARY_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LIBRARY_RESPONSE"
echo ""

# Get Library Details
echo "2.2 Get Library Details"
curl -s -X GET "$BASE_URL/api/v1/libraries/detail/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

echo "=========================================="
echo "3. SEATS APIs"
echo "=========================================="
echo ""

# Create Seats
echo "3.1 Create Seat A1"
SEAT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/seats/create/" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '{
        "seat_number": "A1",
        "seat_type": "FIXED"
    }')
echo "$SEAT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SEAT_RESPONSE"
SEAT_ID=$(echo "$SEAT_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
echo ""

echo "3.2 Create Seat A2"
curl -s -X POST "$BASE_URL/api/v1/seats/create/" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '{
        "seat_number": "A2",
        "seat_type": "FLEXIBLE"
    }' | python3 -m json.tool 2>/dev/null
echo ""

# List Seats
echo "3.3 List All Seats"
curl -s -X GET "$BASE_URL/api/v1/seats/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

echo "=========================================="
echo "4. STUDENTS APIs"
echo "=========================================="
echo ""

# Create Student (without files for simplicity)
echo "4.1 Create Student"
STUDENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/students/create/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -F "full_name=Rahul Kumar" \
    -F "phone=9876543210" \
    -F "time_slot=MORNING")
echo "$STUDENT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$STUDENT_RESPONSE"
STUDENT_ID=$(echo "$STUDENT_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
echo ""

# List Students
echo "4.2 List All Students"
curl -s -X GET "$BASE_URL/api/v1/students/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

# Assign Seat to Student
if [ ! -z "$SEAT_ID" ] && [ ! -z "$STUDENT_ID" ]; then
    echo "4.3 Assign Seat to Student"
    curl -s -X POST "$BASE_URL/api/v1/seats/$SEAT_ID/assign/" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -d "{\"student_id\": $STUDENT_ID}" | python3 -m json.tool 2>/dev/null
    echo ""
fi

echo "=========================================="
echo "5. ATTENDANCE APIs"
echo "=========================================="
echo ""

# Mark Attendance
if [ ! -z "$STUDENT_ID" ]; then
    echo "5.1 Mark Attendance"
    curl -s -X POST "$BASE_URL/api/v1/attendance/mark/" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -d "{
            \"student\": $STUDENT_ID,
            \"check_in_time\": \"09:30:00\",
            \"attendance_type\": \"MANUAL\"
        }" | python3 -m json.tool 2>/dev/null
    echo ""
fi

# Daily Attendance
echo "5.2 Daily Attendance"
curl -s -X GET "$BASE_URL/api/v1/attendance/daily/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

# List Attendance
echo "5.3 List Attendance"
curl -s -X GET "$BASE_URL/api/v1/attendance/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

echo "=========================================="
echo "6. SUBSCRIPTIONS APIs"
echo "=========================================="
echo ""

# Create Subscription
if [ ! -z "$STUDENT_ID" ]; then
    echo "6.1 Create Subscription"
    SUBSCRIPTION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/subscriptions/create/" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -d "{
            \"student\": $STUDENT_ID,
            \"plan_name\": \"Monthly Plan\",
            \"start_date\": \"2026-01-01\",
            \"end_date\": \"2026-01-31\",
            \"fee_amount\": \"2000.00\",
            \"fee_status\": \"PAID\"
        }")
    echo "$SUBSCRIPTION_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SUBSCRIPTION_RESPONSE"
    SUBSCRIPTION_ID=$(echo "$SUBSCRIPTION_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
    echo ""
fi

# List Subscriptions
echo "6.2 List Subscriptions"
curl -s -X GET "$BASE_URL/api/v1/subscriptions/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

# Expiring Subscriptions
echo "6.3 Expiring Subscriptions"
curl -s -X GET "$BASE_URL/api/v1/subscriptions/expiring/?days=30" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

echo "=========================================="
echo "7. NOTIFICATIONS APIs"
echo "=========================================="
echo ""

# List Notifications
echo "7.1 List Notifications"
curl -s -X GET "$BASE_URL/api/v1/notifications/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

echo "=========================================="
echo "8. REPORTS APIs"
echo "=========================================="
echo ""

# Dashboard
echo "8.1 Dashboard Statistics"
curl -s -X GET "$BASE_URL/api/v1/reports/dashboard/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

# Monthly Attendance Report
echo "8.2 Monthly Attendance Report"
curl -s -X GET "$BASE_URL/api/v1/reports/monthly-attendance/?month=1&year=2026" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

# Student Report
if [ ! -z "$STUDENT_ID" ]; then
    echo "8.3 Student Report"
    curl -s -X GET "$BASE_URL/api/v1/reports/students/?student_id=$STUDENT_ID" \
        -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
    echo ""
fi

echo "=========================================="
echo "API Testing Complete!"
echo "=========================================="
echo ""
echo "All major endpoints have been tested."
echo "Check the responses above for details."
echo ""
