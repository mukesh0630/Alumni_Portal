// REST API Client Service for CS Alumni Portal Backend with Client-Side Fallback Resilience
import {
  MOCK_ALUMNI,
  MOCK_VERIFICATION_QUEUE,
  MOCK_OPPORTUNITIES,
  MOCK_NOTIFICATIONS
} from './mockData';

const API_BASE = '/api';

// In-memory fallback state for standalone offline usage
let fallbackAlumni = [...MOCK_ALUMNI];
let fallbackQueue = [...MOCK_VERIFICATION_QUEUE];
let fallbackNotifications = [...MOCK_NOTIFICATIONS];
let fallbackOpportunities = [...MOCK_OPPORTUNITIES];

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
    console.warn(`[API Network Fallback triggered for ${endpoint}]:`, err.message || err);
    return handleClientFallback(endpoint, options);
  }
}

function handleClientFallback(endpoint, options = {}) {
  const method = options.method ? options.method.toUpperCase() : 'GET';
  const url = new URL(endpoint, 'http://dummy.local');
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  // GET /alumni
  if (pathname === '/alumni' && method === 'GET') {
    let result = [...fallbackAlumni];

    const search = searchParams.get('search');
    const batch = searchParams.get('batch');
    const company = searchParams.get('company');
    const location = searchParams.get('location');
    const role = searchParams.get('role');
    const verified = searchParams.get('verified');
    const distinguished = searchParams.get('distinguished');
    const mentorship = searchParams.get('mentorship');

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.designation.toLowerCase().includes(q) ||
        (a.skills && a.skills.some(s => s.toLowerCase().includes(q)))
      );
    }

    if (batch) {
      result = result.filter(a => String(a.batch) === String(batch));
    }

    if (company) {
      result = result.filter(a => a.company.toLowerCase() === company.toLowerCase());
    }

    if (location) {
      if (location === 'international') {
        result = result.filter(a => a.location.includes('USA') || a.location.includes('UK') || a.location.includes('EU'));
      } else {
        result = result.filter(a => a.location.toLowerCase().includes(location.toLowerCase()));
      }
    }

    if (role) {
      const r = role.toLowerCase();
      if (r === 'architect') {
        result = result.filter(a => a.designation.toLowerCase().includes('architect'));
      } else if (r === 'vp-director') {
        result = result.filter(a => a.designation.toLowerCase().includes('vp') || a.designation.toLowerCase().includes('director') || a.designation.toLowerCase().includes('head'));
      } else if (r === 'sde') {
        result = result.filter(a => a.designation.toLowerCase().includes('engineer') || a.designation.toLowerCase().includes('developer') || a.designation.toLowerCase().includes('sre'));
      } else if (r === 'product') {
        result = result.filter(a => a.designation.toLowerCase().includes('product') || a.designation.toLowerCase().includes('ux') || a.designation.toLowerCase().includes('design'));
      }
    }

    if (verified !== null && verified !== undefined) {
      result = result.filter(a => String(a.verified) === verified);
    }

    if (distinguished !== null && distinguished !== undefined) {
      result = result.filter(a => String(a.distinguished) === distinguished);
    }

    if (mentorship !== null && mentorship !== undefined) {
      result = result.filter(a => String(a.mentorship) === mentorship);
    }

    return Promise.resolve({ success: true, count: result.length, data: result });
  }

  // GET /alumni/queue
  if (pathname === '/alumni/queue' && method === 'GET') {
    return Promise.resolve({ success: true, count: fallbackQueue.length, data: fallbackQueue });
  }

  // POST /alumni/register
  if (pathname === '/alumni/register' && method === 'POST') {
    const payload = JSON.parse(options.body || '{}');
    const newItem = {
      id: 'q_' + Date.now(),
      name: payload.name || 'New Graduate',
      batch: Number(payload.batch) || 2026,
      company: payload.company || 'TBD',
      designation: payload.designation || 'Graduate Trainee',
      location: payload.location || 'India',
      registerNumber: payload.registerNumber || 'CS' + Date.now(),
      email: payload.email || '',
      phone: payload.phone || '',
      linkedin: payload.linkedin || '',
      bio: payload.bio || '',
      skills: payload.skills ? payload.skills.split(',').map(s => s.trim()) : [],
      achievements: payload.achievements ? [payload.achievements] : [],
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    };
    fallbackQueue.push(newItem);
    return Promise.resolve({ success: true, message: 'Registration application submitted to faculty coordinator.', data: newItem });
  }

  // PATCH /alumni/queue/:id/approve
  if (pathname.startsWith('/alumni/queue/') && pathname.endsWith('/approve') && method === 'PATCH') {
    const id = pathname.replace('/alumni/queue/', '').replace('/approve', '');
    const item = fallbackQueue.find(q => q.id === id);
    if (item) {
      fallbackQueue = fallbackQueue.filter(q => q.id !== id);
      const promoted = {
        ...item,
        id: 'a_' + Date.now(),
        verified: true,
        distinguished: false,
        mentorship: true,
        timeline: [{ year: String(item.batch), role: item.designation, company: item.company }]
      };
      fallbackAlumni.push(promoted);
      return Promise.resolve({ success: true, message: 'Alumni registration approved and added to active registry.', data: promoted });
    }
    return Promise.resolve({ success: false, message: 'Item not found in queue' });
  }

  // DELETE /alumni/queue/:id
  if (pathname.startsWith('/alumni/queue/') && method === 'DELETE') {
    const id = pathname.replace('/alumni/queue/', '');
    fallbackQueue = fallbackQueue.filter(q => q.id !== id);
    return Promise.resolve({ success: true, message: 'Registration request rejected.' });
  }

  // GET /alumni/:id
  if (pathname.startsWith('/alumni/') && method === 'GET') {
    const id = pathname.replace('/alumni/', '');
    const found = fallbackAlumni.find(a => a.id === id);
    if (found) {
      return Promise.resolve({ success: true, data: found });
    }
    return Promise.resolve({ success: false, message: 'Alumnus not found' });
  }

  // GET /stats
  if (pathname === '/stats' && method === 'GET') {
    const verifiedAlumni = fallbackAlumni.filter(a => a.verified);
    const totalAlumni = verifiedAlumni.length;
    const pendingCount = fallbackQueue.length;
    const uniqueCompanies = new Set(verifiedAlumni.map(a => a.company.trim()));
    const uniqueLocations = new Set(verifiedAlumni.map(a => a.location.split(',')[0].trim()));
    const mentorsCount = verifiedAlumni.filter(a => a.mentorship).length;

    const batchDistribution = {};
    verifiedAlumni.forEach(a => {
      batchDistribution[a.batch] = (batchDistribution[a.batch] || 0) + 1;
    });

    const companyDistribution = {};
    verifiedAlumni.forEach(a => {
      companyDistribution[a.company] = (companyDistribution[a.company] || 0) + 1;
    });

    const regionDistribution = {};
    verifiedAlumni.forEach(a => {
      let region = 'India';
      if (a.location.includes('USA')) region = 'United States';
      else if (a.location.includes('UK')) region = 'United Kingdom';
      else if (a.location.includes('EU') || a.location.includes('Europe')) region = 'Europe';
      regionDistribution[region] = (regionDistribution[region] || 0) + 1;
    });

    return Promise.resolve({
      success: true,
      stats: {
        totalAlumni,
        verifiedCount: totalAlumni,
        pendingCount,
        uniqueCompaniesCount: uniqueCompanies.size,
        uniqueRegionsCount: uniqueLocations.size,
        mentorsCount,
        batchDistribution,
        companyDistribution,
        regionDistribution
      }
    });
  }

  // GET /notifications
  if (pathname === '/notifications' && method === 'GET') {
    return Promise.resolve({ success: true, count: fallbackNotifications.length, data: fallbackNotifications });
  }

  // POST /notifications/mark-read
  if (pathname === '/notifications/mark-read' && method === 'POST') {
    fallbackNotifications = fallbackNotifications.map(n => ({ ...n, unread: false }));
    return Promise.resolve({ success: true, message: 'All notifications marked as read', data: fallbackNotifications });
  }

  // GET /opportunities
  if (pathname === '/opportunities' && method === 'GET') {
    return Promise.resolve({ success: true, count: fallbackOpportunities.length, data: fallbackOpportunities });
  }

  // POST /contact
  if (pathname === '/contact' && method === 'POST') {
    return Promise.resolve({ success: true, message: 'Contact message received successfully.' });
  }

  // POST /ai-chat
  if (pathname === '/ai-chat' && method === 'POST') {
    return Promise.resolve({
      success: true,
      reply: "Hello! I am the CS Alumni Portal AI Assistant. I can help you find alumni by skill, company, or batch, or provide guidance on placement and mentorship connections."
    });
  }

  return Promise.resolve({ success: true, data: [] });
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
