# Troubleshooting Guide

Common issues and solutions for the Library Management System.

## Backend Issues

### Issue: Port 8000 Already in Use

**Error**: `Error: That port is already in use.`

**Solution**:
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use different port
python manage.py runserver 8001
```

### Issue: Database Connection Failed

**Error**: `django.db.utils.OperationalError: could not connect to server`

**Solution**:
1. Check PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Ubuntu
   sudo systemctl status postgresql
   ```

2. Verify database credentials in `.env`
3. Test connection:
   ```bash
   psql -U library_user -d library_db
   ```

### Issue: Migration Errors

**Error**: `django.db.migrations.exceptions.InconsistentMigrationHistory`

**Solution**:
```bash
# Reset migrations (CAUTION: deletes data)
python manage.py migrate --fake <app_name> zero
python manage.py migrate <app_name>

# Or reset entire database
python manage.py flush
python manage.py migrate
```

### Issue: CORS Errors

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
Check `library_backend/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### Issue: JWT Token Expired

**Error**: `Token is invalid or expired`

**Solution**:
1. Logout and login again
2. Clear browser localStorage
3. Check token expiry settings in `settings.py`

## Frontend Issues

### Issue: Port 5173 Already in Use

**Error**: `Port 5173 is in use`

**Solution**:
```bash
# Kill process on port 5173
lsof -i :5173
kill -9 <PID>

# Or use different port
npm run dev -- --port 5174
```

### Issue: Module Not Found

**Error**: `Cannot find module 'react-router-dom'`

**Solution**:
```bash
cd frontend-web
rm -rf node_modules package-lock.json
npm install
```

### Issue: Blank Page After Login

**Symptoms**: Page loads but shows nothing

**Solution**:
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify API is running
4. Check network tab for failed requests
5. Clear browser cache and localStorage

### Issue: API Calls Failing

**Error**: `Network Error` or `Failed to fetch`

**Solution**:
1. Verify backend is running on port 8000
2. Check `.env` file has correct API URL
3. Check browser console for CORS errors
4. Test API directly: `curl http://127.0.0.1:8000/api/v1/reports/dashboard/`

### Issue: Login Not Working

**Symptoms**: Login button does nothing or shows error

**Solution**:
1. Check browser console for errors
2. Verify credentials: testowner@library.com / SecurePass123
3. Check backend logs for errors
4. Verify CORS settings
5. Clear localStorage: `localStorage.clear()`

## Common Errors

### Issue: "No such table" Error

**Error**: `django.db.utils.OperationalError: no such table`

**Solution**:
```bash
python manage.py migrate
```

### Issue: Static Files Not Loading

**Error**: 404 errors for CSS/JS files

**Solution**:
```bash
python manage.py collectstatic
```

### Issue: File Upload Fails

**Error**: `413 Request Entity Too Large`

**Solution**:
Check `settings.py`:
```python
DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB
```

### Issue: Slow API Responses

**Symptoms**: Pages take long to load

**Solution**:
1. Check database queries (use Django Debug Toolbar)
2. Add database indexes
3. Enable query caching
4. Optimize serializers

## Development Issues

### Issue: Hot Reload Not Working

**Symptoms**: Changes not reflecting in browser

**Solution**:
1. Check Vite is running
2. Hard refresh browser (Ctrl+Shift+R)
3. Restart Vite dev server
4. Check file watchers limit (Linux):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

### Issue: ESLint Errors

**Error**: Linting errors in console

**Solution**:
```bash
cd frontend-web
npm run lint -- --fix
```

## Database Issues

### Issue: Database Locked

**Error**: `database is locked`

**Solution**:
1. Close all database connections
2. Restart Django server
3. Use PostgreSQL instead of SQLite

### Issue: Too Many Connections

**Error**: `too many connections`

**Solution**:
Check `settings.py`:
```python
DATABASES = {
    'default': {
        ...
        'CONN_MAX_AGE': 600,
    }
}
```

## Performance Issues

### Issue: Slow Page Load

**Solution**:
1. Enable browser caching
2. Optimize images
3. Use pagination for large datasets
4. Enable database query caching
5. Use CDN for static files

### Issue: High Memory Usage

**Solution**:
1. Limit queryset size
2. Use `select_related()` and `prefetch_related()`
3. Implement pagination
4. Clear unused sessions

## Getting Help

If you're still experiencing issues:

1. Check browser console (F12)
2. Check backend logs
3. Check network tab in DevTools
4. Review API documentation (API.md)
5. Check Django logs: `logs/django.log`

## Useful Commands

```bash
# Backend
python manage.py check          # Check for issues
python manage.py showmigrations # Show migration status
python manage.py shell          # Django shell
python manage.py dbshell        # Database shell

# Frontend
npm run build                   # Build for production
npm run preview                 # Preview production build
npm run lint                    # Check code quality

# Database
python manage.py dumpdata > backup.json  # Backup data
python manage.py loaddata backup.json    # Restore data
```

## Reset Everything

If all else fails:

```bash
# Backend
python manage.py flush
python manage.py migrate
python manage.py createsuperuser

# Frontend
cd frontend-web
rm -rf node_modules package-lock.json
npm install
npm run dev
```
