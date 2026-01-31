# API Documentation

Base URL: `http://127.0.0.1:8000/api/v1/`

## Authentication

All endpoints (except login/register) require JWT authentication.

**Header**: `Authorization: Bearer <access_token>`

### Auth Endpoints

#### Register
```
POST /accounts/register/
Body: {
  "email": "user@example.com",
  "password": "password123",
  "password2": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Login
```
POST /accounts/login/
Body: {
  "email": "user@example.com",
  "password": "password123"
}
Response: {
  "user": {...},
  "tokens": {
    "access": "...",
    "refresh": "..."
  }
}
```

#### Logout
```
POST /accounts/logout/
Body: {
  "refresh_token": "..."
}
```

#### Get Profile
```
GET /accounts/profile/
```

## Students

#### List Students
```
GET /students/
Response: {
  "count": 10,
  "results": [...]
}
```

#### Create Student
```
POST /students/create/
Body: FormData {
  "full_name": "Student Name",
  "phone": "1234567890",
  "time_slot": "MORNING",
  "photo": <file>,
  "id_proof": <file>
}
```

#### Get Student
```
GET /students/{id}/
```

#### Update Student
```
PATCH /students/{id}/
Body: FormData (same as create)
```

#### Deactivate Student
```
PATCH /students/{id}/deactivate/
```

## Seats

#### List Seats
```
GET /seats/
```

#### Create Seat
```
POST /seats/create/
Body: {
  "seat_number": "A1",
  "seat_type": "FIXED"
}
```

#### Assign Seat
```
POST /seats/{id}/assign/
Body: {
  "student_id": 1
}
```

#### Free Seat
```
POST /seats/{id}/free/
```

## Attendance

#### List Attendance
```
GET /attendance/
```

#### Mark Attendance
```
POST /attendance/mark/
Body: {
  "student": 1,
  "date": "2026-01-31",
  "attendance_type": "MANUAL"
}
```

#### Daily Attendance
```
GET /attendance/daily/?date=2026-01-31
Response: {
  "date": "2026-01-31",
  "total_present": 5,
  "attendance": [...]
}
```

#### Monthly Summary
```
GET /attendance/monthly-summary/?month=1&year=2026
```

## Subscriptions

#### List Subscriptions
```
GET /subscriptions/
```

#### Create Subscription
```
POST /subscriptions/create/
Body: {
  "student": 1,
  "plan_name": "Monthly Plan",
  "start_date": "2026-01-01",
  "end_date": "2026-01-31",
  "fee_amount": "1000",
  "fee_status": "DUE"
}
```

#### Update Payment Status
```
PATCH /subscriptions/{id}/payment/
Body: {
  "fee_status": "PAID"
}
```

#### Expiring Subscriptions
```
GET /subscriptions/expiring/?days=7
```

## Notifications

#### List Notifications
```
GET /notifications/
```

#### Mark as Read
```
PATCH /notifications/{id}/mark-read/
```

#### Mark All as Read
```
POST /notifications/mark-all-read/
```

## Reports

#### Dashboard Stats
```
GET /reports/dashboard/
Response: {
  "total_students": 10,
  "present_today": 8,
  "absent_today": 2,
  "active_subscriptions": 9,
  "expiring_in_7_days": 2,
  "fee_due_count": 3,
  "available_seats": 5,
  "total_seats": 15
}
```

#### Monthly Attendance Report
```
GET /reports/monthly-attendance/?month=1&year=2026
```

#### Student Report
```
GET /reports/students/?student_id=1
```

## Library

#### Create Library
```
POST /libraries/create/
Body: {
  "name": "My Library",
  "address": "123 Main St",
  "phone": "1234567890",
  "total_seats": 50,
  "opening_time": "09:00",
  "closing_time": "21:00"
}
```

#### Get Library Detail
```
GET /libraries/detail/
```

#### Update Library
```
PUT /libraries/detail/
Body: (same as create)
```

## Error Responses

All endpoints return standard error responses:

```json
{
  "detail": "Error message"
}
```

Status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
