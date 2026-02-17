#!/usr/bin/env bash
# Render build script
set -o errexit

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Running database migrations..."
python manage.py migrate

echo "Setting up production data..."
python manage.py setup_production

echo "Build completed successfully!"
