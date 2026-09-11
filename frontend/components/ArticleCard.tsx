import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, ArrowUpRight } from 'lucide-react';
import { memo, useMemo } from 'react';

interface ArticleCardProps {
  article: {
    id?: string;
    _id?: string;
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

function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const date = useMemo(() => 
    new Date(article.publishedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }), [article.publishedAt]
  );

  if (featured) {
    return (
      <Link href={`/article/${article.slug}`} className="group block">
        <div className="relative h-[500px] overflow-hidden magazine-card">
          <div className="absolute inset-0 bg-gradient-to-t from-mag-black via-mag-black/50 to-transparent z-10" />
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-mag-black-light" />
          )}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <span className="magazine-badge mb-4 inline-block">
              {article.category.name}
            </span>
            <h2 className="text-hero font-display font-bold text-mag-white mb-4 group-hover:text-mag-accent transition-colors leading-tight">
              {article.title}
            </h2>
            <p className="text-mag-gray-light text-lg line-clamp-2 mb-6 max-w-2xl">{article.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-mag-gray text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye size={16} />
                  <span>{article.views} views</span>
                </div>
              </div>
              <ArrowUpRight size={24} className="text-mag-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <div className="magazine-card">
        <div className="relative h-64 overflow-hidden">
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-mag-black-light" />
          )}
          <span className="magazine-badge absolute top-4 left-4">
            {article.category.name}
          </span>
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight size={24} className="text-mag-accent" />
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-headline font-display font-bold text-mag-white mb-3 group-hover:text-mag-accent transition-colors line-clamp-2 leading-tight">
            {article.title}
          </h3>
          <p className="text-mag-gray text-base line-clamp-2 mb-6">{article.excerpt}</p>
          <div className="flex items-center justify-between text-mag-gray text-sm border-t border-mag-gray-light/20 pt-4">
            <div className="flex items-center space-x-3">
              {article.author.avatar && (
                <div className="w-8 h-8 rounded-full bg-mag-black-light overflow-hidden border-2 border-mag-accent">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    width={32}
                    height={32}
                    loading="lazy"
                  />
                </div>
              )}
              <span className="font-medium">{article.author.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={14} />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(ArticleCard);
