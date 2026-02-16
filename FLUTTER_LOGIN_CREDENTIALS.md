# Flutter App Login Credentials

## ✅ Working Credentials for Testing

### Library: LIB2 (Nova coders)

---

## 📱 Student Login

### Student 1: Radhe Shyam
- **Library ID**: `LIB2`
- **Student ID**: `STU00001`
- **Password**: `3755`
- **Email**: harshvardhan.vision@gmail.com
- **Status**: ✅ Active, Password Set

### Student 2: Harsh
- **Library ID**: `LIB2`
- **Student ID**: `STU00002`
- **Password**: `3755`
- **Email**: harsh@mail.com
- **Status**: ✅ Active, Password Set

### Student 3: Nameen
- **Library ID**: `LIB2`
- **Student ID**: `STU00003`
- **Password**: `3753`
- **Email**: None
- **Status**: ✅ Active, Password Set

---

## 👨‍💼 Library Admin Login

### Nova coders Admin
- **Library ID**: `LIB2`
- **Email**: `novaadmin@library.com`
- **Password**: `NovaAdmin123`
- **Status**: ✅ Active

---

## 🔐 Login Instructions

### For Students:
1. Open the Flutter app
2. Tap on **"Student"** tab
3. Enter:
   - Library ID: `LIB2`
   - Student ID: (use one from above)
   - Password: (use corresponding password)
4. Tap **"Login as Student"**

### For Library Admin:
1. Open the Flutter app
2. Stay on **"Library Admin"** tab
3. Enter:
   - Library ID: `LIB2`
   - Email: `novaadmin@library.com`
   - Password: `NovaAdmin123`
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
- ✅ Student login API working
- ✅ Library admin login API working
- ✅ All passwords are set and hashed
- ✅ JWT tokens are being generated correctly

---

## 🐛 Troubleshooting

### If login fails:

1. **Check backend is running**:
   ```bash
   lsof -i :8000
   ```

2. **Check student has password**:
   ```bash
   python manage.py shell -c "from apps.students.models import Student; s = Student.objects.get(student_id='STU00001'); print(f'Has password: {bool(s.password)}')"
   ```

3. **Test API directly**:
   ```bash
   curl -X POST http://localhost:8000/api/v1/accounts/login/ \
     -H "Content-Type: application/json" \
     -d '{"user_type": "student", "library_id": "LIB2", "student_id": "STU00001", "password": "3755"}'
   ```

4. **Check Flutter app logs**:
   - Look for "Login DioException" messages
   - Check for network errors
   - Verify API URL is correct

---

## 📝 Notes

- Email is **optional** for student login
- Password is based on last 4 digits of phone number
- All students in LIB2 now have passwords set
- Passwords are hashed using Django's password hasher
- JWT tokens expire after 60 minutes (access) and 24 hours (refresh)
