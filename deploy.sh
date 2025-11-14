#!/bin/bash

# Invoice OCR Platform Deployment Script
# Version: 1.0.0

set -e  # Exit on error

echo "🚀 Invoice OCR Platform - Deployment Script"
echo "==========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}❌ Do not run as root${NC}"
   exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "📋 Checking prerequisites..."
echo ""

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js: $NODE_VERSION"
else
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

# Check Python
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} Python: $PYTHON_VERSION"
else
    echo -e "${RED}❌ Python3 not found. Please install Python 3.11+${NC}"
    exit 1
fi

# Check PostgreSQL
if command_exists psql; then
    echo -e "${GREEN}✓${NC} PostgreSQL installed"
else
    echo -e "${YELLOW}⚠${NC}  PostgreSQL not found. Install: sudo apt install postgresql"
fi

# Check Redis
if command_exists redis-cli; then
    echo -e "${GREEN}✓${NC} Redis installed"
else
    echo -e "${YELLOW}⚠${NC}  Redis not found. Install: sudo apt install redis-server"
fi

echo ""
echo "🔧 Setting up backend..."
echo ""

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC}  .env file not found. Copying from .env.example"
    cp .env.example .env
    echo -e "${YELLOW}⚠${NC}  Please edit backend/.env with your configuration"
    exit 1
fi

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

echo -e "${GREEN}✓${NC} Backend setup complete"
echo ""

cd ..

# Frontend setup
echo "🎨 Setting up frontend..."
echo ""

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC}  .env file not found. Copying from .env.example"
    cp .env.example .env
fi

# Build frontend
echo "Building frontend for production..."
npm run build

echo -e "${GREEN}✓${NC} Frontend build complete"
echo ""

cd ..

echo ""
echo "✅ Deployment preparation complete!"
echo ""
echo "📚 Next steps:"
echo "1. Edit backend/.env with your database credentials"
echo "2. Edit frontend/.env with your API URL"
echo "3. Start backend: cd backend && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000"
echo "4. Start frontend dev: cd frontend && npm run dev"
echo "5. Or deploy frontend build: Copy frontend/dist/* to your web server"
echo ""
echo "🐳 Docker option: docker-compose up -d"
echo ""
