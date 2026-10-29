# SoloMedia Oracle Cloud Deployment Guide

## Network Configuration

```
VCN CIDR: 10.0.0.0/16
Subnet CIDR: 10.0.1.0/24

Backend VM:
  Public IP: 84.12.90.85
  Private IP: 10.0.0.188
  Port: 5000

Frontend VM:
  Public IP: 84.12.90.176
  Private IP: 10.0.0.241
  Port: 3000
```

## Changes Made

### 1. Backend Configuration
- ✅ Updated `backend/.env.example` with `FRONTEND_URL=http://10.0.0.241:3000`
- ✅ Updated `backend/Dockerfile` to use `npm ci --only=production` for production builds

### 2. Frontend Configuration
- ✅ Updated `frontend/.env.example` with `NEXT_PUBLIC_API_URL=http://10.0.0.188:5000/api`
- ✅ Updated `frontend/Dockerfile` to use multi-stage build for production

### 3. Deployment Scripts
- ✅ Created `deploy-backend.sh` - Automated backend deployment
- ✅ Created `deploy-frontend.sh` - Automated frontend deployment

## Deployment Steps

### Step 1: Deploy Backend

1. **SSH into Backend VM**
   ```bash
   ssh ubuntu@84.12.90.85
   ```

2. **Clone or Upload Code**
   ```bash
   # Option A: Clone from git (recommended)
   cd ~
   git clone <your-repo-url> solomedia

   # Option B: Upload via scp (from your local machine)
   scp -r /path/to/solomedia ubuntu@84.12.90.85:~/
   ```

3. **Configure Environment Variables**
   ```bash
   cd ~/solomedia/backend
   cp .env.example .env
   nano .env
   ```

   Update `.env` with your production values:
   ```env
   PORT=5000
   FRONTEND_URL=http://10.0.0.241:3000
   NODE_ENV=production

   JWT_SECRET=your_production_jwt_secret_here

   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   DB_HOST=your_db_host
   DB_PORT=your_db_port
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   MYSQL_CA_CERTIFICATE=your_mysql_ca_certificate

   INDEXNOW_API_KEY=your_indexnow_api_key
   ```

4. **Make Deployment Script Executable**
   ```bash
   cd ~/solomedia
   chmod +x deploy-backend.sh
   ```

5. **Run Deployment**
   ```bash
   ./deploy-backend.sh
   ```

6. **Verify Deployment**
   ```bash
   # Check container status
   docker ps

   # Check logs
   docker logs -f solomedia-backend

   # Health check
   curl http://localhost:5000/health
   ```

### Step 2: Deploy Frontend

1. **SSH into Frontend VM**
   ```bash
   ssh ubuntu@84.12.90.176
   ```

2. **Clone or Upload Code**
   ```bash
   # Option A: Clone from git (recommended)
   cd ~
   git clone <your-repo-url> solomedia

   # Option B: Upload via scp (from your local machine)
   scp -r /path/to/solomedia ubuntu@84.12.90.176:~/
   ```

3. **Make Deployment Script Executable**
   ```bash
   cd ~/solomedia
   chmod +x deploy-frontend.sh
   ```

4. **Run Deployment**
   ```bash
   ./deploy-frontend.sh
   ```

5. **Verify Deployment**
   ```bash
   # Check container status
   docker ps

   # Check logs
   docker logs -f solomedia-frontend

   # Test from local machine
   curl http://84.12.90.176:3000
   ```

### Step 3: Test Full Stack

1. **Test Backend API**
   ```bash
   curl http://84.12.90.85:5000/health
   curl http://84.12.90.85:5000/
   ```

2. **Test Frontend**
   ```bash
   curl http://84.12.90.176:3000
   ```

3. **Test Inter-VM Communication**
   ```bash
   # From backend VM
   curl http://10.0.0.241:3000

   # From frontend VM
   curl http://10.0.0.188:5000/health
   ```

4. **Access in Browser**
   - Frontend: http://84.12.90.176:3000
   - Backend API: http://84.12.90.85:5000

## Management Commands

### Backend VM

```bash
# View logs
docker logs -f solomedia-backend

# Restart container
docker restart solomedia-backend

# Stop container
docker stop solomedia-backend

# Start container
docker start solomedia-backend

# Rebuild and redeploy
cd ~/solomedia
./deploy-backend.sh
```

### Frontend VM

```bash
# View logs
docker logs -f solomedia-frontend

# Restart container
docker restart solomedia-frontend

# Stop container
docker stop solomedia-frontend

# Start container
docker start solomedia-frontend

# Rebuild and redeploy
cd ~/solomedia
./deploy-frontend.sh
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs solomedia-backend
docker logs solomedia-frontend

# Check container status
docker ps -a
```

### Can't connect between VMs
```bash
# Test connectivity
ping 10.0.0.188  # from frontend
ping 10.0.0.241  # from backend

# Check security list rules in Oracle Cloud Console
# Ensure ports 3000 and 5000 are allowed from 10.0.0.0/16
```

### Database connection issues
```bash
# Check backend logs
docker logs solomedia-backend

# Verify database credentials in .env
# Ensure database allows connections from backend public IP (84.12.90.85)
```

### Out of memory on free tier
```bash
# Check memory usage
docker stats

# If memory issues, consider:
# 1. Using ARM VMs (more RAM available)
# 2. Adding swap space
# 3. Optimizing Node.js memory usage
```

## Security Recommendations

1. **SSH Security**
   - Use SSH keys only (disable password auth)
   - Change default SSH port if desired
   - Use fail2ban to prevent brute force attacks

2. **Firewall**
   - Ensure only necessary ports are open (22, 3000, 5000)
   - Consider using Oracle Network Security Groups for granular control

3. **SSL/TLS**
   - For production, use Oracle's free Load Balancer with SSL
   - Or use Let's Encrypt with nginx reverse proxy

4. **Secrets Management**
   - Never commit .env files to git
   - Use Oracle Cloud Vault for secret management (paid tier)
   - Rotate secrets regularly

5. **Updates**
   - Keep OS packages updated: `sudo apt update && sudo apt upgrade -y`
   - Update Docker regularly
   - Keep dependencies updated

## Next Steps

1. **Set up SSL/HTTPS** using Oracle Load Balancer or Let's Encrypt
2. **Configure domain names** pointing to your public IPs
3. **Set up monitoring** using Oracle Cloud Monitoring
4. **Configure backups** for your database
5. **Set up CI/CD** pipeline for automated deployments (see [CI_CD_SETUP.md](./CI_CD_SETUP.md))

## Cost Monitoring

Oracle Free Tier includes:
- 2 AMD VMs (1 OCPU, 1GB RAM each) OR 4 ARM VMs (4 OCPUs, 24GB RAM total)
- 200 GB total block storage
- 10 TB/month outbound data transfer

Monitor usage in Oracle Cloud Console to avoid unexpected charges.
