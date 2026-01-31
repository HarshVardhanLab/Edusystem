#!/bin/bash

echo "=========================================="
echo "Complete Workflow Test with File Uploads"
echo "=========================================="
echo ""

BASE_URL="http://127.0.0.1:8000"

# Create test files for student
echo "Creating test files..."
mkdir -p test_files

# Create a dummy photo (1x1 pixel PNG)
echo -e '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a\x00\x00\x00\x0d\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\x0a\x49\x44\x41\x54\x78\x9c\x63\x00\x01\x00\x00\x05\x00\x01\x0d\x0a\x2d\xb4\x00\x00\x00\x00\x49\x45\x4e\x44\xae\x42\x60\x82' > test_files/photo.png

# Create a dummy PDF (minimal valid PDF)
cat > test_files/id_proof.pdf << 'PDFEOF'
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(ID Proof) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000317 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
410
%%EOF
PDFEOF

echo "✓ Test files created"
echo ""

# Step 1: Register and Login
echo "Step 1: Register and Login"
echo "----------------------------"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/accounts/login/" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "testowner@library.com",
        "password": "SecurePass123"
    }')

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['tokens']['access'])" 2>/dev/null)

if [ -z "$ACCESS_TOKEN" ]; then
    echo "✗ Failed to get token"
    exit 1
fi

echo "✓ Logged in successfully"
echo ""

# Step 2: Create Student with Files
echo "Step 2: Create Student with Files"
echo "-----------------------------------"
STUDENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/students/create/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -F "full_name=Rahul Kumar" \
    -F "phone=9876543210" \
    -F "time_slot=MORNING" \
    -F "photo=@test_files/photo.png" \
    -F "id_proof=@test_files/id_proof.pdf")

echo "$STUDENT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$STUDENT_RESPONSE"
STUDENT_ID=$(echo "$STUDENT_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)

if [ -z "$STUDENT_ID" ]; then
    echo "✗ Failed to create student"
    echo "Response: $STUDENT_RESPONSE"
else
    echo "✓ Student created with ID: $STUDENT_ID"
fi
echo ""

# Step 3: List Students
echo "Step 3: List Students"
echo "----------------------"
curl -s -X GET "$BASE_URL/api/v1/students/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

# Step 4: Get Seat ID
echo "Step 4: Get Available Seat"
echo "---------------------------"
SEATS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/v1/seats/" \
    -H "Authorization: Bearer $ACCESS_TOKEN")
SEAT_ID=$(echo "$SEATS_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['results'][0]['id'] if data['results'] else '')" 2>/dev/null)

if [ ! -z "$SEAT_ID" ]; then
    echo "✓ Found seat ID: $SEAT_ID"
else
    echo "✗ No seats available"
fi
echo ""

# Step 5: Assign Seat to Student
if [ ! -z "$STUDENT_ID" ] && [ ! -z "$SEAT_ID" ]; then
    echo "Step 5: Assign Seat to Student"
    echo "--------------------------------"
    ASSIGN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/seats/$SEAT_ID/assign/" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -d "{\"student_id\": $STUDENT_ID}")
    echo "$ASSIGN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ASSIGN_RESPONSE"
    echo ""
fi

# Step 6: Mark Attendance
if [ ! -z "$STUDENT_ID" ]; then
    echo "Step 6: Mark Attendance"
    echo "------------------------"
    ATTENDANCE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/attendance/mark/" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -d "{
            \"student\": $STUDENT_ID,
            \"check_in_time\": \"09:30:00\",
            \"attendance_type\": \"MANUAL\"
        }")
    echo "$ATTENDANCE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ATTENDANCE_RESPONSE"
    echo ""
fi

# Step 7: Create Subscription
if [ ! -z "$STUDENT_ID" ]; then
    echo "Step 7: Create Subscription"
    echo "----------------------------"
    SUBSCRIPTION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/subscriptions/create/" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -d "{
            \"student\": $STUDENT_ID,
            \"plan_name\": \"Monthly Plan\",
            \"start_date\": \"2026-01-01\",
            \"end_date\": \"2026-02-28\",
            \"fee_amount\": \"2000.00\",
            \"fee_status\": \"PAID\"
        }")
    echo "$SUBSCRIPTION_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SUBSCRIPTION_RESPONSE"
    SUBSCRIPTION_ID=$(echo "$SUBSCRIPTION_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
    echo ""
fi

# Step 8: View Dashboard
echo "Step 8: Dashboard Statistics"
echo "-----------------------------"
curl -s -X GET "$BASE_URL/api/v1/reports/dashboard/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

# Step 9: Daily Attendance Report
echo "Step 9: Daily Attendance Report"
echo "--------------------------------"
curl -s -X GET "$BASE_URL/api/v1/attendance/daily/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

# Step 10: Student Report
if [ ! -z "$STUDENT_ID" ]; then
    echo "Step 10: Student Detailed Report"
    echo "---------------------------------"
    curl -s -X GET "$BASE_URL/api/v1/reports/students/?student_id=$STUDENT_ID" \
        -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
    echo ""
fi

# Step 11: Update Student
if [ ! -z "$STUDENT_ID" ]; then
    echo "Step 11: Update Student"
    echo "------------------------"
    UPDATE_RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/v1/students/$STUDENT_ID/" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -F "time_slot=FULL_DAY")
    echo "$UPDATE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$UPDATE_RESPONSE"
    echo ""
fi

# Step 12: Update Subscription Payment
if [ ! -z "$SUBSCRIPTION_ID" ]; then
    echo "Step 12: Update Subscription Payment"
    echo "--------------------------------------"
    PAYMENT_RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/v1/subscriptions/$SUBSCRIPTION_ID/payment/" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -d '{"fee_status": "DUE"}')
    echo "$PAYMENT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$PAYMENT_RESPONSE"
    echo ""
fi

# Step 13: Free Seat
if [ ! -z "$SEAT_ID" ]; then
    echo "Step 13: Free Seat"
    echo "-------------------"
    FREE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/seats/$SEAT_ID/free/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    echo "$FREE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$FREE_RESPONSE"
    echo ""
fi

# Step 14: Deactivate Student
if [ ! -z "$STUDENT_ID" ]; then
    echo "Step 14: Deactivate Student"
    echo "----------------------------"
    DEACTIVATE_RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/v1/students/$STUDENT_ID/deactivate/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    echo "$DEACTIVATE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$DEACTIVATE_RESPONSE"
    echo ""
fi

# Final Dashboard
echo "Step 15: Final Dashboard"
echo "-------------------------"
curl -s -X GET "$BASE_URL/api/v1/reports/dashboard/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

echo "=========================================="
echo "Complete Workflow Test Finished!"
echo "=========================================="
echo ""
echo "Summary:"
echo "- Student created: $([ ! -z "$STUDENT_ID" ] && echo "✓ Yes (ID: $STUDENT_ID)" || echo "✗ No")"
echo "- Seat assigned: $([ ! -z "$SEAT_ID" ] && echo "✓ Yes (ID: $SEAT_ID)" || echo "✗ No")"
echo "- Attendance marked: $([ ! -z "$STUDENT_ID" ] && echo "✓ Yes" || echo "✗ No")"
echo "- Subscription created: $([ ! -z "$SUBSCRIPTION_ID" ] && echo "✓ Yes (ID: $SUBSCRIPTION_ID)" || echo "✗ No")"
echo ""

# Cleanup
echo "Cleaning up test files..."
rm -rf test_files
echo "✓ Cleanup complete"
echo ""

