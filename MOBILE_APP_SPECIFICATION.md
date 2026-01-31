# Library Management System - Mobile App Specification

## 📱 Complete Frontend Feature Documentation

This document provides a comprehensive specification of all frontend features, UI components, design patterns, and theme details for developing a mobile app that mirrors the web application.

---

## 🎨 Design System & Theme

### Color Palette

#### Primary Colors
- **Blue**: `#2563eb` (Blue-600) - Primary actions, links
- **Purple**: `#9333ea` (Purple-600) - Secondary actions, accents
- **Indigo**: `#4f46e5` (Indigo-600) - Headers, important elements

#### Status Colors
- **Success/Green**: `#10b981` (Green-500) - Success states, active status
- **Warning/Orange**: `#f59e0b` (Orange-500) - Warnings, pending states
- **Error/Red**: `#ef4444` (Red-500) - Errors, inactive status
- **Info/Blue**: `#3b82f6` (Blue-500) - Information, neutral states

#### Gradient Combinations
1. **Purple to Pink**: `from-purple-600 to-pink-600` - Notifications, special features
2. **Blue to Purple**: `from-blue-600 to-purple-600` - Primary headers
3. **Indigo to Purple**: `from-indigo-600 to-purple-600` - Reports, analytics
4. **Green to Teal**: `from-green-600 to-teal-600` - Success actions, confirmations
5. **Orange to Red**: `from-orange-500 to-red-500` - Warnings, alerts

#### Neutral Colors
- **Gray-50**: `#f9fafb` - Backgrounds
- **Gray-100**: `#f3f4f6` - Card backgrounds
- **Gray-200**: `#e5e7eb` - Borders
- **Gray-600**: `#4b5563` - Secondary text
- **Gray-800**: `#1f2937` - Primary text
- **White**: `#ffffff` - Cards, modals

### Typography

#### Font Family
- **Primary**: System fonts (San Francisco on iOS, Roboto on Android)
- **Web**: Default system font stack

#### Font Sizes
- **Heading 1**: 30px (3xl) - Page titles
- **Heading 2**: 24px (2xl) - Section titles
- **Heading 3**: 20px (xl) - Card titles
- **Body Large**: 16px (base) - Primary text
- **Body**: 14px (sm) - Secondary text
- **Caption**: 12px (xs) - Labels, hints

#### Font Weights
- **Bold**: 700 - Headings, important text
- **Semibold**: 600 - Subheadings, labels
- **Medium**: 500 - Buttons, links
- **Regular**: 400 - Body text

### Spacing System
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

### Border Radius
- **Small**: 8px - Buttons, inputs
- **Medium**: 12px - Cards
- **Large**: 16px - Modals
- **XLarge**: 24px - Headers, special cards
- **Full**: 9999px - Pills, badges, avatars

### Shadows
- **Small**: `0 1px 2px rgba(0,0,0,0.05)` - Subtle elevation
- **Medium**: `0 4px 6px rgba(0,0,0,0.1)` - Cards
- **Large**: `0 10px 15px rgba(0,0,0,0.1)` - Modals, dropdowns
- **XLarge**: `0 20px 25px rgba(0,0,0,0.15)` - Floating elements

---

## 🔐 Authentication System

### Login Page

#### Layout
- **Background**: White with subtle gradient
- **Logo Area**: Top center with library icon
- **Form Card**: Centered, rounded corners, shadow

#### Components
1. **User Type Selector**
   - Toggle between "Library Owner" and "Student"
   - Pill-style buttons
   - Active state: Blue gradient background
   - Inactive state: Gray background

2. **Input Fields**
   - **Library ID**: Text input with icon
   - **Email/Student ID**: Conditional based on user type
   - **Password**: Password input with show/hide toggle
   - Border: Gray-300, Focus: Blue-500
   - Height: 48px, Padding: 12px 16px

3. **Login Button**
   - Full width
   - Gradient: Blue to Purple
   - Height: 48px
   - Text: White, Bold
   - Loading state: Spinner animation

4. **Additional Links**
   - "Forgot Password?" - Right aligned, Blue text
   - "Register Library" - Center, Gray text

#### Validation
- Real-time field validation
- Error messages below inputs (Red text)
- Success toast on login
- Error toast on failure

### Register Page

#### Form Sections
1. **Library Information**
   - Library Name
   - Owner Name
   - Email
   - Phone
   - Address (textarea)

2. **Account Setup**
   - Password (with strength indicator)
   - Confirm Password

3. **Submit Button**
   - Gradient: Green to Teal
   - Full width

---

## 👨‍💼 Admin Portal

### Dashboard

#### Header
- **Gradient**: Indigo to Purple
- **Title**: "Dashboard 📊"
- **Subtitle**: "Welcome back, [Owner Name]"
- **Padding**: 24px
- **Border Radius**: 24px

#### Stats Cards (4 columns on desktop, 2 on mobile)
1. **Total Students**
   - Icon: Users icon
   - Color: Blue gradient
   - Value: Large number (3xl)
   - Label: Small text below

2. **Present Today**
   - Icon: Check icon
   - Color: Green gradient
   - Value: Number
   - Label: "Present Today"

3. **Active Subscriptions**
   - Icon: Credit card icon
   - Color: Purple gradient
   - Value: Number
   - Label: "Active Subscriptions"

4. **Available Seats**
   - Icon: Chair icon
   - Color: Orange gradient
   - Value: Number / Total
   - Label: "Available Seats"

#### Charts Section
1. **Attendance Graph** (Last 7 days)
   - Type: Line chart
   - Library: Recharts
   - Colors: Blue line, Gray grid
   - Height: 300px

2. **Financial Overview**
   - Total Earnings: Green
   - Total Dues: Red
   - Monthly Earnings: Blue

#### Quick Actions
- Grid of action buttons
- Icons with labels
- Gradient backgrounds
- Navigate to respective pages

#### Recent Activity
- List of recent attendance
- Student names with timestamps
- Scrollable container

### Students Management

#### Header
- Title: "Students Management"
- Buttons: "Bulk Upload" (secondary), "Add Student" (primary)

#### Stats Cards (4 columns)
1. Total Students - Blue
2. Active - Green
3. Inactive - Red
4. Male/Female - Purple

#### Search & Filter Bar
- **Search Input**
  - Icon: Search icon (left)
  - Placeholder: "Search by name, phone, or father's name..."
  - Full width on mobile
  - Border: Gray-300
  - Focus: Blue ring

- **Filter Dropdown**
  - Options: All Students, Active Only, Inactive Only
  - Icon: Filter icon
  - Border: Gray-300

#### Students Table
**Columns:**
1. **Name**
   - Avatar (circular, colored by gender)
   - Full name (bold)
   - Father's name (small, gray)

2. **Contact**
   - Phone with icon
   - Email with icon (if available)

3. **Age**
   - Format: "25 yrs"
   - Shows "-" if not available

4. **Preparing For**
   - Text or "-"

5. **Qualification**
   - Text or "-"

6. **Time Slot**
   - Badge with blue background
   - Text: MORNING/AFTERNOON/EVENING/FULL_DAY

7. **Status**
   - Badge: Green (Active) or Red (Inactive)

8. **Actions**
   - View button (Blue)
   - Activate/Deactivate button (Green/Red)
   - Delete button (Red)

**Mobile View:**
- Card layout instead of table
- Each student as a card
- Swipe actions for quick operations

#### Add Student Modal

**Sections:**
1. **Basic Information**
   - Full Name (required)
   - Phone (required)
   - Email
   - Time Slot (dropdown)

2. **Personal Details**
   - Gender (dropdown)
   - Date of Birth (date picker)
   - Father's Name
   - Emergency Contact

3. **Educational Details**
   - Preparing For
   - Qualification/Class
   - Education Level (dropdown)
   - School/College Name
   - Address (textarea)

4. **Documents**
   - Photo upload (image picker)
   - ID Proof upload (file picker)

**Modal Style:**
- White background
- Rounded corners (16px)
- Shadow: Large
- Close button: Top right
- Submit button: Bottom, gradient

#### Bulk Upload Modal
- Instructions section (Blue background)
- Download template button (Green)
- File upload area (Dashed border)
- Upload button (Blue gradient)
- Progress indicator during upload

#### Student Profile Modal
- Full-screen on mobile
- Tabs: Profile, Attendance, Subscription, Payment History
- Edit button: Top right
- Close button: Top left

### Attendance Management

#### Header
- Gradient: Green to Teal
- Title: "Attendance 📅"

#### Daily Attendance View
- Date selector at top
- Stats: Total Present, Total Absent
- Student list with checkboxes
- Mark All Present button
- Submit button

#### Attendance Table
- Columns: Student Name, Seat, Check-in Time, Status
- Filter by date range
- Export to CSV button

### Seats Management

#### Header
- Gradient: Orange to Yellow
- Title: "Seats Management 🪑"

#### Seat Grid View
- Visual grid layout
- Each seat as a card
- Color coding:
  - Green: Available
  - Blue: Occupied
  - Gray: Maintenance
- Seat number displayed
- Student name if occupied

#### Add Seat Modal
- Seat Number input
- Floor/Section dropdown
- Status selector
- Submit button

### Subscriptions Management

#### Header
- Gradient: Purple to Pink
- Title: "Subscriptions 💳"

#### Stats Cards
1. Active Subscriptions - Green
2. Expiring Soon - Orange
3. Expired - Red
4. Total Revenue - Blue

#### Subscriptions Table
- Columns: Student, Plan, Amount, Start Date, End Date, Status, Actions
- Filter by status
- Payment status badges (Green: PAID, Red: DUE)

#### Create Subscription Modal
- Student selector (dropdown with search)
- Plan Name input
- Fee Amount input
- Start Date (date picker)
- End Date (date picker)
- Fee Status (dropdown: PAID/DUE)
- Submit button

### Notifications Management

#### Header
- Gradient: Purple to Pink
- Title: "Notifications 🔔"
- Create Notification button (White)

#### Stats Cards
1. Total Sent - Blue
2. Unread - Orange
3. Read - Green

#### Filter Tabs
- All (count)
- Unread (count)
- Read (count)
- Active tab: Blue background

#### Notifications List
- Card layout
- Icon (colored by type)
- Title (bold)
- Recipient name
- Timestamp
- Message
- Status badge (Unread/Read)

#### Create Notification Modal
- Student selector (dropdown)
- Notification Type (dropdown):
  - 📢 Announcement
  - 📅 Subscription Expiry
  - 💰 Fee Due
- Title input
- Message textarea
- Send button (Purple gradient)

### QR Code Management

#### Header
- Gradient: Purple to Blue
- Title: "QR Code Management 📱"

#### Today's QR Code Section
- Large QR code display (300x300)
- White background with padding
- Date display below
- Valid time range
- QR code value (for manual entry)

#### Action Buttons
1. Download QR Code (Blue)
2. Print QR Code (Purple)
3. Regenerate (Gray)

#### QR Code History
- List of previous QR codes
- Date and time
- Status badge (Active/Expired)
- Icon: QR code icon

### Reports

#### Header
- Gradient: Indigo to Purple
- Title: "Reports 📊"

#### Report Generator Card
- Month selector (dropdown)
- Year input
- Generate Report button (Indigo gradient)

#### Stats Cards (after generation)
1. Total Students - Blue
2. Avg Attendance Days - Purple
3. Paid Subscriptions - Green
4. Due Payments - Red

#### Report Table
- Columns: #, Student Name, Seat Number, Attendance Days, Subscription Status
- Hover effect on rows
- Download CSV button (Green gradient)
- Table header with report info

---

## 👨‍🎓 Student Portal

### Dashboard

#### Header
- Gradient: Blue to Purple
- Title: "Dashboard 📚"
- Subtitle: "Welcome, [Student Name]"

#### Daily Quote Card
- Gradient background
- Large quote text
- Author name
- Refresh button

#### Stats Cards (4 columns)
1. **Study Hours**
   - Icon: Clock
   - Color: Blue gradient
   - Value: Hours this week

2. **Attendance**
   - Icon: Calendar
   - Color: Green gradient
   - Value: Percentage

3. **Streak**
   - Icon: Fire
   - Color: Orange gradient
   - Value: Days

4. **Subscription**
   - Icon: Credit card
   - Color: Purple gradient
   - Value: Days remaining

#### Study Trend Chart
- Line chart (Last 7 days)
- Blue line
- Shows study hours per day

#### Quick Actions
- Grid of 6 action buttons
- Icons with labels
- Gradient backgrounds

#### Activity Summary
- Recent study sessions
- Recent notes
- Upcoming tasks

### Study Timer

#### Header
- Gradient: Orange to Red
- Title: "Study Timer ⏱️"

#### Timer Display
- Large circular timer
- Color changes based on time:
  - Green: >50% remaining
  - Orange: 25-50% remaining
  - Red: <25% remaining
- Time in center (large)
- Mode label below

#### Mode Selector
- Pomodoro (25 min)
- Custom timer
- Toggle buttons

#### Controls
- Start button (Green)
- Pause button (Orange)
- Stop button (Red)
- Large, circular buttons

#### Session History
- Sidebar on desktop, bottom sheet on mobile
- Last 10 sessions
- Date, duration, time
- Today's total at top

### Notes

#### Header
- Gradient: Yellow to Orange
- Title: "My Notes 📝"
- Add Note button (Green)

#### Filter Bar
- Search input
- Category filter (dropdown)
- Color filter

#### Notes Grid
- Masonry layout
- Each note as a card
- Color-coded borders
- Title (bold)
- Content preview
- Category badge
- Star icon (favorite)
- Edit/Delete icons on hover

#### Create/Edit Note Modal
- Title input
- Category selector (8 options):
  - Math, Science, History, Language
  - Exam Prep, Revision, General, Other
- Color picker (7 colors)
- Content editor (rich text)
- Star favorite checkbox
- Save button

### Tasks

#### Header
- Gradient: Green to Teal
- Title: "My Tasks ✓"
- Add Task button (Blue)

#### Stats Cards
1. Total Tasks - Blue
2. Active - Orange
3. Completed - Green

#### Filter Tabs
- All
- Active
- Completed

#### Tasks List
- Card layout
- Checkbox (left)
- Title (bold)
- Description
- Priority badge (High/Medium/Low with colors)
- Due date
- Overdue indicator (Red)
- Delete button

#### Create Task Modal
- Title input
- Description textarea
- Priority selector (dropdown)
- Due date picker
- Create button (Green gradient)

### Goals

#### Header
- Gradient: Purple to Pink
- Title: "Study Goals 🎯"
- Add Goal button (Blue)

#### Stats Cards
1. Total Goals - Blue
2. Active - Orange
3. Completed - Green

#### Goals List
- Active goals section
- Completed goals section
- Each goal card:
  - Title (bold)
  - Type badge (Daily/Weekly/Monthly)
  - Progress bar (color-coded)
  - Target value
  - Current value
  - Achievement emoji if completed
  - Mark Complete button

#### Create Goal Modal
- Title input
- Goal Type (dropdown)
- Target Value input
- Create button (Purple gradient)

### QR Attendance

#### Header
- Gradient: Blue to Indigo
- Title: "Mark Attendance 📱"

#### Today's Status Card
- Shows if already marked
- Date and time
- Status badge (Present/Not Marked)

#### Scanner Section
- Camera view (if permission granted)
- Scan button
- Manual entry option (always visible)
- Code input field
- Submit button

#### Help Section
- Camera permission instructions
- Manual entry guide
- HTTPS requirement note
- Troubleshooting tips

#### Recent Attendance
- Last 7 days
- Date, time, method (QR/Manual)
- Status icons

### Attendance History

#### Header
- Gradient: Green to Teal
- Title: "Attendance History 📅"

#### Stats Cards
1. Total Days - Blue
2. This Month - Green
3. Attendance Rate - Purple
4. Streak - Orange

#### Chart
- Line chart (Last 7 days)
- Green line
- Shows attendance pattern

#### Records List
- Card layout
- Date (large)
- Check-in time
- Method badge (QR Code/Manual)
- All records show as Present (green)

### Subscription

#### Header
- Gradient: Purple to Pink
- Title: "My Subscription 💳"

#### Active Subscription Card
- Large gradient card (Green if paid, Red if due)
- Amount (large)
- Days remaining
- Start date
- End date
- Status badge
- Expiring soon warning (if <7 days)

#### Subscription History
- List of past subscriptions
- Date range
- Amount
- Status badge
- Active indicator

#### Help Section
- Contact admin instructions
- Payment information
- Renewal process

### Notifications

#### Header
- Gradient: Blue to Indigo
- Title: "Notifications 🔔"

#### Stats Cards
1. Total - Blue
2. Unread - Orange
3. Read - Green

#### Filter Tabs
- All (count)
- Unread (count)
- Read (count)

#### Notifications List
- Card layout
- Icon (colored by type)
- Title (bold)
- Message
- Timestamp
- New badge (if unread)
- Mark as Read button

#### Mark All Read Button
- Purple gradient
- Top right

### Profile

#### Header
- Gradient cover image
- Large avatar (circular)
- Name (large, bold)
- Student ID

#### Stats Cards
1. Attendance Rate - Green
2. Study Hours - Blue
3. Active Days - Purple

#### Information Sections

**Personal Information:**
- Full Name
- Email
- Phone
- Gender (with icon)
- Date of Birth
- Address

**Educational Information:**
- Preparing For
- Education Level
- Institution
- Qualification

**Library Information:**
- Library Name
- Library ID
- Student ID
- Role

Each field:
- Icon (left)
- Label (small, gray)
- Value (bold, black)
- Gray background card

#### Edit Profile Button
- Top right
- Blue gradient

---

## 🧩 Reusable Components

### Buttons

#### Primary Button
- Background: Blue gradient
- Text: White, Bold
- Height: 48px
- Padding: 12px 24px
- Border Radius: 8px
- Shadow: Medium
- Hover: Darker gradient
- Active: Scale 0.95

#### Secondary Button
- Background: Gray-200
- Text: Gray-700, Bold
- Same dimensions as primary
- Hover: Gray-300

#### Danger Button
- Background: Red-600
- Text: White, Bold
- Same dimensions as primary
- Hover: Red-700

#### Icon Button
- Circular or square
- Icon only
- Size: 40px
- Background: Transparent or colored
- Hover: Background opacity

### Input Fields

#### Text Input
- Height: 48px
- Padding: 12px 16px
- Border: 1px solid Gray-300
- Border Radius: 8px
- Focus: Blue-500 ring
- Font Size: 16px
- Placeholder: Gray-400

#### Textarea
- Min Height: 96px
- Same styling as text input
- Resizable

#### Select/Dropdown
- Same styling as text input
- Chevron icon (right)
- Dropdown menu: White background, shadow

#### Date Picker
- Calendar popup
- Selected date: Blue background
- Today: Blue border
- Navigation arrows

#### File Upload
- Dashed border
- Upload icon
- "Choose file" text
- Selected file name display
- Remove button

### Cards

#### Basic Card
- Background: White
- Border Radius: 12px
- Shadow: Medium
- Padding: 16px

#### Stat Card
- Gradient background
- White text
- Icon (top right)
- Large value (3xl)
- Small label

#### List Card
- White background
- Border: Gray-200
- Hover: Gray-50 background
- Padding: 16px

### Modals

#### Structure
- Overlay: Black with 50% opacity
- Container: White, centered
- Border Radius: 16px
- Shadow: XLarge
- Max Width: 600px (desktop)
- Full screen on mobile

#### Header
- Title (bold, large)
- Close button (top right)
- Border bottom: Gray-200

#### Body
- Padding: 24px
- Scrollable if content overflows

#### Footer
- Border top: Gray-200
- Padding: 16px
- Buttons: Right aligned

### Badges

#### Status Badge
- Padding: 4px 12px
- Border Radius: Full
- Font Size: 12px
- Font Weight: Semibold
- Colors based on status

#### Count Badge
- Small circular badge
- Background: Red
- Text: White
- Position: Top right of icon

### Tables

#### Desktop Table
- Full width
- Border: Gray-200
- Header: Gray-50 background
- Rows: Hover Gray-50
- Cell Padding: 12px 16px

#### Mobile Table
- Card layout
- Each row as a card
- Swipe actions

### Loading States

#### Spinner
- Circular animation
- Blue color
- Sizes: sm (16px), md (24px), lg (48px)

#### Skeleton
- Gray-200 background
- Animated shimmer effect
- Matches content shape

#### Progress Bar
- Height: 8px
- Background: Gray-200
- Fill: Blue gradient
- Border Radius: Full
- Animated

### Toast Notifications

#### Success Toast
- Background: Green-500
- Icon: Check circle
- Text: White
- Position: Top right
- Duration: 3 seconds

#### Error Toast
- Background: Red-500
- Icon: X circle
- Text: White

#### Info Toast
- Background: Blue-500
- Icon: Info circle
- Text: White

### Empty States

#### Structure
- Large icon (Gray-300)
- Title (Gray-800)
- Description (Gray-600)
- Action button (optional)
- Centered layout

---

## 📐 Layout Patterns

### Navigation

#### Admin Navigation (Sidebar on desktop, Bottom nav on mobile)
**Menu Items:**
1. Dashboard - Home icon
2. Students - Users icon
3. Attendance - Calendar icon
4. Seats - Chair icon
5. Subscriptions - Credit card icon
6. Notifications - Bell icon
7. QR Codes - QR icon
8. Reports - Chart icon
9. Library - Building icon

**Active State:**
- Blue background
- White text
- Left border (Blue)

#### Student Navigation
**Menu Items:**
1. Dashboard - Home icon
2. Study Timer - Clock icon
3. Notes - Document icon
4. Tasks - Check icon
5. Goals - Target icon
6. QR Attendance - QR icon
7. Attendance - Calendar icon
8. Subscription - Credit card icon
9. Notifications - Bell icon
10. Profile - User icon

### Header

#### Desktop Header
- Height: 64px
- Background: White
- Shadow: Small
- Logo (left)
- Navigation (center)
- User menu (right)

#### Mobile Header
- Height: 56px
- Hamburger menu (left)
- Title (center)
- User avatar (right)

### Content Area

#### Desktop
- Max Width: 1280px
- Padding: 24px
- Centered

#### Mobile
- Full width
- Padding: 16px

---

## 🎭 Animations & Transitions

### Page Transitions
- Fade in: 200ms
- Slide up: 300ms
- Scale: 200ms

### Hover Effects
- Scale: 1.02
- Shadow increase
- Color darken
- Duration: 200ms

### Loading Animations
- Spinner: Rotate 360deg, 1s infinite
- Shimmer: Slide right, 1.5s infinite
- Pulse: Scale 1.05, 1s infinite

### Modal Animations
- Fade in overlay: 200ms
- Scale up modal: 300ms
- Slide up on mobile: 300ms

### Button Animations
- Active: Scale 0.95
- Ripple effect on click
- Duration: 150ms

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations
- Stack columns vertically
- Full-width buttons
- Bottom sheet modals
- Swipe gestures
- Touch-friendly targets (min 44px)
- Simplified navigation

---

## 🔌 API Integration

### Base URL
```
http://127.0.0.1:8000/api/v1/
```

### Authentication
- JWT tokens
- Stored in secure storage
- Sent in Authorization header: `Bearer {token}`

### API Endpoints

#### Auth
- POST `/accounts/login/` - Login
- POST `/accounts/register/` - Register
- POST `/accounts/logout/` - Logout
- GET `/accounts/profile/` - Get profile

#### Students (Admin)
- GET `/students/` - List students
- POST `/students/create/` - Create student
- POST `/students/bulk-upload/` - Bulk upload CSV
- GET `/students/{id}/` - Get student details
- PATCH `/students/{id}/` - Update student
- PATCH `/students/{id}/activate/` - Activate
- PATCH `/students/{id}/deactivate/` - Deactivate
- DELETE `/students/{id}/delete/` - Delete

#### Attendance
- GET `/attendance/` - List attendance
- POST `/attendance/mark/` - Mark attendance
- GET `/attendance/daily/` - Daily attendance
- GET `/attendance/monthly-summary/` - Monthly summary

#### Subscriptions
- GET `/subscriptions/` - List subscriptions
- POST `/subscriptions/create/` - Create subscription
- GET `/subscriptions/{id}/` - Get subscription
- PATCH `/subscriptions/{id}/payment/` - Update payment
- GET `/subscriptions/expiring/` - Expiring subscriptions

#### Notifications
- GET `/notifications/` - List notifications
- POST `/notifications/create/` - Create notification
- PATCH `/notifications/{id}/mark-read/` - Mark as read
- POST `/notifications/mark-all-read/` - Mark all as read

#### QR Codes
- GET `/students/qr-codes/` - List QR codes
- POST `/students/qr-codes/generate/` - Generate QR
- POST `/students/qr-codes/verify/` - Verify QR

#### Study Features (Student)
- GET `/students/study-sessions/` - List sessions
- POST `/students/study-sessions/` - Create session
- GET `/students/notes/` - List notes
- POST `/students/notes/` - Create note
- PATCH `/students/notes/{id}/` - Update note
- DELETE `/students/notes/{id}/` - Delete note
- GET `/students/tasks/` - List tasks
- POST `/students/tasks/` - Create task
- PATCH `/students/tasks/{id}/` - Update task
- DELETE `/students/tasks/{id}/` - Delete task
- GET `/students/goals/` - List goals
- POST `/students/goals/` - Create goal
- PATCH `/students/goals/{id}/` - Update goal
- GET `/students/quotes/random/` - Get random quote

#### Reports
- GET `/reports/dashboard/` - Dashboard stats
- GET `/reports/monthly-attendance/` - Monthly report
- GET `/reports/students/` - Student report

### Error Handling
- 400: Bad Request - Show error message
- 401: Unauthorized - Redirect to login
- 403: Forbidden - Show permission error
- 404: Not Found - Show not found message
- 500: Server Error - Show generic error

---

## 📦 Required Libraries/Packages

### Core
- React Native / Flutter / Native (choose framework)
- Navigation library
- State management (Redux/MobX/Context)

### UI Components
- Icon library (FontAwesome equivalent)
- Chart library (for graphs)
- Date picker
- Image picker
- File picker
- QR code scanner
- QR code generator

### Utilities
- HTTP client (Axios equivalent)
- Date formatting (date-fns equivalent)
- Form validation
- Secure storage (for tokens)
- Toast notifications

---

## 🎯 Key Features Summary

### Admin Features
1. Dashboard with analytics
2. Student management (CRUD + bulk upload)
3. Attendance tracking
4. Seat management
5. Subscription management
6. Notification system
7. QR code generation
8. Reports with CSV export

### Student Features
1. Personal dashboard
2. Study timer with sessions
3. Notes with categories
4. Task management
5. Goal tracking
6. QR attendance marking
7. Attendance history
8. Subscription status
9. Notifications
10. Profile management

---

## 🚀 Implementation Priority

### Phase 1 (MVP)
1. Authentication (Login/Register)
2. Admin Dashboard
3. Student Dashboard
4. Basic student management
5. Attendance marking
6. QR code scanning

### Phase 2
1. Study timer
2. Notes system
3. Task management
4. Subscription management
5. Notifications

### Phase 3
1. Goals tracking
2. Reports
3. Bulk operations
4. Advanced analytics
5. Profile customization

---

## 📝 Notes for Mobile Development

### Platform-Specific Considerations

#### iOS
- Use native navigation patterns
- Follow iOS Human Interface Guidelines
- Use SF Symbols for icons
- Implement haptic feedback
- Support Face ID/Touch ID

#### Android
- Use Material Design components
- Follow Android design guidelines
- Use Material icons
- Implement biometric authentication
- Support back button navigation

### Performance Optimization
- Lazy load images
- Implement pagination
- Cache API responses
- Optimize list rendering
- Minimize re-renders

### Offline Support
- Cache essential data
- Queue actions when offline
- Sync when online
- Show offline indicator

### Push Notifications
- Implement for new notifications
- Attendance reminders
- Subscription expiry alerts
- Study session reminders

---

## 🎨 Design Assets Needed

### Icons
- All FontAwesome icons used in web app
- Custom library logo
- Tab bar icons
- Action icons

### Images
- Placeholder avatars
- Empty state illustrations
- Onboarding screens
- Splash screen

### Colors
- Export complete color palette
- Define theme variants (light/dark)

---

This specification provides everything needed to build a mobile app that perfectly mirrors the web application. Follow the design system, component patterns, and API integration guidelines to ensure consistency across platforms.
