import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

// ─── Cases ───
export const casesApi = {
  list: (params?: { userId?: string; status?: string; search?: string; page?: number; size?: number }) =>
    api.get('/cases', { params }),
  getById: (caseId: string) =>
    api.get(`/cases/${caseId}`),
  create: (data: any) =>
    api.post('/cases', data),
  update: (caseId: string, data: any) =>
    api.put(`/cases/${caseId}`, data),
  delete: (caseId: string) =>
    api.delete(`/cases/${caseId}`),
  addComment: (caseId: string, comment: string) =>
    api.post(`/cases/${caseId}/comments`, { comment }),
};

// ─── Users (Admin) ───
export const adminUsersApi = {
  list: () =>
    api.get('/admin/users'),
  getById: (userId: string) =>
    api.get(`/admin/users/${userId}`),
  create: (data: { name: string; email: string; phone: string; password: string; role: string }) =>
    api.post('/admin/users', data),
  update: (userId: string, data: { name: string; email: string; phone: string; password: string; role: string }) =>
    api.put(`/admin/users/${userId}`, data),
  delete: (userId: string) =>
    api.delete(`/admin/users/${userId}`),
};

// ─── User Profile (Self) ───
export const userApi = {
  getProfile: () =>
    api.get('/users/me'),
  updateProfile: (data: { name?: string; phone?: string }) =>
    api.patch('/users/me', data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.patch('/users/me/change-password', { currentPassword, newPassword }),
};

// ─── Import / Export ───
export const importExportApi = {
  importExcel: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/import-export/import/excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  importCsv: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/import-export/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  exportExcel: () =>
    api.get('/admin/import-export/export/excel', { responseType: 'blob' }),
  exportCsv: () =>
    api.get('/admin/import-export/export/csv', { responseType: 'blob' }),
  deleteAll: () =>
    api.delete('/admin/import-export/cases/delete-all'),
};

export default api;
