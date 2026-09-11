# Azure Deployment Guide for SoloMedia

## Recommended Azure Services

### Option 1: Azure Container Apps (Recommended)
**Best for:** Modern, container-based deployment with Docker support
- **Backend**: Azure Container Apps
- **Frontend**: Azure Container Apps
- **Database**: Azure SQL Database (already configured)

### Option 2: Azure App Service
**Best for:** Traditional Node.js/Next.js deployment without Docker
- **Backend**: Azure App Service (Linux)
- **Frontend**: Azure App Service (Linux)
- **Database**: Azure SQL Database (already configured)

---

## Option 1: Azure Container Apps Deployment

### Prerequisites
1. Azure account with active subscription
2. Azure CLI installed
3. Docker installed locally
4. Container Registry (Azure Container Registry)

### Step 1: Create Azure Container Registry (ACR)

```bash
# Login to Azure
az login

# Create resource group
az group create --name solomedia-rg --location eastus

# Create Container Registry
az acr create --resource-group solomedia-rg --name solomediaacr --sku Basic --admin-enabled true

# Login to ACR
az acr login --name solomediaacr
```

### Step 2: Build and Push Backend Image

```bash
# Navigate to backend directory
cd backend

# Build Docker image
docker build -t solomediaacr.azurecr.io/solomedia-backend:latest .

# Push to ACR
docker push solomediaacr.azurecr.io/solomedia-backend:latest
```

### Step 3: Build and Push Frontend Image

```bash
# Navigate to frontend directory
cd frontend

# Build Docker image
docker build -t solomediaacr.azurecr.io/solomedia-frontend:latest .

# Push to ACR
docker push solomediaacr.azurecr.io/solomedia-frontend:latest
```

### Step 4: Create Azure Container Environment

```bash
# Create Container Apps environment
az containerapp env create \
  --name solomedia-env \
  --resource-group solomedia-rg \
  --location eastus
```

### Step 5: Deploy Backend Container App

```bash
# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name solomediaacr --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name solomediaacr --query passwords[0].value -o tsv)

# Create backend container app
az containerapp create \
  --name solomedia-backend \
  --resource-group solomedia-rg \
  --environment solomedia-env \
  --image solomediaacr.azurecr.io/solomedia-backend:latest \
  --registry-server solomediaacr.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --target-port 5000 \
  --ingress external \
  --env-vars \
    AZURE_SQL_SERVER=your-server.database.windows.net \
    AZURE_SQL_DATABASE=solomedia \
    AZURE_SQL_USER=your-username \
    AZURE_SQL_PASSWORD=your-password \
    AZURE_SQL_PORT=1433 \
    JWT_SECRET=your-jwt-secret \
    CLOUDINARY_CLOUD_NAME=your-cloud-name \
    CLOUDINARY_API_KEY=your-api-key \
    CLOUDINARY_API_SECRET=your-api-secret \
    FRONTEND_URL=https://your-frontend-url
```

### Step 6: Deploy Frontend Container App

```bash
# Get backend URL
BACKEND_URL=$(az containerapp show --name solomedia-backend --resource-group solomedia-rg --query properties.configuration.ingress.fqdn -o tsv)

# Create frontend container app
az containerapp create \
  --name solomedia-frontend \
  --resource-group solomedia-rg \
  --environment solomedia-env \
  --image solomediaacr.azurecr.io/solomedia-frontend:latest \
  --registry-server solomediaacr.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --target-port 3000 \
  --ingress external \
  --env-vars \
    NEXT_PUBLIC_API_URL=https://$BACKEND_URL/api \
    NODE_ENV=production
```

### Step 7: Configure Database Access

1. Go to Azure Portal → SQL Server → Networking
2. Add your Container Apps outbound IPs to firewall rules
3. Enable "Allow Azure services and resources to access this server"

---

## Option 2: Azure App Service Deployment

### Step 1: Create Azure SQL Database (if not already created)

```bash
# Create SQL Server
az sql server create \
  --name solomedia-sql-server \
  --resource-group solomedia-rg \
  --location eastus \
  --admin-user your-admin \
  --admin-password your-password

# Create SQL Database
az sql db create \
  --name solomedia \
  --server solomedia-sql-server \
  --resource-group solomedia-rg \
  --edition GeneralPurpose \
  --family Gen5 \
  --capacity 2
```

### Step 2: Create Backend App Service

```bash
# Create App Service Plan
az appservice plan create \
  --name solomedia-backend-plan \
  --resource-group solomedia-rg \
  --location eastus \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --name solomedia-backend \
  --resource-group solomedia-rg \
  --plan solomedia-backend-plan \
  --runtime "NODE|18-lts"

# Configure environment variables
az webapp config appsettings set \
  --name solomedia-backend \
  --resource-group solomedia-rg \
  --settings \
    AZURE_SQL_SERVER=solomedia-sql-server.database.windows.net \
    AZURE_SQL_DATABASE=solomedia \
    AZURE_SQL_USER=your-username \
    AZURE_SQL_PASSWORD=your-password \
    AZURE_SQL_PORT=1433 \
    JWT_SECRET=your-jwt-secret \
    CLOUDINARY_CLOUD_NAME=your-cloud-name \
    CLOUDINARY_API_KEY=your-api-key \
    CLOUDINARY_API_SECRET=your-api-secret \
    FRONTEND_URL=https://solomedia-frontend.azurewebsites.net
```

### Step 3: Deploy Backend via Git

```bash
# Navigate to backend
cd backend

# Configure deployment user (first time only)
az webapp deployment user set --user-name solomedia-deploy --password your-password

# Get deployment credentials
DEPLOY_USER=$(az webapp deployment list-publishing-profiles --name solomedia-backend --resource-group solomedia-rg --query "[0].userName" -o tsv)
DEPLOY_PASSWORD=$(az webapp deployment list-publishing-profiles --name solomedia-backend --resource-group solomedia-rg --query "[0].userPWD" -o tsv)

# Add remote
git remote add azure https://$DEPLOY_USER:$DEPLOY_PASSWORD@solomedia-backend.scm.azurewebsites.net:443/solomedia-backend.git

# Push to Azure
git push azure master
```

### Step 4: Create Frontend App Service

```bash
# Create App Service Plan
az appservice plan create \
  --name solomedia-frontend-plan \
  --resource-group solomedia-rg \
  --location eastus \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --name solomedia-frontend \
  --resource-group solomedia-rg \
  --plan solomedia-frontend-plan \
  --runtime "NODE|18-lts"

# Configure environment variables
az webapp config appsettings set \
  --name solomedia-frontend \
  --resource-group solomedia-rg \
  --settings \
    NEXT_PUBLIC_API_URL=https://solomedia-backend.azurewebsites.net/api \
    NODE_ENV=production
```

### Step 5: Deploy Frontend via Git

```bash
# Navigate to frontend
cd frontend

# Add remote
git remote add azure https://$DEPLOY_USER:$DEPLOY_PASSWORD@solomedia-frontend.scm.azurewebsites.net:443/solomedia-frontend.git

# Push to Azure
git push azure master
```

### Step 6: Configure Build Settings

For Next.js on App Service, create a `.deployment` file in frontend root:

```ini
[config]
command = npm run build
```

And update `package.json` scripts:

```json
{
  "scripts": {
    "start": "next start -p 3000",
    "build": "next build"
  }
}
```

---

## Database Migration

### Run Seed Script on Azure SQL

```bash
# SSH into backend container (Container Apps)
az containerapp exec \
  --name solomedia-backend \
  --resource-group solomedia-rg \
  --command /bin/sh

# Or use SSH for App Service
az webapp ssh --name solomedia-backend --resource-group solomedia-rg

# Run seed script
node seed-sequelize.js
```

---

## Connecting Frontend and Backend

### Environment Variables

**Backend (.env):**
```env
AZURE_SQL_SERVER=your-server.database.windows.net
AZURE_SQL_DATABASE=solomedia
AZURE_SQL_USER=your-username
AZURE_SQL_PASSWORD=your-password
AZURE_SQL_PORT=1433
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://your-frontend-url
```

**Frontend (.env):**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url/api
NODE_ENV=production
```

### CORS Configuration

Ensure backend allows frontend domain:

```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## Monitoring and Logs

### Container Apps Logs
```bash
az containerapp logs show \
  --name solomedia-backend \
  --resource-group solomedia-rg \
  --follow
```

### App Service Logs
```bash
az webapp log tail \
  --name solomedia-backend \
  --resource-group solomedia-rg
```

---

## Cost Optimization

1. **Development Tier**: Use B1 (Basic) for testing
2. **Production Tier**: Upgrade to P1v3 (Premium) for better performance
3. **Database**: Use Serverless tier for low traffic, Standard for production
4. **Scaling**: Configure auto-scaling rules based on CPU/memory

---

## Security Best Practices

1. Use Azure Key Vault for secrets
2. Enable Managed Identity for database access
3. Configure SSL/TLS certificates
4. Set up Azure Firewall rules
5. Enable Application Insights for monitoring
6. Regular security updates and patches

---

## Troubleshooting

### Backend Not Connecting to Database
- Check Azure SQL firewall rules
- Verify connection string format
- Ensure database is accessible from Azure services

### Frontend API Errors
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS configuration
- Ensure backend is running and accessible

### Build Failures
- Check build logs in Azure Portal
- Verify Node.js version compatibility
- Ensure all dependencies are installed
