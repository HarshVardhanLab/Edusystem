# 🧪 Testing Guide - Nova LBS

## 📱 Option 1: Test Flutter App on Android Emulator

### Step 1: Start Android Emulator Manually
Open Android Studio and start the emulator from AVD Manager, OR run:
```bash
# Open Android Studio
open -a "Android Studio"

# Then go to: Tools → Device Manager → Start your emulator
```

### Step 2: Verify Emulator is Running
```bash
# Wait for emulator to fully boot (30-60 seconds)
# Then check if it's online:
adb devices

# You should see:
# emulator-5554   device    (not "offline")
```

### Step 3: Run Flutter App
```bash
cd flutter_app
flutter run
```

### Step 4: Test Login
Use these credentials:
```
Library ID: LIB1020
Student ID: STU00001
Password: 3211
```

---

## 🌐 Option 2: Test React Web App (Recommended for Quick Testing)

### Step 1: Start Backend (if not running)
```bash
# In terminal 1
source venv/bin/activate
python manage.py runserver
```

### Step 2: Start React Web App
```bash
# In terminal 2
cd frontend-web
npm run dev
```

### Step 3: Open Browser
Open: http://localhost:5173

### Step 4: Test Login

**Library Admin:**
```
Library ID: LIB1020
Email: admin@novalibrary.com
Password: Admin@123
```

**Student:**
```
Library ID: LIB1020
Student ID: STU00001
Password: 3211
```

---

## 🧪 Option 3: Test APIs Directly

### Test Student Login
```bash
curl -X POST http://localhost:8000/api/v1/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_type": "student",
    "library_id": "LIB1020",
    "student_id": "STU00001",
    "password": "3211"
  }'
```

### Test Admin Login
```bash
curl -X POST http://localhost:8000/api/v1/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_type": "library",
    "library_id": "LIB1020",
    "email": "admin@novalibrary.com",
    "password": "Admin@123"
  }'
```

### Test Get Students (with token)
```bash
# First login and get token, then:
curl -X GET http://localhost:8000/api/v1/students/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📊 API Documentation

Visit these URLs while backend is running:
- **Swagger UI**: http://localhost:8000/swagger/
- **ReDoc**: http://localhost:8000/redoc/

---

## ✅ What to Test

### For Students:
1. ✅ Login with credentials
2. ✅ View dashboard
3. ✅ Start/stop study timer
4. ✅ Create notes
5. ✅ Add tasks
6. ✅ Set study goals
7. ✅ View attendance history
8. ✅ Check subscription details
9. ✅ Update profile

### For Library Admin:
1. ✅ Login with credentials
2. ✅ View dashboard with statistics
3. ✅ View all students
4. ✅ Add new student
5. ✅ Edit student details
6. ✅ View seats
7. ✅ Assign seats to students
8. ✅ Mark attendance
9. ✅ Generate QR code
10. ✅ View reports
11. ✅ Manage subscriptions

---

## 🐛 Troubleshooting

### Backend not responding?
```bash
# Check if running
lsof -i :8000

# If not, start it
source venv/bin/activate
python manage.py runserver
```

### Frontend not loading?
```bash
# Check if running
lsof -i :5173

# If not, start it
cd frontend-web
npm run dev
```

### Emulator offline?
```bash
# Kill and restart adb
adb kill-server
adb start-server

# Or restart emulator from Android Studio
```

### Database connection error?
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check database exists
psql -U apple -d postgres -c "\l library_db"
```

---

## 📝 Test Data Summary

**Library:**
- ID: LIB1020
- Name: Nova Study Library
- Seats: 50 (all flexible)

**Admin:**
- Email: admin@novalibrary.com
- Password: Admin@123

**Students:** 5 students (STU00001 to STU00005)
- All have active subscriptions
- Passwords: 3211, 3212, 3213, 3214, 3215

---

## 🎯 Quick Start Commands

```bash
# Terminal 1: Backend
source venv/bin/activate && python manage.py runserver

# Terminal 2: Web Frontend
cd frontend-web && npm run dev

# Terminal 3: Flutter App (after emulator is running)
cd flutter_app && flutter run
```

---

**Status**: ✅ All systems ready for testing!
**Date**: February 16, 2026
