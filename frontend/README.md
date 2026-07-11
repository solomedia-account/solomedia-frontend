# SoloMedia Frontend

Next.js frontend for SoloMedia - African culture and diaspora media platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local

# Start development server
npm run dev
```

## 🎨 Features

- Server-side rendering with Next.js App Router
- Responsive design with TailwindCSS
- Black and yellow brand colors
- Article cards with featured and regular layouts
- Category pages
- Single article pages
- Header with navigation
- Footer with newsletter signup
- API integration with backend

## 📁 Structure

```
app/
├── layout.tsx          # Root layout with fonts
├── page.tsx            # Homepage
├── globals.css         # Global styles
├── article/[slug]/     # Article pages
└── category/[slug]/   # Category pages

components/
├── Header.tsx          # Site header with navigation
├── Footer.tsx          # Site footer
└── ArticleCard.tsx    # Article card component

lib/
├── api.ts              # API client
└── utils.ts           # Utility functions
```

## 🎯 Pages

### Homepage (`/`)
- Hero section with brand messaging
- Featured articles grid
- Latest articles grid
- Newsletter signup section

### Article Page (`/article/[slug]`)
- Full article content
- Author information
- Category badge
- View count
- Share and save buttons
- Tags

### Category Page (`/category/[slug]`)
- Category header with description
- Articles grid filtered by category
- Empty state handling

## 🎨 Brand Colors

- Black: `#000000` (soloblack)
- Yellow: `#FFD700` (soloyellow)
- Yellow Dark: `#E5C100`
- Yellow Light: `#FFE44D`

## 🔧 Configuration

Environment variables in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📦 Dependencies

- next: 14.0.4
- react: 18.2.0
- lucide-react: Icons
- tailwindcss: Styling
- axios: API client
- clsx & tailwind-merge: Utility functions

## 🚀 Build

```bash
# Production build
npm run build

# Start production server
npm start
```
