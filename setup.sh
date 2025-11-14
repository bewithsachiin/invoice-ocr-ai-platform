#!/bin/bash

# Invoice OCR Platform Setup Script
set -e

echo "============================================"
echo "Invoice OCR Platform - Setup Script"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then
   echo -e "${YELLOW}Warning: Running without root privileges. Some operations may fail.${NC}"
fi

# Navigate to project directory
cd /root/invoice-ocr-platform

echo -e "${BLUE}Step 1: Checking Docker containers...${NC}"
docker ps --filter "name=invoice-ocr" --format "table {{.Names}}\t{{.Status}}"
echo ""

echo -e "${BLUE}Step 2: Setting up Python backend...${NC}"
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip setuptools wheel

# Install dependencies (minimal for now, full install later)
echo "Installing core dependencies..."
pip install \
    fastapi==0.108.0 \
    uvicorn[standard]==0.25.0 \
    sqlalchemy[asyncio]==2.0.25 \
    asyncpg==0.29.0 \
    alembic==1.13.1 \
    psycopg2-binary==2.9.9 \
    python-dotenv==1.0.0 \
    python-jose[cryptography]==3.3.0 \
    passlib[bcrypt]==1.7.4 \
    python-multipart==0.0.6 \
    pydantic==2.5.3 \
    pydantic-settings==2.1.0

echo ""
echo -e "${BLUE}Step 3: Initializing database...${NC}"

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 3

# Initialize Alembic (create initial migration)
if [ ! -f "alembic/versions/*.py" ]; then
    echo "Creating initial database migration..."
    PYTHONPATH=. alembic revision --autogenerate -m "Initial database schema"
fi

# Run migrations
echo "Running database migrations..."
PYTHONPATH=. alembic upgrade head

echo ""
echo -e "${BLUE}Step 4: Testing backend server...${NC}"
echo "Starting FastAPI server on port 8004..."
echo "Press Ctrl+C after verifying it starts successfully"
echo ""

# Start the server (will run until Ctrl+C)
python -m app.main

echo ""
echo -e "${GREEN}✓ Backend setup complete!${NC}"
