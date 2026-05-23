import api from './api';

export const leadService = {
  getLeads: (params) => api.get('/leads', { params }),
  getLead: (id) => api.get(`/leads/${id}`),
  createLead: (data) => api.post('/leads', data),
  updateLead: (id, data) => api.put(`/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/leads/${id}`),
  getStats: () => api.get('/leads/stats'),
  getFollowUps: () => api.get('/leads/followups'),
  getActivities: () => api.get('/leads/activities'),
  getPerformance: () => api.get('/leads/performance'),
  addNote: (id, data) => api.post(`/leads/${id}/notes`, data),
  deleteNote: (id, noteId) => api.delete(`/leads/${id}/notes/${noteId}`),
};
