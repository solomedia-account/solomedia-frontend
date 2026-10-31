# Domain Setup Guide for solomedianet.com

This guide will help you configure your domain name from Namecheap to work with your SoloMedia application running on Oracle Cloud.

## Overview

- **Domain**: solomedianet.com
- **Frontend VM**: 84.8.131.97:3000
- **Backend VM**: 84.12.90.85:5000
- **Goal**: Access app via https://solomedianet.com

## Step 1: Configure DNS in Namecheap

### 1.1 Log into Namecheap
1. Go to https://ap.www.namecheap.com
2. Log in with your account
3. Go to "Domain List" → find solomedianet.com
4. Click "Manage" next to your domain

### 1.2 Add DNS Records

Navigate to "Advanced DNS" tab and add the following records:

**A Record (for solomedianet.com):**
- Type: A Record
- Host: @
- Value: 84.8.131.97
- TTL: Automatic

**A Record (for www subdomain):**
- Type: A Record
- Host: www
- Value: 84.8.131.97
- TTL: Automatic

**Optional: A Record for API subdomain (if you want api.solomedianet.com):**
- Type: A Record
- Host: api
- Value: 84.12.90.85
- TTL: Automatic

Save the changes. DNS propagation typically takes 10-30 minutes, but can take up to 48 hours.

## Step 2: Configure Oracle Cloud Firewall

### 2.1 Access Security Lists

1. Go to Oracle Cloud Console
2. Navigate to Networking → Virtual Cloud Networks
3. Select your VCN (solomedia-vcn)
4. Click "Security Lists" in the left sidebar
5. Click on the default security list

### 2.2 Add Ingress Rules for Frontend VM

Add these rules to allow HTTP and HTTPS traffic:

**HTTP (Port 80):**
- Source CIDR: 0.0.0.0/0
- IP Protocol: TCP
- Destination Port: 80
- Description: HTTP access

**HTTPS (Port 443):**
- Source CIDR: 0.0.0.0/0
- IP Protocol: TCP
- Destination Port: 443
- Description: HTTPS access

**Keep existing rule for Port 3000:**
- Source CIDR: 0.0.0.0/0
- IP Protocol: TCP
- Destination Port: 3000
- Description: Frontend app (keep for testing)

### 2.3 Add Ingress Rules for Backend VM

**HTTP (Port 80 - for SSL termination later):**
- Source CIDR: 0.0.0.0/0
- IP Protocol: TCP
- Destination Port: 80
- Description: HTTP access

**HTTPS (Port 443 - for SSL termination later):**
- Source CIDR: 0.0.0.0/0
- IP Protocol: TCP
- Destination Port: 443
- Description: HTTPS access

**Keep existing rule for Port 5000:**
- Source CIDR: 0.0.0.0/0
- IP Protocol: TCP
- Destination Port: 5000
- Description: Backend API (keep for testing)

## Step 3: Install and Configure Nginx on Frontend VM

We'll use Nginx as a reverse proxy to handle SSL and forward traffic to your app on port 3000.

### 3.1 SSH into Frontend VM

```bash
ssh ubuntu@84.8.131.97
```

### 3.2 Install Nginx

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 3.3 Configure Nginx

Create a new Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/solomedianet.com
```

Add this configuration:

```nginx
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
    }
}
```

Save and exit (Ctrl+X, then Y, then Enter).

### 3.4 Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/solomedianet.com /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 3.5 Allow Nginx Through Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Step 4: Obtain SSL Certificate with Let's Encrypt

### 4.1 Obtain Certificate

```bash
sudo certbot --nginx -d solomedianet.com -d www.solomedianet.com
```

Follow the prompts:
- Enter your email address
- Agree to terms of service
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

Certbot will automatically update your Nginx configuration with SSL.

### 4.2 Test SSL Configuration

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 4.3 Set Up Auto-Renewal

Certbot should automatically set up auto-renewal, but verify:

```bash
sudo certbot renew --dry-run
```

## Step 5: Update Application Configuration

### 5.1 Update Frontend API URL

The frontend now needs to use the domain for API calls. You have two options:

**Option A: Use the domain for frontend, IP for backend (simpler)**
- Frontend: https://solomedianet.com
- Backend API: http://84.12.90.85:5000/api

**Option B: Use subdomain for backend (more professional)**
- Frontend: https://solomedianet.com
- Backend API: https://api.solomedianet.com/api

Let's proceed with Option A for simplicity.

### 5.2 Rebuild Frontend with New API URL

SSH into frontend VM:

```bash
cd ~/solomedia-frontend

# Stop and remove existing container
docker stop solomedia-frontend
docker rm solomedia-frontend
docker rmi solomedia-frontend

# Build with the API URL (still using backend IP)
docker build --build-arg NEXT_PUBLIC_API_URL=http://84.12.90.85:5000/api -t solomedia-frontend

# Run the container
docker run -d \
  --name solomedia-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://84.12.90.85:5000/api \
  -e NODE_ENV=production \
  -e NODE_OPTIONS=--max-old-space-size=768 \
  --restart unless-stopped \
  solomedia-frontend
```

### 5.3 Update Backend CORS

SSH into backend VM:

```bash
ssh ubuntu@84.12.90.85
cd ~/solomedia-backend
nano .env
```

Update `FRONTEND_URL`:
```env
FRONTEND_URL=https://solomedianet.com
```

Save and restart:
```bash
docker restart solomedia-backend
```

## Step 6: Update GitHub Actions for Domain

### 6.1 Update Frontend Workflow

Update `.github/workflows/deploy.yml` to rebuild with the correct API URL:

```yaml
docker build --build-arg NEXT_PUBLIC_API_URL=http://84.12.90.85:5000/api -t solomedia-frontend
```

### 6.2 Update GitHub Secrets

Add/update these secrets in GitHub:
- `FRONTEND_VM_HOST`: 84.8.131.97
- `BACKEND_VM_HOST`: 84.12.90.85
- `NEXT_PUBLIC_API_URL`: http://84.12.90.85:5000/api

## Step 7: Test the Setup

### 7.1 Test DNS Propagation

Check if DNS is pointing correctly:

```bash
# On your local machine
nslookup solomedianet.com
ping solomedianet.com
```

### 7.2 Test HTTP (before SSL)

```bash
curl http://solomedianet.com
```

### 7.3 Test HTTPS

```bash
curl https://solomedianet.com
```

### 7.4 Test in Browser

Open https://solomedianet.com in your browser and verify:
- ✅ Site loads correctly
- ✅ SSL certificate is valid (padlock icon)
- ✅ API calls work (check console for errors)
- ✅ Images load correctly

## Step 8: Optional - Set Up API Subdomain

If you want to use api.solomedianet.com for the backend:

### 8.1 Add DNS Record in Namecheap

**A Record:**
- Type: A Record
- Host: api
- Value: 84.12.90.85
- TTL: Automatic

### 8.2 Install Nginx on Backend VM

```bash
ssh ubuntu@84.12.90.85
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 8.3 Configure Nginx for Backend

```bash
sudo nano /etc/nginx/sites-available/api.solomedianet.com
```

```nginx
server {
    listen 80;
    server_name api.solomedianet.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and test:
```bash
sudo ln -s /etc/nginx/sites-available/api.solomedianet.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8.4 Obtain SSL for API

```bash
sudo certbot --nginx -d api.solomedianet.com
```

### 8.5 Update Configuration

Update frontend API URL to:
```env
NEXT_PUBLIC_API_URL=https://api.solomedianet.com/api
```

Update backend CORS:
```env
FRONTEND_URL=https://solomedianet.com
```

## Troubleshooting

### DNS Not Propagating

```bash
# Check DNS propagation
dig solomedianet.com
nslookup solomedianet.com

# If still showing old records, wait and check again
# DNS can take up to 48 hours to fully propagate
```

### Nginx 502 Bad Gateway

```bash
# Check if the app is running on port 3000
curl http://localhost:3000

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check Nginx status
sudo systemctl status nginx
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew manually if needed
sudo certbot renew

# Check Nginx SSL configuration
sudo nginx -t
```

### Container Not Accessible

```bash
# Check if Docker container is running
docker ps

# Check container logs
docker logs solomedia-frontend

# Restart container
docker restart solomedia-frontend
```

### CORS Errors

Verify backend `.env` has the correct `FRONTEND_URL`:
```env
FRONTEND_URL=https://solomedianet.com
```

Restart backend after changing:
```bash
docker restart solomedia-backend
```

## Security Recommendations

1. **Keep SSL Updated**: Certbot auto-renews, but verify periodically
2. **Enable HSTS**: Add HSTS header in Nginx for better security
3. **Rate Limiting**: Configure Nginx rate limiting to prevent DDoS
4. **Firewall**: Keep only necessary ports open (80, 443, 22)
5. **Updates**: Regularly update OS and packages:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

## Summary

After completing these steps:
- ✅ solomedianet.com will point to your frontend VM
- ✅ SSL/TLS will be enabled with Let's Encrypt
- ✅ Nginx will reverse proxy to your Docker container on port 3000
- ✅ HTTPS will be enforced
- ✅ API calls will work correctly
- ✅ Your app will be accessible at https://solomedianet.com

## Next Steps

1. Complete DNS configuration in Namecheap
2. Configure Oracle Cloud firewall rules
3. Install and configure Nginx on frontend VM
4. Obtain SSL certificate
5. Update application configurations
6. Test thoroughly
7. Optionally set up api.solomedianet.com for backend
