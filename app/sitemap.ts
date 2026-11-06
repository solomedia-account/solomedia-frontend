import { MetadataRoute } from 'next'
import { api } from '@/lib/api'

const baseUrl = 'https://solomedianet.com'

// Define static routes
const staticRoutes = [
  { path: '', priority: 1.0, changeFrequency: 'daily' as const },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/advertise', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/careers', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = []

  // Add static routes
  staticRoutes.forEach((route) => {
    sitemap.push({
      url: `${baseUrl}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })
  })

  try {
    // Fetch all articles
    const articlesData = await api.get('/articles?limit=1000', undefined, true)
    const articles = articlesData.articles || []

    // Add article routes
    articles.forEach((article: any) => {
      sitemap.push({
        url: `${baseUrl}/article/${article.slug}`,
        lastModified: new Date(article.updatedAt || article.publishedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      })
    })

    // Fetch all categories
    const categoriesData = await api.get('/categories', undefined, true)
    const categories = categoriesData || []

    // Add category routes
    categories.forEach((category: any) => {
      sitemap.push({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    })
  } catch (error) {
    console.error('Error fetching data for sitemap:', error)
  }

  return sitemap
}