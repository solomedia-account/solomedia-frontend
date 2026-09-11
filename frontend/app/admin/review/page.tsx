'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { articlesApi } from '@/lib/api';
import { ArrowLeft, Check, X, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReviewArticlesPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadArticles();
    }
  }, [token]);

  const loadArticles = async () => {
    if (!token) return;
    try {
      const data = await articlesApi.getArticles({ status: 'pending_review' });
      console.log('Articles data:', data);
      setArticles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (articleId: string) => {
    if (!token) return;
    try {
      await articlesApi.updateArticle(articleId, { status: 'published' }, token);
      loadArticles();
    } catch (error: any) {
      console.error('Failed to approve article:', error);
      alert(`Failed to approve article: ${error.message || 'Unknown error'}`);
    }
  };

  const handleReject = async (articleId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (!token) return;
    try {
      await articlesApi.updateArticle(articleId, { status: 'draft', rejectionReason: reason }, token);
      loadArticles();
    } catch (error: any) {
      console.error('Failed to reject article:', error);
      alert(`Failed to reject article: ${error.message || 'Unknown error'}`);
    }
  };

  if (!user || !['admin', 'editor'].includes(user.role)) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center space-x-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">
                  Review Articles
                </h1>
                <p className="text-gray-400">
                  Review and approve articles submitted by authors
                </p>
              </div>
            </div>

            {articles.length === 0 ? (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
                <p className="text-gray-400">No articles pending review</p>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div key={article.id} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{article.title}</h3>
                        <p className="text-gray-400 text-sm mb-4">
                          By {article.author?.name} • {new Date(article.createdAt).toLocaleDateString('en-US')}
                        </p>
                        <p className="text-gray-300 line-clamp-3">{article.excerpt}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button 
                          onClick={() => router.push(`/articles/edit/${article.id}`)}
                          className="text-gray-400 hover:text-white p-2"
                          title="View"
                        >
                          <Eye size={20} />
                        </button>
                        <button 
                          onClick={() => handleApprove(article.id)}
                          className="text-green-400 hover:text-green-300 p-2"
                          title="Approve"
                        >
                          <Check size={20} />
                        </button>
                        <button 
                          onClick={() => handleReject(article.id)}
                          className="text-red-400 hover:text-red-300 p-2"
                          title="Reject"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                    {article.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-400 text-sm">Rejection reason: {article.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
  );
}
