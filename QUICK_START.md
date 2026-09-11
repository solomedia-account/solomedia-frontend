# SoloMedia - Quick Start Guide

## Overview
SoloMedia is a full-stack African culture and diaspora media platform with a Next.js frontend and Express.js backend.

## Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Express.js, Sequelize (MSSQL), JWT auth
- **Database**: Azure SQL (MSSQL)
- **Storage**: Cloudinary
- **Containerization**: Docker & Docker Compose

## Prerequisites
- Node.js 24+
- Docker & Docker Compose
- Azure SQL Database
- Cloudinary account

## Environment Setup

### Backend (.env)
```env
PORT=5000
FRONTEND_URL=http://localhost:3001
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

AZURE_SQL_SERVER=your_server.database.windows.net
AZURE_SQL_DATABASE=your_database
AZURE_SQL_PORT=1433
AZURE_SQL_USER=your_username
AZURE_SQL_PASSWORD=your_password
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running the Application

### Option 1: Docker (Recommended)
```bash
# Build and start all services
docker-compose up --build

# Services will be available at:
# - Backend: http://localhost:5000
# - Frontend: http://localhost:3001
```

### Option 2: Local Development

#### Backend
```bash
cd backend
npm install
npm start  # or npm run dev for development
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
solomedia/
├── backend/
│   ├── config/          # Database & logger config
│   ├── middleware/      # Auth middleware
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── server.js        # Express server entry
│   └── Dockerfile
├── frontend/
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── lib/             # Utilities & API client
│   └── Dockerfile
└── docker-compose.yml
```

## Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Articles
- `GET /api/articles` - Get published articles
- `GET /api/articles/:slug` - Get article by slug
- `POST /api/articles` - Create article (auth required)
- `PUT /api/articles/:id` - Update article (auth required)
- `DELETE /api/articles/:id` - Delete article (auth required)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug

### User Management
- `GET /api/users/me` - Get current user (auth required)
- `PUT /api/users/me` - Update profile (auth required)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard stats (auth required)
- `GET /api/dashboard/articles` - Get recent articles (auth required)

## User Roles
- **admin**: Full system access
- **editor**: Can publish/edit articles
- **author**: Can submit articles for review
- **user**: Read-only access

## Database Models
- **User**: User accounts and profiles
- **Article**: Content articles with status workflow
- **Category**: Article categories
- **Activity**: User activity tracking
- **Notification**: User notifications
- **Profile**: Extended user profiles

## Development Notes

### Backend Simplifications
- Consolidated rate limiter configuration
- Extracted JWT token generation helper
- Removed console.log statements
- Created pagination helper functions
- Extracted user update helpers

### Frontend Simplifications
- Consolidated API error handling
- Simplified auth context with helper functions
- Removed unnecessary useCallback wrappers
- Extracted upload file logic

### Docker Simplifications
- Removed verbose comments
- Simplified docker-compose.yml
- Removed complex health checks

## Troubleshooting

### Backend won't start
- Check Azure SQL connection in .env
- Verify JWT_SECRET is set
- Check port 5000 availability

### Frontend build errors
- Clear .next directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Docker issues
- Rebuild containers: `docker-compose up --build --force-recreate`
- Check logs: `docker-compose logs backend` or `docker-compose logs frontend`

## Health Check
```bash
# Backend health endpoint
curl http://localhost:5000/health
```

## License
ISC
