import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Token to requests if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ganeshmap_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Idols APIs
export const fetchAllIdols = async (area = '', ecoStatus = '') => {
  const params = {};
  if (area) params.area = area;
  if (ecoStatus) params.eco_status = ecoStatus;
  const res = await api.get('/idols', { params });
  return res.data;
};

export const fetchNearbyIdols = async (lat, lng, radiusKm = 50) => {
  const res = await api.get('/idols/nearby', {
    params: { latitude: lat, longitude: lng, radius_km: radiusKm }
  });
  return res.data;
};

export const searchIdols = async (query) => {
  const res = await api.get('/idols/search', { params: { q: query } });
  return res.data;
};

export const fetchIdolDetail = async (id, userLat = null, userLng = null) => {
  const params = {};
  if (userLat !== null && userLng !== null) {
    params.user_lat = userLat;
    params.user_lng = userLng;
  }
  const res = await api.get(`/idols/${id}`, { params });
  return res.data;
};

export const fetchPublicStats = async () => {
  const res = await api.get('/idols/stats');
  return res.data;
};

// Submissions APIs
export const checkDuplicateLocation = async (lat, lng) => {
  const res = await api.post('/submissions/check-duplicate', null, {
    params: { latitude: lat, longitude: lng }
  });
  return res.data;
};

export const createSubmission = async (submissionData) => {
  const res = await api.post('/submissions', submissionData);
  return res.data;
};

// AI Detection API
export const detectAiIdol = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const res = await api.post('/ai/detect', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

// Auth APIs
export const loginUser = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const registerUser = async (name, email, password, role = 'user') => {
  const res = await api.post('/auth/register', { name, email, password, role });
  return res.data;
};

export const fetchCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

// Admin APIs
export const fetchAdminStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

export const fetchAdminSubmissions = async (statusFilter = '') => {
  const params = statusFilter ? { status_filter: statusFilter } : {};
  const res = await api.get('/admin/submissions', { params });
  return res.data;
};

export const approveSubmission = async (id) => {
  const res = await api.put(`/admin/submissions/${id}/approve`);
  return res.data;
};

export const rejectSubmission = async (id, notes = '') => {
  const res = await api.put(`/admin/submissions/${id}/reject`, { notes });
  return res.data;
};

export const updateIdolInfo = async (id, data) => {
  const res = await api.put(`/admin/idols/${id}`, data);
  return res.data;
};

export const deleteIdol = async (id) => {
  const res = await api.delete(`/admin/idols/${id}`);
  return res.data;
};

// Reports APIs
export const submitReport = async (reportData) => {
  const res = await api.post('/reports', reportData);
  return res.data;
};

export const fetchAdminReports = async () => {
  const res = await api.get('/reports/admin');
  return res.data;
};

export const resolveReport = async (id, action = 'resolved') => {
  const res = await api.put(`/reports/admin/${id}/resolve`, null, { params: { action } });
  return res.data;
};

// Ratings APIs
export const submitRating = async (ratingData) => {
  const res = await api.post('/ratings', ratingData);
  return res.data;
};

export const fetchIdolRatings = async (idolId) => {
  const res = await api.get(`/ratings/idol/${idolId}`);
  return res.data;
};

export default api;
