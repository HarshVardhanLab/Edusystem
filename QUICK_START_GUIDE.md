# 🚀 Quick Start Guide - Student Portal

## ⚡ Start the Application

### 1. Start Backend Server
```bash
source venv/bin/activate
python manage.py runserver
```
**Backend will run on:** http://127.0.0.1:8000

### 2. Start Frontend Server
```bash
cd frontend-web
npm run dev
```
**Frontend will run on:** http://localhost:5173

---

## 🔐 Login Credentials

### Library Owner (Admin):
```
Library ID:  LIB000001
Email:       testowner@library.com
Password:    SecurePass123
```

### Students:
```
Student 1 (Rahul Kumar):
Library ID:  LIB000001
Student ID:  STU000001-0001
Password:    3210

Student 2 (Harsh):
Library ID:  LIB000001
Student ID:  STU000001-0002
Password:    5356

Student 3 (Shivani):
Library ID:  LIB000001
Student ID:  STU000001-0003
Password:    2233

Student 4 (Krishna):
Library ID:  LIB000001
Student ID:  STU000001-0004
Email:       krishna@mail.com
Password:    4954
```

---

## 📱 Student Portal Features

### 1. Dashboard 📊
- View daily motivational quote
- See study hours, attendance rate, streak
- Check subscription status
- View 7-day study trend chart
- Quick actions: Start Timer, Mark Attendance, Add Note

### 2. Study Timer ⏱️
- Click "Study Timer" in sidebar
- Choose Pomodoro (25 min) or Custom
- Click "Start Session"
- Timer will count down with animations
- Click "Stop" to save session
- View session history on the right

### 3. Notes 📝
- Click "My Notes" in sidebar
- Click "New Note" button
- Enter title and content
- Choose category and color
- Click "Create Note"
- Search and filter notes
- Star favorites

### 4. Tasks ✅
- Click "Tasks" in sidebar
- Click "New Task" button
- Enter task details
- Set priority (High/Medium/Low)
- Set due date (optional)
- Click "Create Task"
- Check off completed tasks

### 5. QR Attendance 📱
- Click "QR Attendance" in sidebar
- Choose "Scan with Camera" or "Enter Manually"
- For camera: Allow camera access and scan QR
- For manual: Paste QR code and click "Mark Attendance"
- View today's status and recent history

### 6. Study Goals 🎯
- Click "Study Goals" in sidebar
- Click "New Goal" button
- Choose Daily/Weekly/Monthly
- Set target hours
- Click "Create Goal"
- Track progress with progress bars

### 7. Attendance History 📅
- Click "Attendance History" in sidebar
- View stats: Total days, This month, Rate, Streak
- See 7-day trend chart
- Browse all attendance records

### 8. Subscription 💳
- Click "Subscription" in sidebar
- View active subscription details
- Check payment status
- See expiry date

### 9. Notifications 🔔
- Click "Notifications" in sidebar
- View all notifications
- Mark as read
- See timestamps

### 10. Profile 👤
- Click "Profile" in sidebar
- View personal information
- See student ID and library details

---

## 🎨 UI Features

### Beautiful Design:
- ✨ Gradient backgrounds
- 🎭 Smooth animations
- 📱 Mobile responsive
- 🎨 Color-coded elements
- 🔔 Toast notifications
- ⚡ Fast loading

### Navigation:
- Sidebar menu on left
- Active page highlighted
- User info in navbar
- Logout button in navbar

---

## 🔧 Admin Features

### Generate QR Code:
1. Login as admin
2. Go to admin panel
3. Generate QR code for today
4. Share with students
5. Students scan to mark attendance

---

## 💡 Tips

### For Students:
1. **Start your day** - Check dashboard for motivation
2. **Use Pomodoro** - 25 min focused study sessions
3. **Take notes** - Organize by color and category
4. **Set goals** - Start with achievable targets
5. **Track tasks** - Never miss a deadline
6. **Mark attendance** - Use QR for quick check-in

### For Admins:
1. **Generate QR daily** - For attendance
2. **Monitor progress** - Check student stats
3. **Send notifications** - Keep students informed
4. **Review reports** - Track overall performance

---

## 🐛 Troubleshooting

### Backend not starting:
```bash
# Check if port 8000 is in use
lsof -ti:8000
# Kill process if needed
kill -9 $(lsof -ti:8000)
# Restart
python manage.py runserver
```

### Frontend not starting:
```ba