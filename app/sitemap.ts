import { MetadataRoute } from 'next'
import { api } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://solomedia.cm'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/advertise`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  try {
    // Fetch categories
    const categories = await api.get('/categories', undefined, true)
    
    const categoryPages: MetadataRoute.Sitemap = categories.map((cat: any) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(cat.updatedAt || cat.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Fetch articles
    const articles = await api.get('/articles?limit=1000', undefined, true)
    const articleList = articles.articles || articles
    
    const articlePages: MetadataRoute.Sitemap = articleList.map((article: any) => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: new Date(article.updatedAt || article.publishedAt || article.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    return [...staticPages, ...categoryPages, ...articlePages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
