# Library Management System - Flutter App

A comprehensive library management mobile application built with Flutter.

## Features

### Admin Portal
- Dashboard with analytics
- Student management (CRUD + bulk upload)
- Attendance tracking
- Seat management
- Subscription management
- Notification system
- QR code generation
- Reports with CSV export

### Student Portal
- Personal dashboard
- Study timer (Pomodoro + custom)
- Notes system
- Task management
- Goal tracking
- QR attendance scanner
- Attendance history
- Subscription details
- Notifications
- Profile management

## Tech Stack

- **Framework**: Flutter (latest stable)
- **State Management**: Riverpod
- **Navigation**: GoRouter
- **HTTP Client**: Dio
- **Storage**: flutter_secure_storage, shared_preferences
- **Charts**: fl_chart
- **QR**: qr_code_scanner, qr_flutter

## Setup

1. Install Flutter SDK
2. Clone the repository
3. Install dependencies:
   ```bash
   flutter pub get
   ```

4. Update API base URL in `lib/core/constants/api_constants.dart`:
   ```dart
   static const String baseUrl = 'http://YOUR_IP:8000/api/v1';
   ```

5. Run the app:
   ```bash
   flutter run
   ```

## Project Structure

```
lib/
├── main.dart
├── app.dart
├── core/
│   ├── theme/
│   ├── constants/
│   ├── utils/
│   └── widgets/
├── auth/
│   ├── login/
│   ├── register/
│   ├── auth_provider.dart
│   └── auth_service.dart
├── admin/
│   └── dashboard/
├── student/
│   └── dashboard/
├── services/
│   ├── api_client.dart
│   └── auth_service.dart
├── models/
│   └── user_model.dart
└── routes/
    └── app_router.dart
```

## Login Credentials

### Library Owner
- Library ID: LIB000001
- Email: testowner@library.com
- Password: SecurePass123

### Student
- Library ID: LIB000001
- Student ID: STU000001-0001
- Password: 3210

## Development Status

✅ Complete:
- Project structure
- Theme system
- Authentication flow
- Navigation setup
- Admin dashboard (basic)
- Student dashboard (basic)

🚧 In Progress:
- Additional admin features
- Additional student features
- API integration for all endpoints

## Next Steps

1. Implement remaining admin screens
2. Implement remaining student screens
3. Add API integration for all features
4. Add offline support
5. Add push notifications
6. Optimize performance
7. Add unit tests

## Notes

- Ensure backend is running at http://127.0.0.1:8000
- For Android emulator, use http://10.0.2.2:8000
- For iOS simulator, use http://127.0.0.1:8000
- For physical device, use your computer's IP address
