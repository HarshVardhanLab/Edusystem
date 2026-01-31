# Library Management System

Complete full-stack library management system with Django REST Framework backend and React frontend.

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL

### 1. Backend Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start backend server
python manage.py runserver
```

Backend runs on: **http://127.0.0.1:8000**

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend-web

# Install dependencies
npm install

# Start frontend server
npm run dev
```

Frontend runs on: **http://localhost:5173**

### 3. Login

- **URL**: http://localhost:5173
- **Email**: testowner@library.com
- **Password**: SecurePass123

## 📁 Project Structure

```
library-management/
├── apps/                      # Django apps
│   ├── accounts/             # User authentication
│   ├── libraries/            # Library management
│   ├── students/             # Student management
│   ├── seats/                # Seat management
│   ├── attendance/           # Attendance tracking
│   ├── subscriptions/        # Subscription management
│   ├── notifications/        # Notifications
│   └── reports/              # Reports & analytics
├── library_backend/          # Django settings
├── frontend-web/             # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── utils/            # Utilities
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

## 🎯 Features

### Admin (Library Owner)
- Dashboard with real-time statistics
- Student management (CRUD)
- Seat management (create, assign, free)
- Attendance marking
- Subscription management
- Notifications
- Reports generation
- Library profile management

### Student Portal
- View attendance history
- Check subscription status
- View notifications
- Profile management

## 🛠️ Tech Stack

### Backend
- Django 5.0.1
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Celery (background tasks)

### Frontend
- React 18
- Vite
- React Router v6
- Tailwind CSS
- Axios
- react-hot-toast

## 📚 Documentation

- **API.md** - Complete API documentation
- **SETUP.md** - Detailed setup instructions
- **TROUBLESHOOTING.md** - Common issues and solutions

## 🔐 Default Credentials

**Library Owner**
- Email: testowner@library.com
- Password: SecurePass123

## 📝 License

MIT License
