#!/usr/bin/env python3
"""
Deployment Readiness Checker
Verifies that all necessary files and configurations are in place for Render deployment.
"""

import os
import sys
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists."""
    if Path(filepath).exists():
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description} MISSING: {filepath}")
        return False

def check_file_content(filepath, required_strings, description):
    """Check if file contains required strings."""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            missing = []
            for req in required_strings:
                if req not in content:
                    missing.append(req)
            
            if not missing:
                print(f"✅ {description}: All required content present")
                return True
            else:
                print(f"⚠️  {description}: Missing content: {', '.join(missing)}")
                return False
    except FileNotFoundError:
        print(f"❌ {description}: File not found - {filepath}")
        return False

def main():
    print("=" * 60)
    print("🔍 RENDER DEPLOYMENT READINESS CHECK")
    print("=" * 60)
    print()
    
    all_checks_passed = True
    
    # Check essential deployment files
    print("📁 Checking Deployment Files...")
    print("-" * 60)
    
    checks = [
        ("runtime.txt", "Python version specification"),
        ("Procfile", "Process configuration"),
        ("build.sh", "Build script"),
        ("requirements.txt", "Python dependencies"),
        (".env.example", "Environment variables template"),
        ("library_backend/settings.py", "Django settings"),
        ("library_backend/wsgi.py", "WSGI application"),
        ("manage.py", "Django management script"),
    ]
    
    for filepath, description in checks:
        if not check_file_exists(filepath, description):
            all_checks_passed = False
    
    print()
    
    # Check documentation files
    print("📚 Checking Documentation...")
    print("-" * 60)
    
    doc_checks = [
        ("RENDER_DEPLOYMENT_GUIDE.md", "Detailed deployment guide"),
        ("RENDER_QUICK_START.md", "Quick start guide"),
        ("DEPLOYMENT_CHECKLIST.md", "Deployment checklist"),
        ("DEPLOYMENT_SUMMARY.md", "Deployment summary"),
    ]
    
    for filepath, description in doc_checks:
        if not check_file_exists(filepath, description):
            all_checks_passed = False
    
    print()
    
    # Check settings.py configuration
    print("⚙️  Checking Django Settings...")
    print("-" * 60)
    
    settings_requirements = [
        "dj_database_url",
        "DATABASE_URL",
        "RENDER",
        "WhiteNoiseMiddleware",
        "STATICFILES_STORAGE",
        "CORS_ALLOWED_ORIGINS",
        "USE_CLOUDINARY",
    ]
    
    if not check_file_content(
        "library_backend/settings.py",
        settings_requirements,
        "Production settings configuration"
    ):
        all_checks_passed = False
    
    print()
    
    # Check requirements.txt
    print("📦 Checking Dependencies...")
    print("-" * 60)
    
    required_packages = [
        "Django",
        "gunicorn",
        "whitenoise",
        "dj-database-url",
        "psycopg2-binary",
        "djangorestframework",
        "cloudinary",
        "django-cors-headers",
    ]
    
    if not check_file_content(
        "requirements.txt",
        required_packages,
        "Required packages"
    ):
        all_checks_passed = False
    
    print()
    
    # Check build.sh is executable
    print("🔧 Checking Build Script...")
    print("-" * 60)
    
    if os.path.exists("build.sh"):
        if os.access("build.sh", os.X_OK):
            print("✅ build.sh is executable")
        else:
            print("⚠️  build.sh is not executable (run: chmod +x build.sh)")
            all_checks_passed = False
    
    print()
    
    # Check .gitignore
    print("🔒 Checking Security...")
    print("-" * 60)
    
    if check_file_exists(".gitignore", "Git ignore file"):
        gitignore_requirements = [".env", "*.pyc", "__pycache__"]
        if not check_file_content(".gitignore", gitignore_requirements, "Security exclusions"):
            all_checks_passed = False
    else:
        all_checks_passed = False
    
    print()
    
    # Final summary
    print("=" * 60)
    if all_checks_passed:
        print("✅ ALL CHECKS PASSED!")
        print()
        print("🚀 Your backend is ready for Render deployment!")
        print()
        print("Next steps:")
        print("1. Push your code to GitHub")
        print("2. Follow RENDER_QUICK_START.md for deployment")
        print("3. Set up Cloudinary account and get credentials")
        print("4. Configure environment variables on Render")
        print()
        return 0
    else:
        print("⚠️  SOME CHECKS FAILED")
        print()
        print("Please fix the issues above before deploying.")
        print("Refer to RENDER_DEPLOYMENT_GUIDE.md for help.")
        print()
        return 1

if __name__ == "__main__":
    sys.exit(main())
