// REST API Client Service for CS Alumni Portal Backend

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API Request Failed');
    }
    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Alumni APIs
  getAlumni: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return request(`/alumni${query ? `?${query}` : ''}`);
  },
  getAlumnusById: (id) => request(`/alumni/${id}`),
  getVerificationQueue: () => request('/alumni/queue'),
  registerAlumni: (formData) => request('/alumni/register', { method: 'POST', body: JSON.stringify(formData) }),
  approveAlumni: (id) => request(`/alumni/queue/${id}/approve`, { method: 'PATCH' }),
  rejectAlumni: (id) => request(`/alumni/queue/${id}`, { method: 'DELETE' }),
  updateAlumniProfile: (id, payload) => request(`/alumni/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  // Metrics API
  getStats: () => request('/stats'),

  // Notifications API
  getNotifications: () => request('/notifications'),
  markNotificationsRead: () => request('/notifications/mark-read', { method: 'POST' }),

  // Student Opportunities API
  getOpportunities: () => request('/opportunities'),

  // Contact API
  sendContactForm: (payload) => request('/contact', { method: 'POST', body: JSON.stringify(payload) }),

  // AI Assistant API
  sendAiChat: (payload) => request('/ai-chat', { method: 'POST', body: JSON.stringify(payload) })
};
