#!/bin/bash

# SoloMedia Frontend Deployment Script for Oracle Cloud VM
# Frontend VM: Public IP 84.8.131.97, Private IP 10.0.0.19
# Backend Public IP: 84.12.90.85, Private IP: 10.0.0.188

set -e

echo "=== SoloMedia Frontend Deployment ==="

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
cd ~/solomedia/frontend

# Stop and remove existing container if exists
echo "Stopping existing container..."
docker stop solomedia-frontend 2>/dev/null || true
docker rm solomedia-frontend 2>/dev/null || true

# Remove existing image if exists
echo "Removing existing image..."
docker rmi solomedia-frontend 2>/dev/null || true

# Build new image
echo "Building Docker image..."
docker build --build-arg NEXT_PUBLIC_API_URL=http://84.12.90.85:5000/api -t solomedia-frontend .

# Run container with backend URL (using PUBLIC IP for browser access)
echo "Starting container..."
docker run -d \
  --name solomedia-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://84.12.90.85:5000/api \
  -e NODE_ENV=production \
  -e NODE_OPTIONS=--max-old-space-size=768 \
  --restart unless-stopped \
  solomedia-frontend

# Wait for container to start
echo "Waiting for container to start..."
sleep 10

# Check container status
echo "Container status:"
docker ps | grep solomedia-frontend

# Check logs
echo "Recent logs:"
docker logs --tail 20 solomedia-frontend

echo "=== Frontend deployment complete ==="
echo "Frontend is running on port 3000"
echo "Public IP: 84.8.131.97"
echo "Private IP: 10.0.0.19"
echo "Backend URL: http://84.12.90.85:5000/api"
