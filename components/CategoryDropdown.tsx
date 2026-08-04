'use client';

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { articlesApi } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye } from 'lucide-react';

interface CategoryDropdownProps {
  categoryId: string;
  isOpen: boolean;
  onClose: () => void;
}

function CategoryDropdown({ categoryId, isOpen, onClose }: CategoryDropdownProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await articlesApi.getArticlesByCategory(categoryId, 10);
      setArticles(data.articles || data);
    } catch (error) {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (isOpen && categoryId) {
      loadArticles();
    }
  }, [isOpen, categoryId, loadArticles]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(onClose, 500);
    setTimeoutId(id);
  }, [timeoutId, onClose]);

  const handleMouseEnter = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
  }, [timeoutId]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed left-0 right-0 top-11 bg-gray-950/95 border-t border-gray-800 shadow-2xl z-50 backdrop-blur-sm"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div className="w-full px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Loading articles...</div>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="group"
                onClick={onClose}
              >
                <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-soloyellow/50 transition-all duration-300">
                  {/* Featured Image */}
                  {article.featuredImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                  )}

                  <div className="p-5">
                    {/* Title */}
                    <h3 className="text-white font-bold text-base mb-3 line-clamp-2 group-hover:text-soloyellow transition-colors">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    {article.excerpt && (
                      <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-gray-400 text-xs">
                      <span className="flex items-center space-x-2">
                        <Clock size={12} />
                        <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US')}</span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <Eye size={12} />
                        <span>{article.views || 0} views</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center text-gray-400">
              No articles in this category yet
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(CategoryDropdown);
