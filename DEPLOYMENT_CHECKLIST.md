# ✅ Deployment Checklist - Nova Library Management System

## Pre-Deployment

### Code Preparation
- [x] `runtime.txt` created (Python 3.11.9)
- [x] `Procfile` created (gunicorn configuration)
- [x] `build.sh` updated with proper commands
- [x] `requirements.txt` includes all dependencies
- [x] `.env.example` updated with production variables
- [x] `.gitignore` configured (don't commit .env)
- [x] Settings.py updated for production:
  - [x] DATABASE_URL support added
  - [x] RENDER environment detection
  - [x] WhiteNoise middleware configured
  - [x] Security settings for production
  - [x] CORS configuration with environment variables
  - [x] Static files configuration

### External Services Setup
- [ ] **Cloudinary Account**
  - [ ] Sign up at https://cloudinary.com
  - [ ] Get Cloud Name
  - [ ] Get API Key
  - [ ] Get API Secret
  - [ ] Test upload functionality

- [ ] **GitHub Repository**
  - [ ] Code pushed to GitHub
  - [ ] Repository is public or Render has access
  - [ ] All deployment files committed

---

## Render Setup

### 1. Database Creation
- [ ] PostgreSQL database created on Render
- [ ] Database name: `library_db` (or your choice)
- [ ] Internal Database URL copied
- [ ] Database region selected (same as web service)

### 2. Web Service Creation
- [ ] Web service created
- [ ] GitHub repository connected
- [ ] Build command: `./build.sh`
- [ ] Start command: `gunicorn library_backend.wsgi:application`
- [ ] Python 3 runtime selected
- [ ] Region matches database

### 3. Environment Variables Set
- [ ] `SECRET_KEY` - Generated and set
- [ ] `DEBUG` - Set to `False`
- [ ] `DATABASE_URL` - Pasted from database
- [ ] `RENDER` - Set to `True`
- [ ] `USE_CLOUDINARY` - Set to `True`
- [ ] `CLOUDINARY_CLOUD_NAME` - From Cloudinary
- [ ] `CLOUDINARY_API_KEY` - From Cloudinary
- [ ] `CLOUDINARY_API_SECRET` - From Cloudinary
- [ ] `ALLOWED_HOSTS` - Your Render domain
- [ ] `CORS_ALLOWED_ORIGINS` - Frontend URLs (optional)

---

## Deployment

### Initial Deploy
- [ ] Click "Create Web Service"
- [ ] Monitor build logs
- [ ] Wait for "Your service is live 🎉"
- [ ] Note your service URL: `https://______.onrender.com`

### Post-Deploy Verification
- [ ] Service is running (green status)
- [ ] No errors in logs
- [ ] API root accessible: `/api/v1/`
- [ ] Admin panel accessible: `/admin/`

---

## Database Setup

### Create Superuser
- [ ] Open Render Shell
- [ ] Run: `python manage.py createsuperuser`
- [ ] Enter username, email, password
- [ ] Verify login at `/admin/`

### Load Initial Data (Optional)
- [ ] Create test library via admin or API
- [ ] Create test students
- [ ] Create test seats
- [ ] Verify data appears correctly

---

## Testing

### API Endpoints
- [ ] **Login** - POST `/api/v1/accounts/login/`
  ```bash
  curl -X POST https://your-app.onrender.com/api/v1/accounts/login/ \
    -H "Content-Type: application/json" \
    -d '{"user_type":"library","library_id":"LIB1020","email":"admin@novalibrary.com","password":"Admin@123"}'
  ```

- [ ] **Get Students** - GET `/api/v1/students/`
- [ ] **Get Attendance** - GET `/api/v1/attendance/`
- [ ] **Get Seats** - GET `/api/v1/seats/`
- [ ] **Get Subscriptions** - GET `/api/v1/subscriptions/`

### Image Upload
- [ ] Upload student photo
- [ ] Upload ID proof
- [ ] Verify images appear in Cloudinary dashboard
- [ ] Verify image URLs work

### CORS
- [ ] Test API from frontend domain
- [ ] No CORS errors in browser console
- [ ] Credentials working if needed

---

## Frontend Integration

### Update API URLs

#### Flutter App
- [ ] Edit `flutter_app/lib/core/constants/api_constants.dart`
  ```dart
  static const String baseUrl = 'https://your-app.onrender.com/api/v1';
  ```
- [ ] Rebuild app
- [ ] Test login
- [ ] Test all features

#### Web Frontend
- [ ] Update API base URL in config
- [ ] Update CORS settings if needed
- [ ] Test login
- [ ] Test all features

---

## Production Optimization

### Performance
- [ ] Enable database connection pooling
- [ ] Configure gunicorn workers (default is fine)
- [ ] Monitor response times
- [ ] Check for N+1 queries

### Security
- [ ] `DEBUG=False` confirmed
- [ ] Strong `SECRET_KEY` set
- [ ] HTTPS enabled (automatic on Render)
- [ ] CORS properly configured
- [ ] Security headers enabled
- [ ] Admin panel secured

### Monitoring
- [ ] Check Render logs regularly
- [ ] Set up error notifications (optional)
- [ ] Monitor database usage
- [ ] Monitor API response times

---

## Backup & Recovery

### Database Backups
- [ ] Enable automatic backups (paid plan)
- [ ] Or set up manual backup schedule
- [ ] Test restore procedure

### Code Backups
- [ ] Code in GitHub (automatic)
- [ ] Environment variables documented
- [ ] Deployment process documented

---

## Documentation

### For Team
- [ ] Share Render dashboard access
- [ ] Document environment variables
- [ ] Share API documentation
- [ ] Share deployment process

### For Users
- [ ] Update API documentation
- [ ] Share new API base URL
- [ ] Update mobile app if needed
- [ ] Communicate any downtime

---

## Common Issues & Solutions

### Build Fails
**Issue**: Build script errors
**Solution**: 
- Check `build.sh` has execute permissions: `chmod +x build.sh`
- Verify all dependencies in `requirements.txt`
- Check Python version in `runtime.txt`

### Database Connection Fails
**Issue**: Can't connect to database
**Solution**:
- Use Internal Database URL (not External)
- Verify DATABASE_URL is set correctly
- Check database and web service in same region

### Static Files Not Loading
**Issue**: CSS/JS not loading
**Solution**:
- Verify `collectstatic` ran in build logs
- Check WhiteNoise middleware position
- Verify `STATIC_ROOT` and `STATIC_URL` settings

### CORS Errors
**Issue**: Frontend can't access API
**Solution**:
- Add frontend URL to `CORS_ALLOWED_ORIGINS`
- Include protocol (https://)
- No trailing slashes
- Restart service after changes

### Images Not Uploading
**Issue**: Image upload fails
**Solution**:
- Verify Cloudinary credentials
- Check `USE_CLOUDINARY=True`
- Test Cloudinary connection
- Check file size limits

---

## Maintenance Schedule

### Daily
- [ ] Check service status
- [ ] Monitor error logs
- [ ] Check API response times

### Weekly
- [ ] Review database usage
- [ ] Check for security updates
- [ ] Review error patterns

### Monthly
- [ ] Database backup verification
- [ ] Performance optimization review
- [ ] Cost analysis
- [ ] Update dependencies if needed

---

## Rollback Plan

If deployment fails:

1. **Immediate**: Revert to previous deployment
   - Render → Manual Deploy → Deploy previous commit

2. **Database**: Restore from backup if needed
   - Render → Database → Backups → Restore

3. **Code**: Revert Git commit
   ```bash
   git revert HEAD
   git push
   ```

---

## Success Criteria

Deployment is successful when:

- ✅ Service is running without errors
- ✅ Database is connected and migrations applied
- ✅ API endpoints respond correctly
- ✅ Authentication works
- ✅ Image uploads work (Cloudinary)
- ✅ Frontend can connect to API
- ✅ No CORS errors
- ✅ Admin panel accessible
- ✅ All features tested and working

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Django Deployment**: https://docs.djangoproject.com/en/5.0/howto/deployment/
- **Render Community**: https://community.render.com
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

## Deployment Info

- **Date**: _____________
- **Deployed By**: _____________
- **Backend URL**: https://_____________.onrender.com
- **Database**: _____________
- **Status**: ⬜ Pending | ⬜ In Progress | ⬜ Complete | ⬜ Failed

---

**Ready to deploy? Follow the steps in `RENDER_QUICK_START.md` or `RENDER_DEPLOYMENT_GUIDE.md`**
