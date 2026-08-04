'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import { Search as SearchIcon } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      api.get(`/articles?search=${encodeURIComponent(query)}`)
        .then((data) => setArticles(Array.isArray(data) ? data : (data.articles || [])))
        .catch(() => setArticles([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [query]);

  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Please enter a search query</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-white">Searching...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <SearchIcon size={48} className="mx-auto text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
        <p className="text-gray-400">Try searching for something else</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-400">
        Found {articles.length} result{articles.length !== 1 ? 's' : ''} for "{query}"
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="flex-1 bg-gray-950 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Search</h1>
          <Suspense fallback={<div className="text-white">Loading...</div>}>
            <SearchResults />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
