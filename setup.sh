#!/bin/bash

# Library Management System - Quick Setup Script
# This script automates the initial setup process

echo "=========================================="
echo "Library Management System - Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Python 3 is installed
echo -e "${YELLOW}Checking Python version...${NC}"
if command -v python3 &> /dev/null; then
    PYTHON_CMD=python3
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
    echo -e "${GREEN}✓ Python found: $($PYTHON_CMD --version)${NC}"
    if (( $(echo "$PYTHON_VERSION < 3.9" | bc -l) )); then
        echo -e "${YELLOW}⚠ Python 3.9+ is recommended. Current version: $PYTHON_VERSION${NC}"
    fi
else
    echo -e "${RED}Python 3 is not installed${NC}"
    exit 1
fi
echo ""

# Create virtual environment
echo -e "${YELLOW}Creating virtual environment...${NC}"
if [ -d "venv" ]; then
    echo -e "${YELLOW}Virtual environment already exists. Skipping...${NC}"
else
    $PYTHON_CMD -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
fi
echo ""

# Activate virtual environment
echo -e "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate
echo -e "${GREEN}✓ Virtual environment activated${NC}"
echo ""

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠ Please edit .env file with your configuration${NC}"
else
    echo -e "${YELLOW}.env file already exists. Skipping...${NC}"
fi
echo ""

# Create logs directory
echo -e "${YELLOW}Creating logs directory...${NC}"
mkdir -p logs
echo -e "${GREEN}✓ Logs directory created${NC}"
echo ""

# Create media directory
echo -e "${YELLOW}Creating media directory...${NC}"
mkdir -p media/students/photos
mkdir -p media/students/id_proofs
echo -e "${GREEN}✓ Media directory created${NC}"
echo ""

# Check PostgreSQL
echo -e "${YELLOW}Checking PostgreSQL...${NC}"
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL is installed${NC}"
    echo -e "${YELLOW}Make sure to create the database: createdb library_db${NC}"
else
    echo -e "${RED}⚠ PostgreSQL is not installed or not in PATH${NC}"
    echo -e "${YELLOW}Please install PostgreSQL and create database: library_db${NC}"
fi
echo ""

# Run migrations
echo -e "${YELLOW}Do you want to run migrations now? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${YELLOW}Creating migrations...${NC}"
    python manage.py makemigrations
    echo -e "${YELLOW}Running migrations...${NC}"
    python manage.py migrate
    echo -e "${GREEN}✓ Migrations completed${NC}"
else
    echo -e "${YELLOW}Skipping migrations. Run manually: python manage.py migrate${NC}"
fi
echo ""

# Create superuser
echo -e "${YELLOW}Do you want to create a superuser now? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    python manage.py createsuperuser
else
    echo -e "${YELLOW}Skipping superuser creation. Run manually: python manage.py createsuperuser${NC}"
fi
echo ""

# Collect static files
echo -e "${YELLOW}Collecting static files...${NC}"
python manage.py collectstatic --noinput
echo -e "${GREEN}✓ Static files collected${NC}"
echo ""

echo "=========================================="
echo -e "${GREEN}Setup completed successfully!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Create PostgreSQL database: createdb library_db"
echo "3. Run migrations: python manage.py migrate"
echo "4. Create superuser: python manage.py createsuperuser"
echo "5. Start server: python manage.py runserver"
echo ""
echo "Access the API at: http://127.0.0.1:8000"
echo "API Documentation: http://127.0.0.1:8000/swagger/"
echo "Admin Panel: http://127.0.0.1:8000/admin/"
echo ""
echo "For more information, see README.md and QUICKSTART.md"
echo ""
