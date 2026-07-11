'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, Eye } from 'lucide-react';

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

interface StoryCarouselProps {
  articles: Article[];
}

export default function StoryCarousel({ articles }: StoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [articles.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  if (articles.length === 0) return null;

  return (
    <section className="relative h-[600px] overflow-hidden bg-gray-950">
      {articles.map((article, index) => (
        <div
          key={article.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          {article.featuredImage && (
            <div className="absolute inset-0">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                {article.category && (
                  <span
                    className="inline-block px-4 py-2 text-sm font-semibold rounded mb-4"
                    style={{ backgroundColor: article.category.color, color: '#000' }}
                  >
                    {article.category.name}
                  </span>
                )}
                <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 line-clamp-3">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="text-xl text-gray-200 mb-6 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center space-x-6 text-gray-300 mb-8">
                  <span className="flex items-center space-x-2">
                    <Clock size={18} />
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <Eye size={18} />
                    <span>{article.views || 0} views</span>
                  </span>
                </div>
                <Link
                  href={`/article/${article.slug}`}
                  className="inline-block bg-soloyellow text-soloblack px-8 py-3 rounded-lg font-semibold hover:bg-soloyellow-dark transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-soloyellow' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
