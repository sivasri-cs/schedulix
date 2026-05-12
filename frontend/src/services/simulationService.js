import api from './api';
export const saveSimulation = (data) => api.post('/api/simulations', data);
export const getSimulations = () => api.get('/api/simulations');
export const getSimulation = (id) => api.get(`/api/simulations/${id}`);
export const deleteSimulation = (id) => api.delete(`/api/simulations/${id}`);
