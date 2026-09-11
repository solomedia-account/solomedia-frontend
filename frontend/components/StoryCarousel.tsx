'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, Eye, ArrowUpRight } from 'lucide-react';

interface Article {
  id?: number;
  _id?: string;
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
    }, 6000);
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
    <section className="relative h-[700px] overflow-hidden bg-mag-black">
      {articles.map((article, index) => (
        <div
          key={article.id || article._id}
          className={`absolute inset-0 transition-opacity duration-700 ${
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
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mag-black via-mag-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-mag-black/80 via-transparent to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl">
                {article.category && (
                  <span className="magazine-badge mb-6 inline-block animate-slide-up">
                    {article.category.name}
                  </span>
                )}
                <h1 className="text-hero md:text-[clamp(3rem, 8vw, 5rem)] font-display font-bold text-mag-white mb-6 line-clamp-3 leading-tight animate-slide-up" style={{ animationDelay: '100ms' }}>
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="text-xl md:text-2xl text-mag-gray-light mb-8 line-clamp-2 max-w-3xl animate-slide-up" style={{ animationDelay: '200ms' }}>
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center space-x-8 text-mag-gray mb-10 animate-slide-up" style={{ animationDelay: '300ms' }}>
                  <span className="flex items-center space-x-2">
                    <Clock size={20} />
                    <span className="font-medium">{new Date(article.publishedAt).toLocaleDateString('en-US')}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <Eye size={20} />
                    <span className="font-medium">{article.views || 0} views</span>
                  </span>
                </div>
                <Link
                  href={`/article/${article.slug}`}
                  className="magazine-button inline-flex items-center space-x-3 text-lg animate-slide-up"
                  style={{ animationDelay: '400ms' }}
                >
                  <span>Read Story</span>
                  <ArrowUpRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-mag-black/80 hover:bg-mag-accent text-mag-white p-4 rounded-full transition-all duration-300 hover:scale-110 z-10 border-2 border-mag-white/20 hover:border-mag-accent"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-mag-black/80 hover:bg-mag-accent text-mag-white p-4 rounded-full transition-all duration-300 hover:scale-110 z-10 border-2 border-mag-white/20 hover:border-mag-accent"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-4 z-10">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-mag-accent scale-125' 
                : 'bg-mag-white/30 hover:bg-mag-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
