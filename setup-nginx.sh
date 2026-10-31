#!/bin/bash

# Nginx Setup Script for solomedianet.com on Ubuntu 24.04
# Run this on your frontend VM (84.8.131.97)

set -e

echo "=== Nginx Setup for solomedianet.com ==="

# Update system
echo "Updating system packages..."
sudo apt update

# Install Nginx and Certbot
echo "Installing Nginx and Certbot..."
sudo apt install -y nginx certbot python3-certbot-nginx

# Configure UFW firewall
echo "Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# Remove default Nginx site
echo "Removing default Nginx site..."
sudo rm -f /etc/nginx/sites-enabled/default

# Copy Nginx configuration
echo "Setting up Nginx configuration..."
sudo tee /etc/nginx/sites-available/solomedianet.com > /dev/null <<'EOF'
server {
    listen 80;
    server_name solomedianet.com www.solomedianet.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
EOF

# Enable the site
echo "Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/solomedianet.com /etc/nginx/sites-enabled/

# Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

# Restart Nginx
echo "Restarting Nginx..."
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

echo "=== Nginx setup complete ==="
echo ""
echo "Next steps:"
echo "1. Ensure DNS is configured in Namecheap (A record @ -> 84.8.131.97)"
echo "2. Ensure Oracle Cloud firewall allows ports 80 and 443"
echo "3. Once DNS propagates, run:"
echo "   sudo certbot --nginx -d solomedianet.com -d www.solomedianet.com"
echo ""
echo "Nginx status:"
sudo systemctl status nginx --no-pager
