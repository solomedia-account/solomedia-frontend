'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardApi } from '@/lib/api';
import { ArrowLeft, TrendingUp, Eye, FileText, Users, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadStats();
    }
  }, [token]);

  const loadStats = async () => {
    if (!token) return;
    try {
      const data = await dashboardApi.getStats(token);
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
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
                  Analytics
                </h1>
                <p className="text-gray-400">
                  View detailed analytics and performance metrics
                </p>
              </div>
            </div>

            {stats && (
              <>
                {/* Stats Grid */}
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
                        <Users size={24} className="text-purple-400" />
                      </div>
                      <span className="text-green-400 text-sm font-medium">+3%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.users?.total || 0}</div>
                    <div className="text-gray-400 text-sm">Total Users</div>
                  </div>
                </div>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h2 className="text-xl font-semibold text-white mb-6">Article Performance</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <Eye size={20} className="text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Average Views per Article</p>
                            <p className="text-gray-400 text-sm">Performance metric</p>
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-white">
                          {stats.articles.total > 0 ? Math.round(stats.articles.views / stats.articles.total) : 0}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Calendar size={20} className="text-blue-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Published This Month</p>
                            <p className="text-gray-400 text-sm">Recent publications</p>
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-white">
                          {stats.articles.published || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h2 className="text-xl font-semibold text-white mb-6">User Engagement</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-purple-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Active Authors</p>
                            <p className="text-gray-400 text-sm">Content creators</p>
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-white">
                          {stats.users?.authors || 0}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-soloyellow/20 rounded-lg flex items-center justify-center">
                            <TrendingUp size={20} className="text-soloyellow" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Activity Rate</p>
                            <p className="text-gray-400 text-sm">Engagement level</p>
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-white">
                          {stats.activity.recent}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
  );
}
