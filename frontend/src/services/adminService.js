import api from './api';
export const getUsers = () => api.get('/api/admin/users');
export const getStats = () => api.get('/api/admin/stats');
export const getAnnouncements = () => api.get('/api/admin/announcements');
export const createAnnouncement = (data) => api.post('/api/admin/announcements', data);
export const deleteAnnouncement = (id) => api.delete(`/api/admin/announcements/${id}`);
