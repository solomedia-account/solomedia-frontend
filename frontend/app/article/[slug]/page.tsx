import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { api } from '@/lib/api';
import { Calendar, Eye, Share2, Bookmark } from 'lucide-react';
import Image from 'next/image';

async function getArticle(slug: string) {
  try {
    const article = await api.get(`/articles/${slug}`);
    return article;
  } catch (error) {
    return null;
  }
}

async function getRelatedArticles(categoryId: string, currentArticleId: string) {
  try {
    const data = await api.get(`/articles?category=${categoryId}&limit=4`);
    return (data.articles || data).filter((a: any) => a.id !== currentArticleId).slice(0, 3);
  } catch (error) {
    return [];
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  const relatedArticles = article ? await getRelatedArticles(article.categoryId, article.id) : [];

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">Article not found</h1>
      </div>
    );
  }

  // Parse tags if they're stored as JSON string
  const tags = typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags;

  const date = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Article Header */}
        <article className="bg-gray-950">
          <div className="container mx-auto px-4 py-12">
            {/* Category Badge */}
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ backgroundColor: article.category.color, color: '#000' }}
            >
              {article.category.name}
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center space-x-6 text-gray-400 mb-8">
              <div className="flex items-center space-x-2">
                {article.author.avatar && (
                  <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="text-white">{article.author.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={18} />
                <span>{date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye size={18} />
                <span>{article.views} views</span>
              </div>
            </div>

            {/* Featured Image */}
            {article.featuredImage && (
              <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden mb-8">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-4 mb-8">
              <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Share2 size={18} />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Bookmark size={18} />
                <span>Save</span>
              </button>
            </div>

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-4xl">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-12 bg-gray-900">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-display font-bold mb-8 flex items-center">
                <span className="w-2 h-8 bg-soloyellow mr-4"></span>
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((article: any) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
