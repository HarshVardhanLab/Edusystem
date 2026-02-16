# Nova LBS - Login Credentials

## ✅ Working Credentials for Testing

### Library: LIB1020 (Nova Study Library)

---

## 👨‍💼 Library Admin Login

### Nova Study Library Admin
- **Library ID**: `LIB1020`
- **Email**: `admin@novalibrary.com`
- **Password**: `Admin@123`
- **Status**: ✅ Active

---

## 📱 Student Login

### Student 1: Rahul Sharma
- **Library ID**: `LIB1020`
- **Student ID**: `STU00001`
- **Password**: `3211`
- **Email**: rahul@example.com
- **Status**: ✅ Active, Subscription Active

### Student 2: Priya Patel
- **Library ID**: `LIB1020`
- **Student ID**: `STU00002`
- **Password**: `3212`
- **Email**: priya@example.com
- **Status**: ✅ Active, Subscription Active

### Student 3: Amit Kumar
- **Library ID**: `LIB1020`
- **Student ID**: `STU00003`
- **Password**: `3213`
- **Email**: amit@example.com
- **Status**: ✅ Active, Subscription Active

### Student 4: Sneha Reddy
- **Library ID**: `LIB1020`
- **Student ID**: `STU00004`
- **Password**: `3214`
- **Email**: sneha@example.com
- **Status**: ✅ Active, Subscription Active

### Student 5: Vikram Singh
- **Library ID**: `LIB1020`
- **Student ID**: `STU00005`
- **Password**: `3215`
- **Email**: vikram@example.com
- **Status**: ✅ Active, Subscription Active

---

## 🔐 Login Instructions

### For Students:
1. Open the Flutter app or Web app
2. Tap on **"Student"** tab
3. Enter:
   - Library ID: `LIB1020`
   - Student ID: (use one from above)
   - Password: (use corresponding password)
4. Tap **"Login as Student"**

### For Library Admin:
1. Open the Flutter app or Web app
2. Stay on **"Library Admin"** tab
3. Enter:
   - Library ID: `LIB1020`
   - Email: `admin@novalibrary.com`
   - Password: `Admin@123`
4. Tap **"Login as Admin"**

---

## 🔧 API Configuration

The Flutter app is configured to connect to:
```dart
baseUrl = 'http://10.0.2.2:8000/api/v1'
```

This is correct for Android emulator accessing localhost.

---

## ✅ Backend Status

- ✅ Django server running on port 8000
- ✅ Database: library_db (PostgreSQL)
- ✅ Student login API working
- ✅ Library admin login API working
- ✅ All passwords are set and hashed
- ✅ JWT tokens are being generated correctly
- ✅ 50 seats created
- ✅ 5 students with active subscriptions

---

## 🐛 Troubleshooting

### If login fails:

1. **Check backend is running**:
   ```bash
   lsof -i :8000
   ```

2. **Test API directly**:
   ```bash
   curl -X POST http://localhost:8000/api/v1/accounts/login/ \
     -H "Content-Type: application/json" \
     -d '{"user_type": "student", "library_id": "LIB1020", "student_id": "STU00001", "password": "3211"}'
   ```

3. **Check Flutter app logs**:
   - Look for "Login DioException" messages
   - Check for network errors
   - Verify API URL is correct

---

## 📝 Notes

- Email is **optional** for student login
- Password is last 4 digits of phone number
- All students have active monthly subscriptions (₹1500)
- Passwords are hashed using Django's password hasher
- JWT tokens expire after 7 days (access) and 30 days (refresh)
- Library has 50 flexible seats available

---

## 🎯 Quick Test

**Test Student Login:**
```bash
curl -X POST http://localhost:8000/api/v1/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"user_type": "student", "library_id": "LIB1020", "student_id": "STU00001", "password": "3211"}'
```

**Test Admin Login:**
```bash
curl -X POST http://localhost:8000/api/v1/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"user_type": "library", "library_id": "LIB1020", "email": "admin@novalibrary.com", "password": "Admin@123"}'
```

---

**Generated**: February 16, 2026  
**Database**: Fresh setup with test data  
**Status**: ✅ Ready for testing

