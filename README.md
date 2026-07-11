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
- REST API with MongoDB
- JWT authentication
- Role-based access control (admin, editor, author, subscriber)
- Article and category management
- User management system

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
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── server.js           # Entry point
│   ├── seed.js             # Database seed script
│   └── package.json
│
├── frontend/               # Next.js frontend
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   ├── lib/                # Utility functions
│   ├── public/             # Static assets
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
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
MONGODB_URI=mongodb://localhost:27017/solomedia
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

5. Seed the database (optional):
```bash
node seed.js
```

6. Start the backend server:
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
cp .env.local.example .env.local
```

4. Start the development server:
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
- Fast page loads with optimized images

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- cors for cross-origin requests

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Lucide React (icons)
- Axios (API client)

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

### Backend Deployment
- Deploy to Vercel, Railway, or any Node.js hosting
- Set environment variables
- Ensure MongoDB connection string is configured

### Frontend Deployment
- Deploy to Vercel (recommended for Next.js)
- Set `NEXT_PUBLIC_API_URL` to production backend URL
- Build and deploy

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For inquiries, contact admin@solomedia.com
