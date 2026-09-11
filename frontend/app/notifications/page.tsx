'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationsApi } from '@/lib/api';
import { Bell, Check, CheckCheck, Trash2, Filter } from 'lucide-react';

export default function NotificationsPage() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (token) {
      loadNotifications();
    }
  }, [token, filter]);

  const loadNotifications = async () => {
    if (!token) return;
    try {
      const data = await notificationsApi.getNotifications(token, {
        unreadOnly: filter === 'unread',
        limit: 50
      });
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (!token) return;
    try {
      await notificationsApi.markAsRead(notificationId, token);
      loadNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token) return;
    try {
      await notificationsApi.markAllAsRead(token);
      loadNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (!token) return;
    try {
      await notificationsApi.deleteNotification(notificationId, token);
      loadNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'article_published':
        return '📝';
      case 'comment_received':
        return '💬';
      case 'user_followed':
        return '👥';
      case 'system_update':
        return '🔔';
      case 'article_approved':
        return '✅';
      case 'article_rejected':
        return '❌';
      default:
        return '📌';
    }
  };

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
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">
                  Notifications
                </h1>
                <p className="text-gray-400">
                  {unreadCount > 0 && `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-900 rounded-lg p-1">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      filter === 'all' ? 'bg-soloyellow text-soloblack' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      filter === 'unread' ? 'bg-soloyellow text-soloblack' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Unread
                  </button>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <CheckCheck size={18} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`bg-gray-900 rounded-xl p-6 border transition-colors ${
                      notification.isRead ? 'border-gray-800' : 'border-soloyellow/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{notification.title}</h3>
                          <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                          <p className="text-gray-500 text-xs">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-2 text-gray-400 hover:text-soloyellow transition-colors"
                            title="Mark as read"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {notification.link && (
                      <a
                        href={notification.link}
                        className="inline-block mt-4 text-soloyellow hover:text-soloyellow-dark text-sm font-medium"
                      >
                        View →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Bell size={64} className="mx-auto text-gray-700 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
                <p className="text-gray-400">
                  {filter === 'unread' 
                    ? "You're all caught up!" 
                    : "You don't have any notifications yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
  );
}
