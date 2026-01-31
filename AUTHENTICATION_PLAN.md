# Enhanced Authentication System Plan

## Overview
Implementing a comprehensive authentication system with separate login flows for Library Owners and Students, plus password recovery functionality.

## Current Status: ✅ Backend Models Updated

### 1. Database Changes (COMPLETED)

#### Library Model Updates:
- ✅ Added `library_id` field (unique, auto-generated)
  - Format: `LIB000001`, `LIB000002`, etc.
  - Auto-generated on library creation
  - Used for student login identification

#### Student Model Updates:
- ✅ Added `student_id` field (unique, auto-generated)
  - Format: `STU000001-0001`, `STU000001-0002`, etc.
  - First part matches library ID pattern
  - Second part is sequential per library
- ✅ Added `password` field (hashed using Django's password hasher)
  - Automatically hashed on save
  - Includes `check_password()` method for validation

#### Migrations Applied:
- ✅ `libraries/0002_library_library_id.py` - Added library_id field
- ✅ `libraries/0003_populate_library_ids.py` - Populated existing libraries
- ✅ `students/0005_student_password_student_student_id.py` - Added student fields
- ✅ `students/0006_populate_student_ids.py` - Populated existing students with IDs and default passwords

## Next Steps: TODO

### 2. Backend Authentication APIs

#### A. Library Owner Login API
**Endpoint:** `POST /api/v1/accounts/owner-login/`

**Request Body:**
```json
{
  "library_id": "LIB000001",
  "email": "owner@library.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "owner@library.com",
    "role": "LIBRARY_OWNER",
    "full_name": "John Doe"
  },
  "library": {
    "id": 1,
    "library_id": "LIB000001",
    "name": "Central Library"
  },
  "tokens": {
    "access": "...",
    "refresh": "..."
  }
}
```

#### B. Student Login API
**Endpoint:** `POST /api/v1/accounts/student-login/`

**Request Body:**
```json
{
  "library_id": "LIB000001",
  "student_id": "STU000001-0001",
  "email": "student@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "student": {
    "id": 1,
    "student_id": "STU000001-0001",
    "full_name": "Jane Smith",
    "email": "student@example.com",
    "library_id": "LIB000001"
  },
  "tokens": {
    "access": "...",
    "refresh": "..."
  }
}
```

#### C. Forgot Password API
**Endpoint:** `POST /api/v1/accounts/forgot-password/`

**Request Body (Library Owner):**
```json
{
  "user_type": "owner",
  "library_id": "LIB000001",
  "email": "owner@library.com"
}
```

**Request Body (Student):**
```json
{
  "user_type": "student",
  "library_id": "LIB000001",
  "student_id": "STU000001-0001",
  "email": "student@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset link sent to your email",
  "email": "masked@email.com"
}
```

#### D. Reset Password API
**Endpoint:** `POST /api/v1/accounts/reset-password/`

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

### 3. Frontend Updates

#### A. Enhanced Login Page
**File:** `frontend-web/src/pages/auth/Login.jsx`

**Features:**
- Tab switcher: "Library Owner" | "Student"
- Library Owner Form:
  - Library ID input
  - Email input
  - Password input
  - "Forgot Password?" link
- Student Form:
  - Library ID input
  - Student ID input
  - Email input
  - Password input
  - "Forgot Password?" link

#### B. Forgot Password Page
**File:** `frontend-web/src/pages/auth/ForgotPassword.jsx`

**Features:**
- User type selector (Owner/Student)
- Dynamic form based on user type
- Email verification
- Success message with instructions

#### C. Reset Password Page
**File:** `frontend-web/src/pages/auth/ResetPassword.jsx`

**Features:**
- Token validation
- New password input
- Confirm password input
- Password strength indicator
- Success redirect to login

### 4. Student Dashboard Features

#### A. Student Profile Page
- View personal information
- View subscription details
- View attendance history
- Edit profile (limited fields)
- Change password

#### B. Student Attendance View
- Monthly calendar view
- Attendance statistics
- Present/Absent indicators

#### C. Student Subscription View
- Current subscription details
- Payment history
- Days remaining
- Renewal options

#### D. Student Notifications
- View notifications from library
- Mark as read functionality

### 5. Additional Features

#### A. Password Management
- Change password functionality for both owners and students
- Password strength requirements
- Password history (prevent reuse)

#### B. Security Features
- Account lockout after failed attempts
- Session management
- Two-factor authentication (optional)

#### C. Email Notifications
- Welcome email with credentials (for students)
- Password reset emails
- Subscription expiry reminders
- Payment due reminders

## Implementation Priority

1. **HIGH PRIORITY:**
   - Backend authentication APIs (Owner & Student login)
   - Frontend login page updates
   - Student dashboard basic structure

2. **MEDIUM PRIORITY:**
   - Forgot/Reset password functionality
   - Student profile and attendance views
   - Password change functionality

3. **LOW PRIORITY:**
   - Email notifications
   - Advanced security features
   - Two-factor authentication

## Security Considerations

1. **Password Storage:**
   - ✅ Using Django's built-in password hashing (PBKDF2)
   - Passwords never stored in plain text

2. **Token Management:**
   - JWT tokens with expiration
   - Refresh token rotation
   - Secure token storage in frontend

3. **Input Validation:**
   - Server-side validation for all inputs
   - SQL injection prevention
   - XSS protection

4. **Rate Limiting:**
   - Limit login attempts
   - Implement CAPTCHA after failures
   - IP-based throttling

## Testing Checklist

- [ ] Library owner can login with library_id + email + password
- [ ] Student can login with library_id + student_id + email + password
- [ ] Invalid credentials show appropriate error messages
- [ ] Forgot password sends email correctly
- [ ] Reset password link works and expires
- [ ] Student can view their dashboard
- [ ] Student can view attendance history
- [ ] Student can view subscription details
- [ ] Password change works for both user types
- [ ] Session expires after inactivity
- [ ] Logout clears all tokens

## Notes

- Default student password is last 4 digits of phone number (for existing students)
- Library owners use existing Django User authentication
- Students have separate authentication system
- Both systems use JWT tokens for API access
- Frontend stores tokens in localStorage
- Backend validates tokens on each request
