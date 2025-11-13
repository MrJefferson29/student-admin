import axios from 'axios';

// API Configuration - Update this URL to match your backend
const API_URL ='https://uba-r875.onrender.com';

export const resolveAssetUrl = (value) => {
  if (!value) return null;

  if (typeof value === 'object') {
    const candidate = value.url || value.secure_url || value.path;
    if (!candidate) return null;
    return /^https?:\/\//i.test(candidate) ? candidate : `${API_URL}${candidate}`;
  }

  if (typeof value === 'string') {
    return /^https?:\/\//i.test(value) ? value : `${API_URL}${value}`;
  }

  return null;
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', {
      ...userData,
      source: 'website', // Mark as website registration
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
      source: 'website', // Mark as website login
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Profile API
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (formData) => {
    const response = await api.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/profile/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getProfileStats: async () => {
    const response = await api.get('/auth/profile/stats');
    return response.data;
  },
};

// Questions API
export const questionsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.school) params.append('school', filters.school);
    if (filters.department) params.append('department', filters.department);
    if (filters.level) params.append('level', filters.level);
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.year) params.append('year', filters.year);

    const response = await api.get(`/questions?${params.toString()}`);
    return response.data;
  },

  getById: async (questionId) => {
    const response = await api.get(`/questions/${questionId}`);
    return response.data;
  },

  upload: async (formData) => {
    const response = await api.post('/questions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (questionId) => {
    const response = await api.delete(`/questions/${questionId}`);
    return response.data;
  },
};

// Solutions API
export const solutionsAPI = {
  getAll: async (questionId = null) => {
    const params = questionId ? `?questionId=${questionId}` : '';
    const response = await api.get(`/solutions${params}`);
    return response.data;
  },

  getById: async (solutionId) => {
    const response = await api.get(`/solutions/${solutionId}`);
    return response.data;
  },

  upload: async (formData) => {
    const response = await api.post('/solutions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (solutionId) => {
    const response = await api.delete(`/solutions/${solutionId}`);
    return response.data;
  },
};

// Scholarships API
export const scholarshipsAPI = {
  // Get all scholarships
  getAll: async () => {
    const response = await api.get('/scholarships');
    return response.data;
  },

  // Get single scholarship
  getById: async (scholarshipId) => {
    const response = await api.get(`/scholarships/${scholarshipId}`);
    return response.data;
  },

  // Upload scholarship
  upload: async (formData) => {
    const response = await api.post('/scholarships', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update scholarship
  update: async (scholarshipId, formData) => {
    const response = await api.put(`/scholarships/${scholarshipId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete scholarship
  delete: async (scholarshipId) => {
    const response = await api.delete(`/scholarships/${scholarshipId}`);
    return response.data;
  },

  // Delete image from scholarship
  deleteImage: async (scholarshipId, image) => {
    const payload = image && typeof image === 'object'
      ? {
          imagePublicId: image.publicId,
          imageUrl: image.url,
        }
      : { imageUrl: image };

    const response = await api.delete(`/scholarships/${scholarshipId}/image`, {
      data: payload,
    });
    return response.data;
  },
};

// Internships API
export const internshipsAPI = {
  // Get all internships
  getAll: async () => {
    const response = await api.get('/internships');
    return response.data;
  },

  // Get single internship
  getById: async (internshipId) => {
    const response = await api.get(`/internships/${internshipId}`);
    return response.data;
  },

  // Upload internship
  upload: async (formData) => {
    const response = await api.post('/internships', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update internship
  update: async (internshipId, formData) => {
    const response = await api.put(`/internships/${internshipId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete internship
  delete: async (internshipId) => {
    const response = await api.delete(`/internships/${internshipId}`);
    return response.data;
  },
};

// Contests API
export const contestsAPI = {
  // Get all contests
  getAll: async () => {
    const response = await api.get('/contests');
    return response.data;
  },

  // Get contestants for a contest
  getContestants: async (contestId) => {
    const response = await api.get(`/contests/${contestId}/contestants`);
    return response.data;
  },

  // Get contest statistics
  getStats: async (contestId) => {
    const response = await api.get(`/contests/${contestId}/stats`);
    return response.data;
  },
};

// Votes API
export const votesAPI = {
  // Cast a vote
  castVote: async (contestId, contestantId) => {
    const response = await api.post('/votes', { contestId, contestantId });
    return response.data;
  },

  // Get user's votes
  getMyVotes: async () => {
    const response = await api.get('/votes/my-votes');
    return response.data;
  },
};

export { API_URL };
export default api;

