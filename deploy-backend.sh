#!/bin/bash

# SoloMedia Backend Deployment Script for Oracle Cloud VM
# Backend VM: Public IP 84.12.90.85, Private IP 10.0.0.188

set -e

echo "=== SoloMedia Backend Deployment ==="

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "Docker installed. Please log out and log back in for group changes to take effect."
fi

# Navigate to project directory
cd ~/solomedia/backend

# Stop and remove existing container if exists
echo "Stopping existing container..."
docker stop solomedia-backend 2>/dev/null || true
docker rm solomedia-backend 2>/dev/null || true

# Remove existing image if exists
echo "Removing existing image..."
docker rmi solomedia-backend 2>/dev/null || true

# Build new image
echo "Building Docker image..."
docker build -t solomedia-backend .

# Run container
echo "Starting container..."
docker run -d \
  --name solomedia-backend \
  -p 5000:5000 \
  --env-file .env \
  --restart unless-stopped \
  solomedia-backend

# Wait for container to start
echo "Waiting for container to start..."
sleep 5

# Check container status
echo "Container status:"
docker ps | grep solomedia-backend

# Check logs
echo "Recent logs:"
docker logs --tail 20 solomedia-backend

# Health check
echo "Running health check..."
sleep 3
curl -f http://localhost:5000/health || echo "Health check failed"

echo "=== Backend deployment complete ==="
echo "Backend is running on port 5000"
echo "Public IP: 84.12.90.85"
echo "Private IP: 10.0.0.188"
