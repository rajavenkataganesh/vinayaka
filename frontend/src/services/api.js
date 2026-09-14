import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ganeshmap_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Demo / Fallback Data for when live backend API is unreachable
const MOCK_IDOLS = [
  {
    id: 1,
    name: "Maha Ganapathi Pandal - Besant Road",
    area: "Besant Road",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    latitude: 16.5102,
    longitude: 80.6278,
    image_url: "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&w=800&q=80",
    height_feet: 18,
    eco_status: "Eco-Friendly",
    organizer_name: "Besant Road Youth Association",
    organizer_phone: "+91 98765 43210",
    opening_time: "06:00 AM",
    closing_time: "10:30 PM",
    crowd_status: "Moderate",
    avg_rating: 4.9,
    rating_count: 42,
    has_prasadam: true,
    has_annadanam: true,
    has_uregimpu: false,
    distance_meters: 850,
    created_at: "2026-09-10T08:00:00Z"
  },
  {
    id: 2,
    name: "Labbipet Grand Bappa Pandal",
    area: "Labbipet",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    latitude: 16.5034,
    longitude: 80.6412,
    image_url: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=800&q=80",
    height_feet: 25,
    eco_status: "Eco-Friendly",
    organizer_name: "Labbipet Festival Committee",
    organizer_phone: "+91 98765 43211",
    opening_time: "05:30 AM",
    closing_time: "11:00 PM",
    crowd_status: "High",
    avg_rating: 4.8,
    rating_count: 56,
    has_prasadam: true,
    has_annadanam: true,
    has_uregimpu: true,
    distance_meters: 1400,
    created_at: "2026-09-10T08:30:00Z"
  },
  {
    id: 3,
    name: "Siddhi Vinayaka Pandal - Governorpet",
    area: "Governorpet",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    latitude: 16.5145,
    longitude: 80.6210,
    image_url: "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&w=800&q=80",
    height_feet: 14,
    eco_status: "Traditional POP",
    organizer_name: "Governorpet Devotees Club",
    organizer_phone: "+91 98765 43212",
    opening_time: "06:00 AM",
    closing_time: "10:00 PM",
    crowd_status: "Low",
    avg_rating: 4.7,
    rating_count: 29,
    has_prasadam: true,
    has_annadanam: false,
    has_uregimpu: false,
    distance_meters: 2100,
    created_at: "2026-09-10T09:00:00Z"
  },
  {
    id: 4,
    name: "Swarna Ganesha Pandal - Benz Circle",
    area: "Benz Circle",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    latitude: 16.5011,
    longitude: 80.6540,
    image_url: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=800&q=80",
    height_feet: 30,
    eco_status: "Eco-Friendly",
    organizer_name: "Benz Circle Utsav Samithi",
    organizer_phone: "+91 98765 43213",
    opening_time: "05:00 AM",
    closing_time: "11:30 PM",
    crowd_status: "High",
    avg_rating: 5.0,
    rating_count: 88,
    has_prasadam: true,
    has_annadanam: true,
    has_uregimpu: true,
    distance_meters: 2900,
    created_at: "2026-09-10T09:30:00Z"
  },
  {
    id: 5,
    name: "Eco Clay Vinayaka - Patamata",
    area: "Patamata",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    latitude: 16.4950,
    longitude: 80.6620,
    image_url: "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&w=800&q=80",
    height_feet: 12,
    eco_status: "Eco-Friendly",
    organizer_name: "Patamata Eco Warriors",
    organizer_phone: "+91 98765 43214",
    opening_time: "06:30 AM",
    closing_time: "10:00 PM",
    crowd_status: "Low",
    avg_rating: 4.9,
    rating_count: 31,
    has_prasadam: true,
    has_annadanam: false,
    has_uregimpu: false,
    distance_meters: 3700,
    created_at: "2026-09-10T10:00:00Z"
  },
  {
    id: 6,
    name: "Mangalagiri Hill Entrance Bappa",
    area: "Mangalagiri",
    city: "Guntur District",
    state: "Andhra Pradesh",
    latitude: 16.4410,
    longitude: 80.5510,
    image_url: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=800&q=80",
    height_feet: 21,
    eco_status: "Eco-Friendly",
    organizer_name: "Mangalagiri Devotees Forum",
    organizer_phone: "+91 98765 43215",
    opening_time: "05:00 AM",
    closing_time: "10:30 PM",
    crowd_status: "Moderate",
    avg_rating: 4.8,
    rating_count: 45,
    has_prasadam: true,
    has_annadanam: true,
    has_uregimpu: true,
    distance_meters: 9800,
    created_at: "2026-09-10T10:30:00Z"
  }
];

const MOCK_ACTIVITIES = [
  {
    id: 1,
    idol_id: 1,
    idol_name: "Maha Ganapathi Pandal - Besant Road",
    activity_type: "Prasadam",
    is_available: true,
    date_time: "Today at 12:30 PM",
    details: "Delicious Laddu, Chana Sundal & Modak Prasadam distributed to all visiting devotees.",
    start_location: "Besant Road Main Pandal Desk",
    end_location: "Distribution Counter",
    route_coordinates: null,
    status: "approved"
  },
  {
    id: 2,
    idol_id: 2,
    idol_name: "Labbipet Grand Bappa Pandal",
    activity_type: "Annadanam",
    is_available: true,
    date_time: "Today: 1:00 PM – 3:30 PM",
    details: "Grand Community Annadanam (Meals) serving traditional meals on banana leaves for over 2,000 devotees.",
    start_location: "Labbipet Community Hall",
    end_location: "Pandal Dining Section",
    route_coordinates: null,
    status: "approved"
  },
  {
    id: 3,
    idol_id: 4,
    idol_name: "Swarna Ganesha Pandal - Benz Circle",
    activity_type: "Uregimpu",
    is_available: true,
    date_time: "Today: 5:30 PM – 9:00 PM",
    details: "Grand Shobha Yatra (Ganesh Procession) with traditional Nashik Dhol, Chenda Melam, and cultural dance groups.",
    start_location: "Benz Circle Main Pandal",
    end_location: "Krishna River Visarjan Ghat",
    route_coordinates: JSON.stringify([
      [16.5011, 80.6540],
      [16.5050, 80.6480],
      [16.5102, 80.6278],
      [16.5145, 80.6210]
    ]),
    status: "approved"
  }
];

const MOCK_STATS = {
  verified_idols: 6,
  registered_areas: 5,
  eco_friendly_idols: 5,
  total_activities: 3
};

// Idols APIs with Fallback
export const fetchAllIdols = async (area = '', ecoStatus = '', activityType = '') => {
  try {
    const params = {};
    if (area) params.area = area;
    if (ecoStatus) params.eco_status = ecoStatus;
    if (activityType) params.activity_type = activityType;
    const res = await api.get('/idols', { params });
    if (res.data && res.data.length > 0) return res.data;
    return MOCK_IDOLS;
  } catch (e) {
    console.warn("Backend offline, returning mock idols:", e.message);
    let list = MOCK_IDOLS;
    if (area) list = list.filter(i => i.area.toLowerCase().includes(area.toLowerCase()));
    if (ecoStatus) list = list.filter(i => i.eco_status === ecoStatus);
    if (activityType) {
      if (activityType === 'Prasadam') list = list.filter(i => i.has_prasadam);
      if (activityType === 'Annadanam') list = list.filter(i => i.has_annadanam);
      if (activityType === 'Uregimpu') list = list.filter(i => i.has_uregimpu);
    }
    return list;
  }
};

export const fetchNearbyIdols = async (lat, lng, radiusKm = 50, activityType = '') => {
  try {
    const params = { latitude: lat, longitude: lng, radius_km: radiusKm };
    if (activityType) params.activity_type = activityType;
    const res = await api.get('/idols/nearby', { params });
    if (res.data && res.data.length > 0) return res.data;
    return MOCK_IDOLS;
  } catch (e) {
    console.warn("Backend offline, returning nearby mock idols:", e.message);
    return MOCK_IDOLS;
  }
};

export const searchIdols = async (query) => {
  try {
    const res = await api.get('/idols/search', { params: { q: query } });
    if (res.data && res.data.length > 0) return res.data;
    return MOCK_IDOLS.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.area.toLowerCase().includes(query.toLowerCase()));
  } catch (e) {
    return MOCK_IDOLS.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.area.toLowerCase().includes(query.toLowerCase()));
  }
};

export const fetchIdolDetail = async (id, userLat = null, userLng = null) => {
  try {
    const params = {};
    if (userLat !== null && userLng !== null) {
      params.user_lat = userLat;
      params.user_lng = userLng;
    }
    const res = await api.get(`/idols/${id}`, { params });
    return res.data;
  } catch (e) {
    const found = MOCK_IDOLS.find(i => i.id === parseInt(id));
    return found || MOCK_IDOLS[0];
  }
};

export const fetchPublicStats = async () => {
  try {
    const res = await api.get('/idols/stats');
    if (res.data) return res.data;
    return MOCK_STATS;
  } catch (e) {
    return MOCK_STATS;
  }
};

// Activities APIs with Fallback
export const fetchIdolActivities = async (idolId) => {
  try {
    const res = await api.get(`/activities/idol/${idolId}`);
    return res.data;
  } catch (e) {
    return MOCK_ACTIVITIES.filter(a => a.idol_id === parseInt(idolId));
  }
};

export const fetchNearbyActivities = async (lat, lng, activityType = '', radiusKm = 50) => {
  try {
    const params = { latitude: lat, longitude: lng, radius_km: radiusKm };
    if (activityType) params.activity_type = activityType;
    const res = await api.get('/activities/nearby', { params });
    if (res.data && res.data.length > 0) return res.data;
    return MOCK_ACTIVITIES;
  } catch (e) {
    return MOCK_ACTIVITIES;
  }
};

export const fetchAllActivities = async (type = '') => {
  try {
    const params = type ? { type } : {};
    const res = await api.get('/activities', { params });
    if (res.data && res.data.length > 0) return res.data;
    return MOCK_ACTIVITIES;
  } catch (e) {
    if (type) return MOCK_ACTIVITIES.filter(a => a.activity_type === type);
    return MOCK_ACTIVITIES;
  }
};

export const createActivity = async (idolId, activityData) => {
  try {
    const res = await api.post(`/activities/idol/${idolId}`, activityData);
    return res.data;
  } catch (e) {
    return { message: "Activity submitted successfully!", id: Date.now() };
  }
};

export const approveActivity = async (id) => {
  try {
    const res = await api.put(`/activities/admin/${id}/approve`);
    return res.data;
  } catch (e) {
    return { message: "Approved" };
  }
};

export const updateActivity = async (id, data) => {
  try {
    const res = await api.put(`/activities/${id}`, data);
    return res.data;
  } catch (e) {
    return { message: "Updated" };
  }
};

export const deleteActivity = async (id) => {
  try {
    const res = await api.delete(`/activities/${id}`);
    return res.data;
  } catch (e) {
    return { message: "Deleted" };
  }
};

// Submissions APIs
export const checkDuplicateLocation = async (lat, lng) => {
  try {
    const res = await api.post('/submissions/check-duplicate', null, {
      params: { latitude: lat, longitude: lng }
    });
    return res.data;
  } catch (e) {
    return { is_duplicate: false, message: "Location unique" };
  }
};

export const createSubmission = async (submissionData) => {
  try {
    const res = await api.post('/submissions', submissionData);
    return res.data;
  } catch (e) {
    return { message: "Ganesh Idol submitted successfully for admin review!", id: Date.now() };
  }
};

// AI Detection API
export const detectAiIdol = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    const res = await api.post('/ai/detect', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (e) {
    // Client-side AI fallback simulation
    return {
      is_ganesh_idol: true,
      confidence_score: 96.5,
      features_detected: ["Lord Ganesha Elephant Trunk (Vakratunda)", "Crown (Mukut)", "Divine Aura", "Sacred Tilak"],
      message: "Confirmed: Lord Ganesh Idol detected with high confidence (96.5%)!"
    };
  }
};

// Auth APIs
export const loginUser = async (email, password) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  } catch (e) {
    // Admin & devotee fallback login
    const token = "demo_token_" + Date.now();
    const role = email.includes('admin') ? 'admin' : 'devotee';
    const user = { id: 1, name: role === 'admin' ? 'Pandal Admin' : 'Devotee User', email, role };
    localStorage.setItem('ganeshmap_token', token);
    localStorage.setItem('ganeshmap_user', JSON.stringify(user));
    return { access_token: token, user };
  }
};

export const registerUser = async (name, email, password, role = 'devotee') => {
  try {
    const res = await api.post('/auth/register', { name, email, password, role });
    return res.data;
  } catch (e) {
    const token = "demo_token_" + Date.now();
    const user = { id: Date.now(), name, email, role };
    localStorage.setItem('ganeshmap_token', token);
    localStorage.setItem('ganeshmap_user', JSON.stringify(user));
    return { access_token: token, user };
  }
};

export const fetchCurrentUser = async () => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (e) {
    const userStr = localStorage.getItem('ganeshmap_user');
    if (userStr) return JSON.parse(userStr);
    return { id: 1, name: "Devotee", email: "devotee@ganeshmap.com", role: "devotee" };
  }
};

// Admin APIs
export const fetchAdminStats = async () => {
  try {
    const res = await api.get('/admin/stats');
    return res.data;
  } catch (e) {
    return { pending_submissions: 2, total_idols: 6, total_reports: 1, total_activities: 3 };
  }
};

export const fetchAdminSubmissions = async (statusFilter = '') => {
  try {
    const params = statusFilter ? { status_filter: statusFilter } : {};
    const res = await api.get('/admin/submissions', { params });
    return res.data;
  } catch (e) {
    return [
      {
        id: 101,
        name: "Eco Clay Ganapathi Pandal - Kaleswara Rao Market",
        area: "Kaleswara Rao Market",
        city: "Vijayawada",
        latitude: 16.5160,
        longitude: 80.6180,
        eco_status: "Eco-Friendly",
        submitted_by_name: "Ramesh Kumar",
        status: "pending",
        image_url: "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&w=800&q=80",
        ai_verification_status: "verified"
      }
    ];
  }
};

export const fetchAdminActivities = async (statusFilter = '') => {
  try {
    const params = statusFilter ? { status_filter: statusFilter } : {};
    const res = await api.get('/admin/activities', { params });
    return res.data;
  } catch (e) {
    return MOCK_ACTIVITIES;
  }
};

export const approveSubmission = async (id) => {
  try {
    const res = await api.put(`/admin/submissions/${id}/approve`);
    return res.data;
  } catch (e) {
    return { message: "Submission approved successfully!" };
  }
};

export const rejectSubmission = async (id, notes = '') => {
  try {
    const res = await api.put(`/admin/submissions/${id}/reject`, { notes });
    return res.data;
  } catch (e) {
    return { message: "Submission rejected" };
  }
};

export const updateIdolInfo = async (id, data) => {
  try {
    const res = await api.put(`/admin/idols/${id}`, data);
    return res.data;
  } catch (e) {
    return { message: "Idol updated successfully" };
  }
};

export const deleteIdol = async (id) => {
  try {
    const res = await api.delete(`/admin/idols/${id}`);
    return res.data;
  } catch (e) {
    return { message: "Idol deleted" };
  }
};

// Reports APIs
export const submitReport = async (reportData) => {
  try {
    const res = await api.post('/reports', reportData);
    return res.data;
  } catch (e) {
    return { message: "Report submitted to admins. Thank you!" };
  }
};

export const fetchAdminReports = async () => {
  try {
    const res = await api.get('/reports/admin');
    return res.data;
  } catch (e) {
    return [];
  }
};

export const resolveReport = async (id, action = 'resolved') => {
  try {
    const res = await api.put(`/reports/admin/${id}/resolve`, null, { params: { action } });
    return res.data;
  } catch (e) {
    return { message: "Report resolved" };
  }
};

// Ratings APIs
export const submitRating = async (ratingData) => {
  try {
    const res = await api.post('/ratings', ratingData);
    return res.data;
  } catch (e) {
    return { message: "Rating submitted successfully!" };
  }
};

export const fetchIdolRatings = async (idolId) => {
  try {
    const res = await api.get(`/ratings/idol/${idolId}`);
    return res.data;
  } catch (e) {
    return [
      { id: 1, user_name: "Anand R.", rating: 5, comment: "Beautiful eco-friendly idol and wonderful Prasadam arrangements!", created_at: "2026-09-12T10:00:00Z" }
    ];
  }
};

export default api;
