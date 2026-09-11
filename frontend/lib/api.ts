const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const CACHE_DURATION = 5 * 60 * 1000;
const cache = new Map<string, { data: any; timestamp: number }>();

const getAuthHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` })
});

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

const withCache = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};

const getCached = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) return cached.data;
  cache.delete(key);
  return null;
};

const request = async (endpoint: string, options: RequestInit = {}, token?: string) => {
  return handleResponse(
    await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: getAuthHeaders(token),
    })
  );
};

export const api = {
  async get(endpoint: string, token?: string, useCache = true) {
    const cacheKey = `GET:${endpoint}`;
    if (useCache) {
      const cached = getCached(cacheKey);
      if (cached) return cached;
    }
    const data = await request(endpoint, { cache: 'no-store' }, token);
    return useCache ? withCache(cacheKey, data) : data;
  },
  post: (endpoint: string, data: any, token?: string) => 
    request(endpoint, { method: 'POST', body: JSON.stringify(data) }, token),
  put: (endpoint: string, data: any, token?: string) => 
    request(endpoint, { method: 'PUT', body: JSON.stringify(data) }, token),
  delete: (endpoint: string, token?: string) => 
    request(endpoint, { method: 'DELETE' }, token),
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
const uploadFile = async (file: File, type: 'image' | 'video', token: string) => {
  const formData = new FormData();
  formData.append(type, file);
  const response = await fetch(`${API_BASE_URL}/upload/${type}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  return handleResponse(response);
};

export const uploadApi = {
  uploadImage: (file: File, token: string) => uploadFile(file, 'image', token),
  uploadVideo: (file: File, token: string) => uploadFile(file, 'video', token),
};
