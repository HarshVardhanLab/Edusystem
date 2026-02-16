# 🚀 Render Deployment Guide - Nova Library Management System

## Prerequisites

- GitHub account with your code pushed to a repository
- Render account (sign up at https://render.com)
- Cloudinary account for image storage (sign up at https://cloudinary.com)

---

## Step 1: Prepare Your Repository

### 1.1 Ensure all deployment files are in place

✅ Files created:
- `runtime.txt` - Specifies Python version
- `Procfile` - Tells Render how to run the app
- `build.sh` - Build script for deployment
- `requirements.txt` - Python dependencies
- `.env.example` - Environment variables template

### 1.2 Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## Step 2: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `nova-library-db` (or your preferred name)
   - **Database**: `library_db`
   - **User**: (auto-generated)
   - **Region**: Choose closest to your users
   - **Plan**: Free (or paid for production)
4. Click **"Create Database"**
5. Wait for database to be created
6. **IMPORTANT**: Copy the **Internal Database URL** (starts with `postgresql://`)

---

## Step 3: Create Web Service on Render

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

### Basic Settings
- **Name**: `nova-library-backend` (or your preferred name)
- **Region**: Same as database
- **Branch**: `main`
- **Root Directory**: Leave empty (or specify if backend is in subdirectory)
- **Runtime**: `Python 3`
- **Build Command**: `./build.sh`
- **Start Command**: `gunicorn library_backend.wsgi:application`

### Instance Type
- **Free** (for testing) or **Starter** (for production)

---

## Step 4: Configure Environment Variables

Click **"Environment"** tab and add these variables:

### Required Variables

```bash
# Django Core
SECRET_KEY=<generate-a-strong-random-key>
DEBUG=False
ALLOWED_HOSTS=<your-render-domain>.onrender.com
RENDER=True

# Database (from Step 2)
DATABASE_URL=<paste-internal-database-url-from-step-2>

# Cloudinary (from your Cloudinary dashboard)
USE_CLOUDINARY=True
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

# CORS (add your frontend URLs)
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-domain.com
```

### How to Generate SECRET_KEY

Run this in Python:
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

Or use this online: https://djecrety.ir/

### Optional Variables

```bash
# Email (if you want to send emails)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Redis (if using Celery for background tasks)
REDIS_URL=redis://your-redis-url
```

---

## Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies from `requirements.txt`
   - Run `build.sh` (collectstatic + migrations)
   - Start the application with gunicorn

3. Monitor the deployment logs
4. Wait for "Your service is live 🎉"

---

## Step 6: Verify Deployment

### 6.1 Check API Health

Visit: `https://your-app.onrender.com/api/v1/`

You should see the API root or a JSON response.

### 6.2 Test Login Endpoint

```bash
curl -X POST https://your-app.onrender.com/api/v1/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_type": "library",
    "library_id": "LIB1020",
    "email": "admin@novalibrary.com",
    "password": "Admin@123"
  }'
```

### 6.3 Access Admin Panel

Visit: `https://your-app.onrender.com/admin/`

---

## Step 7: Create Superuser (First Time Only)

1. Go to your Render dashboard
2. Click on your web service
3. Click **"Shell"** tab
4. Run:

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

---

## Step 8: Load Initial Data (Optional)

If you want to load test data:

```bash
# In Render Shell
python manage.py shell

# Then run your setup script
exec(open('setup_test_data.py').read())
```

---

## Step 9: Update Frontend Configuration

Update your frontend API URLs to point to Render:

### Flutter App
Edit `flutter_app/lib/core/constants/api_constants.dart`:

```dart
class ApiConstants {
  static const String baseUrl = 'https://your-app.onrender.com/api/v1';
}
```

### Web Frontend
Edit `frontend-web/src/services/authService.js` or config file:

```javascript
const API_BASE_URL = 'https://your-app.onrender.com/api/v1';
```

---

## Important Notes

### Free Tier Limitations

⚠️ **Render Free Tier**:
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free (enough for one service)

**Solution**: Upgrade to Starter plan ($7/month) for always-on service.

### Database Backups

Free PostgreSQL databases are deleted after 90 days. For production:
- Upgrade to paid plan
- Enable automatic backups
- Or use external database (e.g., Supabase, Neon)

### Static Files

WhiteNoise is configured to serve static files efficiently. No additional CDN needed for small apps.

### Media Files

Using Cloudinary for media storage (images, documents). Make sure to:
- Set `USE_CLOUDINARY=True`
- Provide valid Cloudinary credentials

---

## Troubleshooting

### Build Fails

**Check logs for errors:**
- Missing dependencies → Update `requirements.txt`
- Python version mismatch → Check `runtime.txt`
- Build script errors → Check `build.sh` permissions

**Fix build.sh permissions:**
```bash
chmod +x build.sh
git add build.sh
git commit -m "Fix build.sh permissions"
git push
```

### Database Connection Errors

- Verify `DATABASE_URL` is set correctly
- Use **Internal Database URL** (not External)
- Check database is in same region as web service

### CORS Errors

- Add your frontend URL to `CORS_ALLOWED_ORIGINS`
- Include protocol (https://)
- No trailing slashes

### Static Files Not Loading

- Check `STATIC_ROOT` and `STATIC_URL` in settings
- Verify `collectstatic` ran successfully in build logs
- WhiteNoise middleware is in correct position

### 502 Bad Gateway

- Check application logs for errors
- Verify gunicorn is starting correctly
- Check `Procfile` syntax

---

## Monitoring & Maintenance

### View Logs

1. Go to Render dashboard
2. Click your service
3. Click **"Logs"** tab
4. Monitor real-time logs

### Restart Service

1. Go to service settings
2. Click **"Manual Deploy"** → **"Clear build cache & deploy"**

### Update Environment Variables

1. Go to **"Environment"** tab
2. Add/edit variables
3. Service auto-restarts

---

## Production Checklist

Before going live:

- [ ] Set `DEBUG=False`
- [ ] Use strong `SECRET_KEY`
- [ ] Configure proper `ALLOWED_HOSTS`
- [ ] Set up Cloudinary for media files
- [ ] Configure CORS for your frontend domains
- [ ] Enable HTTPS (automatic on Render)
- [ ] Set up database backups
- [ ] Configure email settings
- [ ] Test all API endpoints
- [ ] Load production data
- [ ] Set up monitoring/alerts
- [ ] Document API for frontend team
- [ ] Update frontend API URLs

---

## Useful Commands

### Run Migrations
```bash
# In Render Shell
python manage.py migrate
```

### Create Superuser
```bash
python manage.py createsuperuser
```

### Collect Static Files
```bash
python manage.py collectstatic --no-input
```

### Django Shell
```bash
python manage.py shell
```

### Check Deployment
```bash
python manage.py check --deploy
```

---

## Cost Estimate

### Free Tier (Testing)
- Web Service: Free (750 hours/month)
- PostgreSQL: Free (90 days, then deleted)
- **Total**: $0/month

### Production (Recommended)
- Web Service Starter: $7/month
- PostgreSQL Starter: $7/month
- **Total**: $14/month

### Alternative: External Database
- Web Service Starter: $7/month
- Supabase/Neon Free Tier: $0
- **Total**: $7/month

---

## Support

- **Render Docs**: https://render.com/docs
- **Django Deployment**: https://docs.djangoproject.com/en/5.0/howto/deployment/
- **Render Community**: https://community.render.com

---

## Next Steps

1. ✅ Deploy backend to Render
2. Deploy frontend to Vercel/Netlify
3. Update mobile app API URLs
4. Test end-to-end functionality
5. Set up custom domain (optional)
6. Configure monitoring and alerts

---

**Deployment Date**: February 16, 2026
**Backend URL**: `https://your-app.onrender.com`
**Status**: Ready for deployment 🚀
