# 🔧 Render Deployment Troubleshooting

## ❌ Error: "No support for ''. We support: postgres..."

### Problem
```
ValueError: No support for ''. We support: cockroach, mssql, mysql, postgres...
```

This error means `DATABASE_URL` environment variable is either:
1. Not set on Render
2. Set but empty
3. Set with invalid format

### ✅ Solution

#### Step 1: Verify Database is Created
1. Go to Render Dashboard
2. Check if PostgreSQL database exists
3. If not, create it first:
   - Click "New +" → "PostgreSQL"
   - Name: `nova-library-db`
   - Click "Create Database"
   - Wait for it to be ready

#### Step 2: Get the Correct Database URL
1. Click on your PostgreSQL database
2. Scroll down to "Connections"
3. **IMPORTANT**: Copy the **Internal Database URL** (NOT External)
4. It should look like:
   ```
   postgresql://user:password@dpg-xxxxx-a/database_name
   ```

#### Step 3: Set DATABASE_URL in Web Service
1. Go to your Web Service (not database)
2. Click "Environment" tab
3. Add or update:
   ```
   DATABASE_URL=<paste-internal-database-url-here>
   ```
4. Click "Save Changes"
5. Service will auto-redeploy

#### Step 4: Verify Other Required Variables
Make sure these are also set:
```bash
SECRET_KEY=<your-generated-secret-key>
DEBUG=False
RENDER=True
USE_CLOUDINARY=True
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
```

---

## ❌ Error: Python Version Not Found

### Problem
```
Python version 3.14.3 not found
```

### ✅ Solution
The `runtime.txt` has been updated to use Python 3.11.7 (a stable version supported by Render).

If you still see this error:
1. Make sure `runtime.txt` contains: `python-3.11.7`
2. Push changes to GitHub
3. Trigger manual deploy on Render

---

## ❌ Error: Build Script Permission Denied

### Problem
```
Permission denied: ./build.sh
```

### ✅ Solution
```bash
chmod +x build.sh
git add build.sh
git commit -m "Fix build.sh permissions"
git push
```

---

## ❌ Error: Module Not Found

### Problem
```
ModuleNotFoundError: No module named 'xxx'
```

### ✅ Solution
1. Check if module is in `requirements.txt`
2. If missing, add it:
   ```bash
   pip freeze | grep module-name >> requirements.txt
   ```
3. Push to GitHub
4. Redeploy

---

## ❌ Error: Static Files Not Found

### Problem
Static files (CSS/JS) return 404

### ✅ Solution
1. Verify `build.sh` runs `collectstatic`:
   ```bash
   python manage.py collectstatic --no-input
   ```
2. Check `STATIC_ROOT` in settings.py:
   ```python
   STATIC_ROOT = BASE_DIR / 'staticfiles'
   ```
3. Verify WhiteNoise is in MIDDLEWARE (should be second):
   ```python
   MIDDLEWARE = [
       'django.middleware.security.SecurityMiddleware',
       'whitenoise.middleware.WhiteNoiseMiddleware',  # Must be here
       ...
   ]
   ```

---

## ❌ Error: CORS Policy Blocked

### Problem
```
Access to XMLHttpRequest blocked by CORS policy
```

### ✅ Solution
1. Add your frontend URL to environment variables:
   ```bash
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-domain.com
   ```
2. Or update settings.py to include your domain
3. Redeploy

---

## ❌ Error: Cloudinary Upload Failed

### Problem
Images fail to upload

### ✅ Solution
1. Verify Cloudinary credentials are correct
2. Check environment variables:
   ```bash
   USE_CLOUDINARY=True
   CLOUDINARY_CLOUD_NAME=<correct-name>
   CLOUDINARY_API_KEY=<correct-key>
   CLOUDINARY_API_SECRET=<correct-secret>
   ```
3. Test credentials at https://cloudinary.com/console

---

## ❌ Error: Migration Failed

### Problem
```
django.db.utils.OperationalError: could not connect to server
```

### ✅ Solution
1. Verify `DATABASE_URL` is set correctly
2. Use **Internal Database URL** (not External)
3. Ensure database and web service are in same region
4. Check database is running (green status)

---

## 🔍 Debugging Tips

### View Logs
1. Go to your Web Service
2. Click "Logs" tab
3. Look for error messages
4. Filter by "Error" or "Warning"

### Check Environment Variables
1. Go to "Environment" tab
2. Verify all required variables are set
3. Check for typos
4. Ensure no extra spaces

### Test Database Connection
In Render Shell:
```bash
python manage.py dbshell
```
If this fails, database connection is the issue.

### Test Locally First
Before deploying:
```bash
# Set environment variables
export DATABASE_URL="postgresql://..."
export DEBUG=False

# Run build script
./build.sh

# Test server
python manage.py runserver
```

---

## 📋 Pre-Deployment Checklist

Before each deploy, verify:

- [ ] All environment variables are set
- [ ] `DATABASE_URL` is the Internal URL
- [ ] `SECRET_KEY` is set and secure
- [ ] `DEBUG=False` for production
- [ ] Cloudinary credentials are correct
- [ ] `runtime.txt` has valid Python version
- [ ] `build.sh` is executable
- [ ] Code is pushed to GitHub
- [ ] Database is running (green status)

---

## 🆘 Still Having Issues?

### Check Render Status
https://status.render.com - Check if Render has any outages

### Review Render Docs
https://render.com/docs/troubleshooting-deploys

### Common Solutions
1. **Clear build cache**: Manual Deploy → "Clear build cache & deploy"
2. **Restart service**: Settings → "Suspend" then "Resume"
3. **Check region**: Database and web service should be in same region
4. **Verify plan**: Free tier has limitations

### Get Help
1. Render Community: https://community.render.com
2. Django Forum: https://forum.djangoproject.com
3. Check deployment guides in this repo

---

## 📝 Quick Fixes Reference

| Error | Quick Fix |
|-------|-----------|
| Empty DATABASE_URL | Set Internal Database URL in Environment |
| Python version error | Use `python-3.11.7` in runtime.txt |
| Permission denied | `chmod +x build.sh` |
| Module not found | Add to requirements.txt |
| CORS error | Add frontend URL to CORS_ALLOWED_ORIGINS |
| Static files 404 | Check WhiteNoise middleware position |
| Migration failed | Verify DATABASE_URL and database status |
| Cloudinary error | Check credentials in environment variables |

---

**Last Updated**: February 16, 2026
**Status**: Ready to troubleshoot common deployment issues
