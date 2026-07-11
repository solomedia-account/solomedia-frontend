import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, Clock } from 'lucide-react';

interface ArticleCardProps {
  article: {
    _id: string;
    title: string;
    excerpt: string;
    featuredImage?: string;
    category: {
      name: string;
      slug: string;
      color: string;
    };
    author: {
      name: string;
      avatar?: string;
    };
    publishedAt: string;
    views: number;
    slug: string;
  };
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const date = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (featured) {
    return (
      <Link href={`/article/${article.slug}`} className="group block">
        <div className="relative h-96 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-800" />
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
              style={{ backgroundColor: article.category.color, color: '#000' }}
            >
              {article.category.name}
            </span>
            <h2 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-soloyellow transition-colors">
              {article.title}
            </h2>
            <p className="text-gray-300 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
            <div className="flex items-center space-x-4 text-gray-400 text-xs">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye size={14} />
                <span>{article.views} views</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-soloyellow/50 transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-800" />
          )}
          <span
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: article.category.color, color: '#000' }}
          >
            {article.category.name}
          </span>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-display font-semibold text-white mb-2 group-hover:text-soloyellow transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">{article.excerpt}</p>
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <div className="flex items-center space-x-2">
              {article.author.avatar && (
                <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    width={24}
                    height={24}
                  />
                </div>
              )}
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
