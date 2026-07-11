const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = (token?: string) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const api = {
  async get(endpoint: string, token?: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: token ? getAuthHeaders(token) : { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  },

  async post(endpoint: string, data: any, token?: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  },

  async put(endpoint: string, data: any, token?: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  },

  async delete(endpoint: string, token?: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: token ? getAuthHeaders(token) : {},
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  },
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  
  getMe: (token: string) =>
    api.get('/users/me', token),
  
  updateProfile: (data: any, token: string) =>
    api.put('/users/me', data, token),
};

// User API
export const userApi = {
  getUsers: (token: string, params?: { limit?: number; page?: number; role?: string }) =>
    api.get(`/users${params ? `?${new URLSearchParams(params as any)}` : ''}`, token),
  
  updateRole: (userId: string, role: string, token: string) =>
    api.put(`/users/${userId}/role`, { role }, token),
  
  deleteUser: (userId: string, token: string) =>
    api.delete(`/users/${userId}`, token),
};

// Profile API
export const profileApi = {
  getProfile: (userId: string, token?: string) =>
    api.get(`/profile/${userId}`, token),
  
  getOwnProfile: (token: string) =>
    api.get('/profile', token),
  
  updateProfile: (data: any, token: string) =>
    api.put('/profile', data, token),
  
  updateVisibility: (profileVisibility: string, token: string) =>
    api.put('/profile/visibility', { profileVisibility }, token),
  
  addPortfolioItem: (item: any, token: string) =>
    api.post('/profile/portfolio', item, token),
  
  updatePortfolioItem: (itemId: string, item: any, token: string) =>
    api.put(`/profile/portfolio/${itemId}`, item, token),
  
  deletePortfolioItem: (itemId: string, token: string) =>
    api.delete(`/profile/portfolio/${itemId}`, token),
};

// Preferences API
export const preferencesApi = {
  getPreferences: (token: string) =>
    api.get('/preferences', token),
  
  updatePreferences: (data: any, token: string) =>
    api.put('/preferences', data, token),
  
  toggleEmailNotifications: (token: string) =>
    api.put('/preferences/email-notifications', {}, token),
  
  toggleNewsletter: (token: string) =>
    api.put('/preferences/newsletter', {}, token),
};

// Notifications API
export const notificationsApi = {
  getNotifications: (token: string, params?: { unreadOnly?: boolean; limit?: number; page?: number }) =>
    api.get(`/notifications${params ? `?${new URLSearchParams(params as any)}` : ''}`, token),
  
  markAsRead: (notificationId: string, token: string) =>
    api.put(`/notifications/${notificationId}/read`, {}, token),
  
  markAllAsRead: (token: string) =>
    api.put('/notifications/read-all', {}, token),
  
  deleteNotification: (notificationId: string, token: string) =>
    api.delete(`/notifications/${notificationId}`, token),
};

// Dashboard API
export const dashboardApi = {
  getStats: (token: string) =>
    api.get('/dashboard/stats', token),
  
  getArticles: (token: string, limit?: number) =>
    api.get(`/dashboard/articles${limit ? `?limit=${limit}` : ''}`, token),
  
  getActivity: (token: string, limit?: number) =>
    api.get(`/dashboard/activity${limit ? `?limit=${limit}` : ''}`, token),
  
  getUsers: (token: string, params?: { limit?: number; page?: number; role?: string }) =>
    api.get(`/dashboard/users${params ? `?${new URLSearchParams(params as any)}` : ''}`, token),
  
  getOverview: (token: string) =>
    api.get('/dashboard/overview', token),
};

// Activities API
export const activitiesApi = {
  logActivity: (data: any, token: string) =>
    api.post('/activities', data, token),
  
  getActivities: (token: string, params?: { type?: string; limit?: number; page?: number }) =>
    api.get(`/activities${params ? `?${new URLSearchParams(params as any)}` : ''}`, token),
  
  getActivitiesByType: (type: string, token: string, limit?: number) =>
    api.get(`/activities/type/${type}${limit ? `?limit=${limit}` : ''}`, token),
  
  deleteActivity: (activityId: string, token: string) =>
    api.delete(`/activities/${activityId}`, token),
};

// Articles API
export const articlesApi = {
  getArticles: (params?: { category?: string; featured?: boolean; limit?: number; page?: number; status?: string }) =>
    api.get(`/articles${params ? `?${new URLSearchParams(params as any)}` : ''}`),
  
  getArticlesByCategory: (categoryId: string, limit?: number) =>
    api.get(`/articles?category=${categoryId}${limit ? `&limit=${limit}` : ''}`),
  
  getArticleBySlug: (slug: string) =>
    api.get(`/articles/${slug}`),
  
  getArticleById: (articleId: string, token: string) =>
    api.get(`/articles/id/${articleId}`, token),
  
  createArticle: (data: any, token: string) =>
    api.post('/articles', data, token),
  
  updateArticle: (articleId: string, data: any, token: string) =>
    api.put(`/articles/${articleId}`, data, token),
  
  deleteArticle: (articleId: string, token: string) =>
    api.delete(`/articles/${articleId}`, token),
};

// Categories API
export const categoriesApi = {
  getCategories: () =>
    api.get('/categories'),
  
  getCategoryBySlug: (slug: string) =>
    api.get(`/categories/${slug}`),
  
  createCategory: (data: any, token: string) =>
    api.post('/categories', data, token),
  
  updateCategory: (categoryId: string, data: any, token: string) =>
    api.put(`/categories/${categoryId}`, data, token),
  
  deleteCategory: (categoryId: string, token: string) =>
    api.delete(`/categories/${categoryId}`, token),
};

// Upload API
export const uploadApi = {
  uploadImage: (file: File, token: string) => {
    const formData = new FormData();
    formData.append('image', file);
    
    return fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(response => response.json());
  },

  uploadVideo: (file: File, token: string) => {
    const formData = new FormData();
    formData.append('video', file);
    
    return fetch(`${API_BASE_URL}/upload/video`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(response => response.json());
  },
};
