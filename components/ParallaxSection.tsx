'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye, ArrowRight } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  featuredImage: string;
  slug: string;
  category: {
    name: string;
    color: string;
  };
  publishedAt: string;
  views: number;
}

interface ParallaxSectionProps {
  article: Article;
}

export default function ParallaxSection({ article }: ParallaxSectionProps) {
  if (!article) return null;

  return (
    <section className="relative h-[500px] overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0">
        {article.featuredImage && (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ transform: 'scale(1.1)' }}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-3 mb-4">
              {article.category && (
                <span
                  className="inline-block px-3 py-1 text-sm font-semibold rounded"
                  style={{ backgroundColor: article.category.color, color: '#000' }}
                >
                  {article.category.name}
                </span>
              )}
              <span className="text-soloyellow text-sm font-semibold uppercase tracking-wider">
                Featured Story
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 line-clamp-3">
              {article.title}
            </h2>
            
            {article.excerpt && (
              <p className="text-lg text-gray-200 mb-6 line-clamp-2">
                {article.excerpt}
              </p>
            )}
            
            <div className="flex items-center space-x-6 text-gray-300 mb-8">
              <span className="flex items-center space-x-2">
                <Clock size={16} />
                <span>{new Date(article.publishedAt).toLocaleDateString('en-US')}</span>
              </span>
              <span className="flex items-center space-x-2">
                <Eye size={16} />
                <span>{article.views || 0} views</span>
              </span>
            </div>
            
            <Link
              href={`/article/${article.slug}`}
              className="inline-flex items-center space-x-2 bg-soloyellow text-soloblack px-6 py-3 rounded-lg font-semibold hover:bg-soloyellow-dark transition-colors"
            >
              <span>Read Full Story</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
