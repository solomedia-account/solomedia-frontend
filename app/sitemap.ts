import { MetadataRoute } from 'next'

const baseUrl = 'https://solomedia.onrender.com'

// Define your site structure
const routes = [
  '',
  '/about',
  '/categories',
  '/articles',
  '/contact',
  '/login',
  '/register',
  '/profile',
  '/dashboard',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}