# Flutter App Setup Guide

## Prerequisites

1. **Flutter SDK** (latest stable version)
   - Download from: https://flutter.dev/docs/get-started/install
   - Verify installation: `flutter doctor`

2. **IDE** (Choose one)
   - Android Studio with Flutter plugin
   - VS Code with Flutter extension
   - IntelliJ IDEA with Flutter plugin

3. **Backend Server**
   - Django backend must be running at `http://127.0.0.1:8000`

## Installation Steps

### 1. Navigate to Project Directory
```bash
cd flutter_app
```

### 2. Install Dependencies
```bash
flutter pub get
```

### 3. Configure API Base URL

Edit `lib/core/constants/api_constants.dart`:

**For Android Emulator:**
```dart
static const String baseUrl = 'http://10.0.2.2:8000/api/v1';
```

**For iOS Simulator:**
```dart
static const String baseUrl = 'http://127.0.0.1:8000/api/v1';
```

**For Physical Device:**
```dart
static const String baseUrl = 'http://YOUR_COMPUTER_IP:8000/api/v1';
```

To find your IP:
- **macOS/Linux**: `ifconfig | grep inet`
- **Windows**: `ipconfig`

### 4. Run the App

**Check connected devices:**
```bash
flutter devices
```

**Run on specific device:**
```bash
flutter run -d <device_id>
```

**Run in debug mode:**
```bash
flutter run
```

**Run in release mode:**
```bash
flutter run --release
```

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── app.dart                  # Root widget
├── core/
│   ├── theme/               # Theme configuration
│   │   ├── colors.dart
│   │   ├── typography.dart
│   │   ├── spacing.dart
│   │   └── app_theme.dart
│   ├── constants/           # App constants
│   │   └── api_constants.dart
│   └── widgets/             # Reusable widgets
│       ├── gradient_header.dart
│       └── stat_card.dart
├── auth/                    # Authentication
│   ├── auth_provider.dart
│   ├── login/
│   │   └── login_screen.dart
│   └── register/
│       └── register_screen.dart
├── admin/                   # Admin portal
│   └── dashboard/
│       └── admin_dashboard_screen.dart
├── student/                 # Student portal
│   ├── dashboard/
│   │   └── student_dashboard_screen.dart
│   ├── notes/
│   │   └── notes_screen.dart
│   └── tasks/
│       └── tasks_screen.dart
├── services/                # API services
│   ├── api_client.dart
│   ├── auth_service.dart
│   ├── student_service.dart
│   ├── notification_service.dart
│   ├── note_service.dart
│   └── task_service.dart
├── models/                  # Data models
│   ├── user_model.dart
│   ├── student_model.dart
│   ├── attendance_model.dart
│   ├── notification_model.dart
│   ├── note_model.dart
│   └── task_model.dart
└── routes/                  # Navigation
    └── app_router.dart
```

## Features Implemented

### ✅ Authentication
- Login (Owner/Student)
- Register
- JWT token management
- Auto-login
- Role-based routing

### ✅ Admin Portal
- Dashboard with stats
- Quick actions
- Bottom navigation

### ✅ Student Portal
- Dashboard with stats
- Daily quote
- Quick actions
- Notes management (CRUD)
- Tasks management (CRUD)
- Bottom navigation

## Testing Credentials

### Library Owner
- **Library ID**: LIB000001
- **Email**: testowner@library.com
- **Password**: SecurePass123

### Student
- **Library ID**: LIB000001
- **Student ID**: STU000001-0001
- **Password**: 3210

## Common Issues & Solutions

### 1. "Unable to connect to backend"
**Solution**: 
- Ensure Django server is running
- Check API base URL configuration
- For physical device, ensure device and computer are on same network

### 2. "Certificate verification failed"
**Solution**: 
- Use HTTP instead of HTTPS for local development
- Or configure SSL certificates properly

### 3. "Package not found"
**Solution**:
```bash
flutter clean
flutter pub get
```

### 4. "Build failed"
**Solution**:
```bash
flutter clean
flutter pub get
flutter run
```

### 5. "Hot reload not working"
**Solution**:
- Press 'r' in terminal for hot reload
- Press 'R' for hot restart
- Or restart the app

## Development Tips

### Hot Reload
- Press `r` in terminal for hot reload
- Press `R` for hot restart
- Press `q` to quit

### Debug Mode
```bash
flutter run --debug
```

### Release Mode
```bash
flutter run --release
```

### Build APK (Android)
```bash
flutter build apk --release
```

### Build IPA (iOS)
```bash
flutter build ios --release
```

### View Logs
```bash
flutter logs
```

### Analyze Code
```bash
flutter analyze
```

### Format Code
```bash
flutter format .
```

## Next Steps

### To Complete the App:

1. **Add Remaining Admin Screens**
   - Students management
   - Attendance tracking
   - Seats management
   - Subscriptions
   - QR code generation
   - Reports

2. **Add Remaining Student Screens**
   - Study timer
   - Goals tracking
   - QR scanner
   - Attendance history
   - Subscription details
   - Notifications
   - Profile

3. **Implement API Integration**
   - Connect all screens to backend
   - Handle loading states
   - Handle errors
   - Add offline support

4. **Add Features**
   - Push notifications
   - Image upload
   - File picker
   - QR scanner
   - Charts
   - CSV export

5. **Testing**
   - Unit tests
   - Widget tests
   - Integration tests

6. **Optimization**
   - Performance optimization
   - Memory management
   - Network caching
   - Image caching

## Resources

- **Flutter Documentation**: https://flutter.dev/docs
- **Riverpod Documentation**: https://riverpod.dev
- **GoRouter Documentation**: https://pub.dev/packages/go_router
- **Dio Documentation**: https://pub.dev/packages/dio

## Support

For issues or questions:
1. Check the documentation
2. Review error messages
3. Check backend logs
4. Verify API endpoints
5. Test with Postman first

## Version History

- **v1.0.0** - Initial release with auth, dashboard, notes, and tasks
