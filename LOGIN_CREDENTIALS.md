# 🔐 Login Credentials

## 📚 Library Owner Login

Use these credentials to login as **Library Owner/Admin**:

```
Library ID:  LIB000001
Email:       testowner@library.com
Password:    SecurePass123
```

**Access:** Full admin dashboard with all management features
- Dashboard with analytics and graphs
- Student management (add, edit, view profiles)
- Seat management
- Attendance tracking
- Subscription management
- Notifications
- Reports with financial analytics
- Library profile settings

---

## 👨‍🎓 Student Logins

Use any of these credentials to login as **Student**:

### Student 1: Rahul Kumar
```
Library ID:  LIB000001
Student ID:  STU000001-0001
Email:       (Leave empty - not set)
Password:    3210
```

### Student 2: Harsh
```
Library ID:  LIB000001
Student ID:  STU000001-0002
Email:       (Leave empty - not set)
Password:    5356
```

### Student 3: Shivani
```
Library ID:  LIB000001
Student ID:  STU000001-0003
Email:       (Leave empty - not set)
Password:    2233
```

### Student 4: Krishna
```
Library ID:  LIB000001
Student ID:  STU000001-0004
Email:       krishna@mail.com
Password:    4954
```

**Access:** Student dashboard with personal features
- Personal dashboard with welcome message
- Attendance history
- Subscription details
- Notifications
- Profile management

---

## 🌐 Application URLs

- **Frontend:** http://localhost:5174
- **Backend API:** http://127.0.0.1:8000
- **API Documentation:** http://127.0.0.1:8000/swagger/

---

## 📝 Notes

1. **Student Passwords:** Default passwords are the last 4 digits of the student's phone number
2. **Library ID:** All users belong to the same library (LIB000001)
3. **Student IDs:** Format is `STU{LibraryNumber}-{StudentNumber}`
4. **Email for Students:** Email is optional for students. Students 1-3 don't have emails set.
5. **First Time Login:** Students can change their password after first login (feature to be implemented)

---

## 🔄 Password Reset

If you forget your password:
1. Click "Forgot Password?" on the login page
2. Enter your Library ID, Student ID (for students), and Email
3. Follow the instructions sent to your email

---

## 🎨 UI Features

### Login Page Features:
- **Tab-based interface** - Switch between Owner and Student login
- **Color-coded themes** - Blue for owners, Purple for students
- **Modern design** - Gradient backgrounds and smooth animations
- **Form validation** - Required fields are validated
- **Optional email** - Students can login without email
- **Responsive** - Works on all screen sizes

### Admin Dashboard Features:
- **Real-time stats** - Live data updates with 7 stat cards
- **Interactive charts** - Line chart for attendance trends, Bar chart for financials
- **Unpaid students list** - See who hasn't paid with amounts
- **Attendance leaderboard** - Top 10 students with medals for top 3
- **Quick actions** - Easy access to common tasks
- **Search & filter** - Find information quickly
- **Professional UI** - Clean, modern interface with Font Awesome icons

### Student Management Features:
- **Comprehensive profiles** - View all student details including personal info
- **Profile modal** - Full-screen profile view with stats
- **Edit functionality** - Update student information inline
- **Gender avatars** - Visual representation based on gender
- **Search & filter** - Find students by name, phone, father's name
- **Status indicators** - Active/Inactive student status

---

## 🚀 Quick Start

1. Make sure both backend and frontend servers are running
2. Open http://localhost:5174 in your browser
3. Choose your user type (Owner or Student)
4. Enter the credentials from above
5. Click "Sign In"

### Testing Both Roles:

**Test as Library Owner:**
1. Use Library Owner credentials
2. Explore dashboard with analytics
3. Manage students, seats, attendance
4. View reports and financial data

**Test as Student:**
1. Use any student credentials (email is optional)
2. View personal dashboard
3. Check attendance and subscription
4. View profile information

Enjoy exploring the Library Management System! 📚✨
