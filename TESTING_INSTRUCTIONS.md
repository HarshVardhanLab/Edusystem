# 📱 Flutter App Testing Instructions

## ✅ Current Status
- **Backend**: Running at `http://127.0.0.1:8000/`
- **Flutter App**: Installed and running on Android emulator
- **Bug Fix**: Type error in UserModel fixed (hot reload will apply changes)

---

## 🔧 Issue Fixed
The app crashed on login due to a type mismatch. I've fixed the `UserModel.fromJson` method to handle both string and integer IDs from the API.

**What was fixed:**
```dart
// Before (caused crash)
id: json['id']

// After (handles both types)
id: json['id'] is String ? int.parse(json['id']) : json['id']
```

---

## 🧪 How to Test Now

### Step 1: Restart the App
Since the app is already running, you have two options:

**Option A: Hot Restart (Recommended)**
1. Look at your terminal where `flutter run` is active
2. Press `R` (capital R) for hot restart
3. This will reload the app with the fix

**Option B: Relaunch from Emulator**
1. Close the app on the emulator
2. Open it again from the app drawer
3. The installed APK already has the fix

### Step 2: Test Login

#### Test as Library Owner (Admin)
1. On the login screen, select **"Owner"** tab
2. Enter credentials:
   - **Library ID**: `LIB000001`
   - **Email**: `testowner@library.com`
   - **Password**: `SecurePass123`
3. Tap **"Login"**
4. You should see the Admin Dashboard

#### Test as Student
1. On the login screen, select **"Student"** tab
2. Enter credentials:
   - **Library ID**: `LIB000001`
   - **Student ID**: `STU000001-0001`
   - **Password**: `3210`
3. Tap **"Login"**
4. You should see the Student Dashboard

---

## 🎯 What to Test After Login

### Admin Portal Features
1. **Dashboard**
   - Check if stats load correctly
   - Verify real-time data from backend

2. **Students Management**
   - View list of students
   - Try adding a new student
   - Search for students
   - Filter by Active/Inactive

3. **Attendance Management**
   - Select today's date
   - Mark some students present
   - Check if attendance is saved

4. **Seats Management**
   - View the seat grid
   - Try adding a new seat
   - Change seat status

5. **QR Code Generation**
   - Generate a new QR code
   - View the QR code
   - Check QR code history

6. **Reports**
   - View dashboard statistics
   - Check monthly attendance report

### Student Portal Features
1. **Dashboard**
   - Check if stats display
   - View motivational quote
   - See study trend chart

2. **Study Timer**
   - Start a Pomodoro session
   - Test different durations
   - Stop and check if session is saved

3. **Notes**
   - Create a new note
   - Select different categories
   - Edit and delete notes

4. **Tasks**
   - Create a task with priority
   - Set due date
   - Mark task as complete

5. **Goals**
   - Create daily/weekly/monthly goals
   - Update progress
   - Delete goals

6. **QR Scanner**
   - Try scanning (camera permission needed)
   - Test manual entry option

7. **Attendance History**
   - View attendance records
   - Check monthly stats

8. **Subscription**
   - View current plan
   - Check subscription history

9. **Notifications**
   - View notifications
   - Filter by status
   - Mark as read

10. **Profile**
    - View student information
    - Check all details display correctly

---

## 🐛 If You Encounter Issues

### App Crashes on Login
- The fix has been applied
- Do a hot restart (press `R` in terminal)
- Or close and reopen the app

### API Connection Errors
- Check if Django backend is still running
- Verify URL: `http://127.0.0.1:8000/`
- Backend should show API requests in terminal

### Camera Permission for QR Scanner
- When prompted, allow camera access
- If denied, go to emulator Settings > Apps > Library Management > Permissions

### Data Not Loading
- Check backend terminal for errors
- Verify database has test data
- Check network connectivity

---

## 💡 Development Tips

### Hot Reload (Fast - UI Changes Only)
```bash
# In the terminal where flutter run is active
Press 'r'
```

### Hot Restart (Full - Code Changes)
```bash
# In the terminal where flutter run is active
Press 'R'
```

### View Logs
```bash
# All logs are visible in the terminal
# Look for errors starting with E/flutter
```

### Clear App Data
```bash
# If you need to reset the app
# Go to emulator Settings > Apps > Library Management > Storage > Clear Data
```

---

## 📊 Expected Behavior

### Successful Login
- No error messages
- Smooth transition to dashboard
- Bottom navigation visible
- Data loads from backend

### API Calls
- Loading indicators appear
- Data populates after loading
- Toast messages for success/error
- Smooth navigation

### UI/UX
- Gradient headers on all screens
- Stat cards with animations
- Responsive touch interactions
- Smooth scrolling

---

## ✅ Success Checklist

After testing, verify:
- [ ] Login works for both admin and student
- [ ] Dashboard loads with correct data
- [ ] Navigation between screens works
- [ ] CRUD operations function properly
- [ ] API calls succeed
- [ ] No crashes or freezes
- [ ] UI looks good and responsive
- [ ] All features are accessible

---

## 🎉 You're All Set!

The app is ready for comprehensive testing. The type error has been fixed, and you can now:

1. **Hot restart** the app (press `R`)
2. **Login** with test credentials
3. **Test** all features
4. **Report** any issues you find

**Happy Testing! 🚀**

---

## 📞 Quick Reference

### Test Credentials
- **Admin**: LIB000001 / testowner@library.com / SecurePass123
- **Student**: LIB000001 / STU000001-0001 / 3210

### Backend URL
- **Django**: http://127.0.0.1:8000/
- **API**: http://10.0.2.2:8000/api/v1/ (from emulator)

### Flutter Commands
- **Hot Reload**: Press `r`
- **Hot Restart**: Press `R`
- **Quit**: Press `q`
- **Clear Screen**: Press `c`
- **Help**: Press `h`
