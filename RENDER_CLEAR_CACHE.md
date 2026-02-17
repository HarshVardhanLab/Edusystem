# 🔄 Clear Render Build Cache

## Problem
Render is still using Python 3.14 even though runtime.txt specifies Python 3.11.0

## Solution: Clear Build Cache

### Step 1: Push Changes to GitHub (if not done)
```bash
git add .
git commit -m "Add setuptools and fix Python version"
git push origin main
```

### Step 2: Clear Build Cache on Render

1. Go to your **Web Service** on Render Dashboard
2. Click on **"Manual Deploy"** dropdown (top right)
3. Select **"Clear build cache & deploy"**
4. Wait for the new build to start

This will:
- Delete the old Python 3.14 environment
- Use Python 3.11.0 from runtime.txt
- Install setuptools from requirements.txt
- Fix the pkg_resources error

### Alternative: If Clear Cache Doesn't Work

If clearing cache doesn't help, try this:

1. Go to your Web Service → **Settings**
2. Scroll down to **"Build Command"**
3. Temporarily change it to:
   ```bash
   pip install --upgrade pip setuptools && ./build.sh
   ```
4. Save and redeploy
5. After successful deploy, you can change it back to just `./build.sh`

---

## Why This Happens

Render caches the Python environment between builds. When you change runtime.txt, the cache needs to be cleared for the new Python version to be used.

---

## Expected Result

After clearing cache, you should see in the build logs:
```
Using Python version 3.11.0 (from runtime.txt)
Installing setuptools...
✓ Successfully installed setuptools
```

---

**Status**: Ready to clear cache and redeploy
