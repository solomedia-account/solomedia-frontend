import ArticleCard from '@/components/ArticleCard';
import { api } from '@/lib/api';
import { Calendar, Eye, Share2, Bookmark } from 'lucide-react';
import Image from 'next/image';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

async function getArticle(slug: string) {
  try {
    const article = await api.get(`/articles/${slug}`, undefined, true);
    return article;
  } catch (error) {
    return null;
  }
}

async function getRelatedArticles(categoryId: string, currentArticleId: string) {
  try {
    const data = await api.get(`/articles?category=${categoryId}&limit=4`, undefined, true);
    return (data.articles || data).filter((a: any) => a.id !== currentArticleId).slice(0, 3);
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const tags = typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags;
  
  return {
    title: article.title,
    description: article.excerpt || article.content?.substring(0, 160) || 'Read this article on SoloMedia',
    keywords: tags || [article.category?.name, 'SoloMedia', 'African culture'],
    openGraph: {
      title: article.title,
      description: article.excerpt || article.content?.substring(0, 160),
      url: `https://solomedia.onrender.com/article/${article.slug}`,
      images: article.featuredImage ? [
        {
          url: article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ] : [],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author?.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.content?.substring(0, 160),
      images: article.featuredImage ? [article.featuredImage] : [],
    },
  };
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
    <main className="flex-1">
        {/* Hero Section with Featured Image */}
        <article className="bg-gray-950">
          {article.featuredImage && (
            <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8 md:pb-12">
                <div className="max-w-4xl mx-auto">
                  {/* Category Badge */}
                  <span
                    className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 md:mb-6"
                    style={{ backgroundColor: article.category.color, color: '#000' }}
                  >
                    {article.category.name}
                  </span>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 md:mb-6 text-white leading-tight">
                    {article.title}
                  </h1>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-300 text-sm md:text-base">
                    <div className="flex items-center space-x-2">
                      {article.author.avatar && (
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 overflow-hidden">
                          <img
                            src={article.author.avatar}
                            alt={article.author.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <span className="text-white font-medium">{article.author.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="md:w-5 md:h-5" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye size={16} className="md:w-5 md:h-5" />
                      <span>{article.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
            <div className="max-w-3xl lg:max-w-4xl mx-auto">
              {!article.featuredImage && (
                <>
                  {/* Category Badge */}
                  <span
                    className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 md:mb-6"
                    style={{ backgroundColor: article.category.color, color: '#000' }}
                  >
                    {article.category.name}
                  </span>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 md:mb-6 text-white leading-tight">
                    {article.title}
                  </h1>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-300 text-sm md:text-base mb-8">
                    <div className="flex items-center space-x-2">
                      {article.author.avatar && (
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 overflow-hidden">
                          <img
                            src={article.author.avatar}
                            alt={article.author.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <span className="text-white font-medium">{article.author.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="md:w-5 md:h-5" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye size={16} className="md:w-5 md:h-5" />
                      <span>{article.views} views</span>
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
                <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg hover:bg-gray-700 transition-colors text-sm md:text-base">
                  <Share2 size={16} className="md:w-5 md:h-5" />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg hover:bg-gray-700 transition-colors text-sm md:text-base">
                  <Bookmark size={16} className="md:w-5 md:h-5" />
                  <span>Save</span>
                </button>
              </div>

              {/* Content */}
              <div className="prose prose-invert prose-lg md:prose-xl max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-bold text-white mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-bold text-white mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-300 mb-4">{children}</p>,
                    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="text-gray-200 italic">{children}</em>,
                    a: ({ href, children }) => (
                      <a href={href} className="text-soloyellow hover:text-soloyellow-dark underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                    ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-300">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-soloyellow pl-4 italic text-gray-400 bg-gray-800/50 py-2 pr-4 mb-4">
                        {children}
                      </blockquote>
                    ),
                    code: ({ className, children }) => (
                      <code className="bg-gray-800 text-soloyellow px-2 py-1 rounded text-sm">{children}</code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">
                        <code className="text-gray-200">{children}</code>
                      </pre>
                    ),
                    img: ({ src, alt }) => (
                      <img 
                        src={src} 
                        alt={alt || ''} 
                        className="rounded-lg my-4 max-w-full h-auto"
                        loading="lazy"
                      />
                    ),
                    hr: () => <hr className="border-gray-700 my-6" />,
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-gray-800">
                  <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-white">Tags</h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-800 text-gray-300 rounded-full text-sm md:text-base hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-12 md:py-16 lg:py-20 bg-gray-900">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-8 md:mb-12 flex items-center">
                <span className="w-2 h-8 bg-soloyellow mr-4"></span>
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {relatedArticles.map((article: any) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
  );
}
