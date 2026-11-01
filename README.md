# SoloMedia

A modern media platform dedicated to African culture and diaspora stories, covering fashion, arts, music, film, entertainment, technology, and investor dynamics.

## 🎨 Brand Colors

- **Primary Black**: `#000000`
- **Primary Yellow**: `#FFD700`
- **Yellow Dark**: `#E5C100`
- **Yellow Light**: `#FFE44D`

## 🏗️ Architecture

SoloMedia is built with a separated frontend and backend architecture:

### Backend (Node.js/Express)
- REST API with MySQL/Aiven database
- JWT authentication
- Role-based access control (admin, editor, author, subscriber)
- Article and category management
- User management system
- Cloudinary for image/video uploads

### Frontend (Next.js 14)
- Server-side rendering with Next.js App Router
- TailwindCSS for styling
- Responsive design
- Modern UI components
- API integration

## 📁 Project Structure

```
solomedia/
├── backend/                 # Node.js/Express API
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── server.js           # Entry point
│   ├── Dockerfile          # Production container
│   └── package.json
│
├── frontend/               # Next.js frontend
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   ├── lib/                # Utility functions
│   ├── public/             # Static assets
│   ├── Dockerfile          # Production container
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL database (Aiven or local)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

5. Start the backend server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NODE_ENV=development
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Articles
- `GET /api/articles` - Get all published articles
- `GET /api/articles/:slug` - Get single article by slug
- `POST /api/articles` - Create article (protected)
- `PUT /api/articles/:id` - Update article (protected)
- `DELETE /api/articles/:id` - Delete article (protected)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get single category
- `POST /api/categories` - Create category (protected)
- `PUT /api/categories/:id` - Update category (protected)
- `DELETE /api/categories/:id` - Delete category (protected)

### Users
- `GET /api/users/me` - Get current user (protected)
- `PUT /api/users/me` - Update profile (protected)
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)

## 👥 User Roles

- **Admin**: Full access to all features
- **Editor**: Can create, edit, and delete articles and categories
- **Author**: Can create and edit own articles
- **Subscriber**: Can read articles and update profile

## 🎯 Features

- Responsive design for all devices
- Featured articles section
- Category-based content organization
- Article view tracking
- User authentication and authorization
- Modern UI with black and yellow branding
- SEO-friendly with Next.js SSR
- Cloudinary image uploads
- IndexNow for search engine indexing

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MySQL with Sequelize
- JWT for authentication
- bcryptjs for password hashing
- cors for cross-origin requests
- Cloudinary for media uploads

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Lucide React (icons)

## 📝 Development

### Running Both Servers

For development, you'll need both backend and frontend running:

1. Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

2. Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Building for Production

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm start
```

## 🌐 Deployment

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions to Oracle Cloud VMs.

### Quick Deploy Commands

Backend:
```bash
./deploy-backend.sh
```

Frontend:
```bash
./deploy-frontend.sh
```

## � License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## � Contact

For inquiries, contact admin@solomedia.com
