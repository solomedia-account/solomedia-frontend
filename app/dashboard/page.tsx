'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardApi, articlesApi } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Eye, TrendingUp, Users, Bell, Activity, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const loadDashboardData = async () => {
    if (!token) return;
    try {
      const [statsData, articlesData, activityData] = await Promise.all([
        dashboardApi.getStats(token),
        dashboardApi.getArticles(token, 10),
        dashboardApi.getActivity(token, 10),
      ]);
      setStats(statsData);
      setRecentArticles(Array.isArray(articlesData) ? articlesData : []);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    if (!token) return;

    try {
      await articlesApi.deleteArticle(String(articleId), token);
      // Reload dashboard data
      loadDashboardData();
    } catch (error: any) {
      console.error('Failed to delete article:', error);
      alert(`Failed to delete article: ${error.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';
  const isEditor = user?.role === 'editor';
  const isAuthor = user?.role === 'author';
  const canCreateArticle = isAdmin || isEditor || isAuthor;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-400">
                  Here's what's happening with your content today.
                </p>
              </div>
              {canCreateArticle && (
                <button 
                  onClick={() => router.push('/articles/create')}
                  className="flex items-center space-x-2 bg-soloyellow hover:bg-soloyellow-dark text-black px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus size={20} />
                  <span>Create Article</span>
                </button>
              )}
            </div>

            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-soloyellow/20 rounded-lg flex items-center justify-center">
                      <FileText size={24} className="text-soloyellow" />
                    </div>
                    <span className="text-green-400 text-sm font-medium">+12%</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.articles.total}</div>
                  <div className="text-gray-400 text-sm">Total Articles</div>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Eye size={24} className="text-green-400" />
                    </div>
                    <span className="text-green-400 text-sm font-medium">+8%</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.articles.views}</div>
                  <div className="text-gray-400 text-sm">Total Views</div>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp size={24} className="text-blue-400" />
                    </div>
                    <span className="text-green-400 text-sm font-medium">+5%</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.activity.recent}</div>
                  <div className="text-gray-400 text-sm">Recent Activity</div>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Bell size={24} className="text-purple-400" />
                    </div>
                    <span className="text-soloyellow text-sm font-medium">New</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.notifications.unread}</div>
                  <div className="text-gray-400 text-sm">Unread Notifications</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Articles */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Recent Articles</h2>
                  <button className="text-soloyellow hover:text-soloyellow-dark text-sm font-medium">
                    View All
                  </button>
                </div>
                
                {recentArticles.length > 0 ? (
                  <div className="space-y-4">
                    {recentArticles.map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium mb-1">{article.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className={`px-2 py-1 rounded text-xs ${
                              article.status === 'published' 
                                ? 'bg-green-500/20 text-green-400' 
                                : article.status === 'pending_review'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {article.status}
                            </span>
                            <span>{article.views} views</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => router.push(`/articles/edit/${article.id}`)}
                            className="text-gray-400 hover:text-white p-1"
                            title="Edit"
                          >
                            <FileText size={18} />
                          </button>
                          {(isAdmin || isEditor) && (
                            <button 
                              onClick={() => handleDeleteArticle(article.id)}
                              className="text-gray-400 hover:text-red-400 p-1"
                              title="Delete"
                            >
                              <Activity size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No articles yet. Start creating content!
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                  <button className="text-soloyellow hover:text-soloyellow-dark text-sm font-medium">
                    View All
                  </button>
                </div>
                
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity._id} className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
                        <div className="w-10 h-10 bg-soloyellow/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Activity size={20} className="text-soloyellow" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{activity.description}</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No recent activity
                  </div>
                )}
              </div>
            </div>

            {/* Admin/Editor Section */}
            {(isAdmin || isEditor) && (
              <div className="mt-8 bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-6">Admin Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => router.push('/admin/users')}
                    className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Users size={20} className="text-soloyellow" />
                    <span className="text-white">Manage Users</span>
                  </button>
                  <button 
                    onClick={() => router.push('/admin/review')}
                    className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FileText size={20} className="text-soloyellow" />
                    <span className="text-white">Review Articles</span>
                  </button>
                  <button 
                    onClick={() => router.push('/admin/analytics')}
                    className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <TrendingUp size={20} className="text-soloyellow" />
                    <span className="text-white">View Analytics</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
