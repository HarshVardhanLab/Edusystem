# Library Management System

A comprehensive library management system with Django backend, React web frontend, and Flutter mobile app.

## Features

### For Library Owners (Admin)
- Dashboard with analytics and statistics
- Student management (add, edit, view profiles)
- Seat management and allocation
- Attendance tracking
- Subscription management
- QR code generation for attendance
- Reports and financial analytics
- Notifications system

### For Students
- Personal dashboard
- QR code attendance marking
- Study timer with session tracking
- Notes management
- Study goals tracking
- Task management
- Attendance history
- Subscription details
- Profile management

## Tech Stack

### Backend
- Django 5.0.1
- Django REST Framework
- PostgreSQL (Supabase compatible)
- JWT Authentication
- Celery for background tasks

### Web Frontend
- React 18
- Vite
- TailwindCSS
- React Router

### Mobile App
- Flutter
- Riverpod for state management
- QR code scanner
- Camera integration

## Quick Start

### Backend Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Start server:
```bash
python manage.py runserver
```

### Web Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend-web
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with API URL
```

4. Start development server:
```bash
npm run dev
```

### Flutter App Setup

1. Navigate to Flutter directory:
```bash
cd flutter_app
```

2. Install dependencies:
```bash
flutter pub get
```

3. Update API constants in `lib/core/constants/api_constants.dart`

4. Run the app:
```bash
flutter run
```

## Database Configuration

### Using Supabase (Recommended for Production)

1. Create a project on [Supabase](https://supabase.com)
2. Get your database credentials from Project Settings → Database
3. Update `.env` file:
```env
DB_NAME=postgres
DB_USER=postgres.your-project-ref
DB_PASSWORD=your-password
DB_HOST=aws-0-region.pooler.supabase.com
DB_PORT=6543
```

### Using Local PostgreSQL

1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE library_db;
```
3. Update `.env` with local credentials

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/swagger/`
- ReDoc: `http://localhost:8000/redoc/`

## Default Credentials

### Library Owner
- Library ID: `LIB000001`
- Email: `testowner@library.com`
- Password: `SecurePass123`

### Student
- Library ID: `LIB000001`
- Student ID: `STU000001-0001`
- Password: `3210`

## Project Structure

```
.
├── apps/                    # Django apps
│   ├── accounts/           # User authentication
│   ├── attendance/         # Attendance tracking
│   ├── libraries/          # Library management
│   ├── notifications/      # Notifications system
│   ├── reports/            # Reports and analytics
│   ├── seats/              # Seat management
│   ├── students/           # Student management
│   └── subscriptions/      # Subscription management
├── frontend-web/           # React web application
├── flutter_app/            # Flutter mobile application
├── library_backend/        # Django project settings
└── media/                  # Uploaded files
```

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,10.0.2.2

DB_NAME=library_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api/v1
```

## Mobile App Configuration

For Android emulator, the API base URL should be:
```dart
static const String baseUrl = 'http://10.0.2.2:8000/api/v1';
```

For iOS simulator:
```dart
static const String baseUrl = 'http://127.0.0.1:8000/api/v1';
```

For physical devices, use your computer's IP address.

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.
