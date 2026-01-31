# Setup Guide

Complete setup instructions for the Library Management System.

## Prerequisites

- Python 3.9 or higher
- Node.js 16 or higher
- PostgreSQL 12 or higher
- Git

## Backend Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd library-management
```

### 2. Create Virtual Environment

```bash
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Database

Create a PostgreSQL database:

```sql
CREATE DATABASE library_db;
CREATE USER library_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE library_db TO library_user;
```

### 5. Environment Variables

Create `.env` file in project root:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_NAME=library_db
DATABASE_USER=library_user
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 6. Run Migrations

```bash
python manage.py migrate
```

### 7. Create Test User

```bash
python manage.py shell
```

```python
from apps.accounts.models import User
user = User.objects.create_user(
    email='testowner@library.com',
    password='SecurePass123',
    first_name='Test',
    last_name='Owner',
    role='LIBRARY_OWNER'
)
```

### 8. Start Backend Server

```bash
python manage.py runserver
```

Backend will run on: **http://127.0.0.1:8000**

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env` file in `frontend-web/`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 4. Start Frontend Server

```bash
npm run dev
```

Frontend will run on: **http://localhost:5173**

## Verify Installation

### 1. Check Backend

Visit: http://127.0.0.1:8000/admin/
- Django admin should load

Visit: http://127.0.0.1:8000/swagger/
- API documentation should load

### 2. Check Frontend

Visit: http://localhost:5173
- Login page should load

### 3. Test Login

- Email: testowner@library.com
- Password: SecurePass123

Should redirect to admin dashboard.

## Optional: Setup Celery (Background Tasks)

### 1. Install Redis

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu
sudo apt-get install redis-server
sudo systemctl start redis
```

### 2. Start Celery Worker

```bash
celery -A library_backend worker -l info
```

### 3. Start Celery Beat (Scheduler)

```bash
celery -A library_backend beat -l info
```

## Development Tools

### Django Admin

- URL: http://127.0.0.1:8000/admin/
- Create superuser: `python manage.py createsuperuser`

### API Documentation

- Swagger: http://127.0.0.1:8000/swagger/
- ReDoc: http://127.0.0.1:8000/redoc/

### Database Management

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Reset database
python manage.py flush
```

### Frontend Development

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Production Deployment

### Backend

1. Set `DEBUG=False` in `.env`
2. Configure proper `SECRET_KEY`
3. Set `ALLOWED_HOSTS`
4. Use production database
5. Collect static files: `python manage.py collectstatic`
6. Use gunicorn: `gunicorn library_backend.wsgi:application`

### Frontend

1. Build: `npm run build`
2. Deploy `dist/` folder to web server
3. Configure environment variables
4. Set up reverse proxy (nginx)

## Next Steps

1. Create library profile
2. Add students
3. Create seats
4. Mark attendance
5. Create subscriptions

See **README.md** for feature overview.
