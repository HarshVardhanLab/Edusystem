# 🚀 Render Quick Start - 5 Minutes

## 1. Create Database (2 min)

1. Go to https://dashboard.render.com
2. **New +** → **PostgreSQL**
3. Name: `nova-library-db`
4. Click **Create Database**
5. **Copy Internal Database URL** ⚠️

---

## 2. Create Web Service (3 min)

1. **New +** → **Web Service**
2. Connect GitHub repo
3. Settings:
   - Name: `nova-library-backend`
   - Build Command: `./build.sh`
   - Start Command: `gunicorn library_backend.wsgi:application`

---

## 3. Environment Variables

Add these in **Environment** tab:

```bash
SECRET_KEY=<generate-random-key>
DEBUG=False
DATABASE_URL=<paste-from-step-1>
RENDER=True
USE_CLOUDINARY=True
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
```

**Generate SECRET_KEY**: https://djecrety.ir/

---

## 4. Deploy

Click **Create Web Service** → Wait for deployment

---

## 5. Test

Visit: `https://your-app.onrender.com/api/v1/`

---

## Environment Variables Checklist

### Required ✅
- [ ] `SECRET_KEY` - Random string (50+ chars)
- [ ] `DEBUG` - Set to `False`
- [ ] `DATABASE_URL` - From Render PostgreSQL
- [ ] `RENDER` - Set to `True`
- [ ] `USE_CLOUDINARY` - Set to `True`
- [ ] `CLOUDINARY_CLOUD_NAME` - From Cloudinary dashboard
- [ ] `CLOUDINARY_API_KEY` - From Cloudinary dashboard
- [ ] `CLOUDINARY_API_SECRET` - From Cloudinary dashboard

### Optional
- [ ] `ALLOWED_HOSTS` - Your custom domain (if any)
- [ ] `CORS_ALLOWED_ORIGINS` - Frontend URLs (comma-separated)
- [ ] `EMAIL_HOST_USER` - For sending emails
- [ ] `EMAIL_HOST_PASSWORD` - Email password

---

## After Deployment

### Create Superuser
1. Go to service → **Shell** tab
2. Run: `python manage.py createsuperuser`

### Update Frontend
Change API URL to: `https://your-app.onrender.com/api/v1`

---

## Troubleshooting

**Build fails?**
- Check `build.sh` has execute permissions
- Verify `requirements.txt` is complete

**Database errors?**
- Use **Internal Database URL** (not External)
- Check DATABASE_URL is set

**CORS errors?**
- Add frontend URL to `CORS_ALLOWED_ORIGINS`

---

**Need help?** See `RENDER_DEPLOYMENT_GUIDE.md` for detailed instructions.
