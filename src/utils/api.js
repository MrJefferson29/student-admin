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
    // Don't override Content-Type for FormData - let axios set it automatically with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
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

  // Create contest
  create: async (contestData) => {
    const response = await api.post('/contests', contestData);
    return response.data;
  },

  // Update contest
  update: async (contestId, contestData) => {
    const response = await api.put(`/contests/${contestId}`, contestData);
    return response.data;
  },

  // Delete contest
  delete: async (contestId) => {
    const response = await api.delete(`/contests/${contestId}`);
    return response.data;
  },

  // Add contestant
  addContestant: async (contestId, formData) => {
    const response = await api.post(`/contests/${contestId}/contestants`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete contestant
  deleteContestant: async (contestantId) => {
    const response = await api.delete(`/contests/contestants/${contestantId}`);
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

// Schools API
export const schoolsAPI = {
  getAll: async () => {
    const response = await api.get('/schools');
    return response.data;
  },

  getById: async (schoolId) => {
    const response = await api.get(`/schools/${schoolId}`);
    return response.data;
  },

  create: async (schoolData) => {
    const response = await api.post('/schools', schoolData);
    return response.data;
  },

  update: async (schoolId, schoolData) => {
    const response = await api.put(`/schools/${schoolId}`, schoolData);
    return response.data;
  },

  delete: async (schoolId) => {
    const response = await api.delete(`/schools/${schoolId}`);
    return response.data;
  },
};

// Departments API
export const departmentsAPI = {
  getAll: async (schoolId = null) => {
    const params = schoolId ? `?school=${schoolId}` : '';
    const response = await api.get(`/departments${params}`);
    return response.data;
  },

  getById: async (departmentId) => {
    const response = await api.get(`/departments/${departmentId}`);
    return response.data;
  },

  create: async (departmentData) => {
    const response = await api.post('/departments', departmentData);
    return response.data;
  },

  update: async (departmentId, departmentData) => {
    const response = await api.put(`/departments/${departmentId}`, departmentData);
    return response.data;
  },

  delete: async (departmentId) => {
    const response = await api.delete(`/departments/${departmentId}`);
    return response.data;
  },
};

// Courses API
export const coursesAPI = {
  getAll: async (departmentId = null, level = null) => {
    const params = new URLSearchParams();
    if (departmentId) params.append('department', departmentId);
    if (level) params.append('level', level);
    const response = await api.get(`/courses?${params.toString()}`);
    return response.data;
  },

  getById: async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/courses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (courseId, formData) => {
    const response = await api.put(`/courses/${courseId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (courseId) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  },
};

// Course Chapters API
export const courseChaptersAPI = {
  getByCourse: async (courseId) => {
    const response = await api.get(`/course-chapters/course/${courseId}`);
    return response.data;
  },

  getById: async (chapterId) => {
    const response = await api.get(`/course-chapters/${chapterId}`);
    return response.data;
  },

  create: async (chapterData) => {
    const response = await api.post('/course-chapters', chapterData);
    return response.data;
  },

  update: async (chapterId, chapterData) => {
    const response = await api.put(`/course-chapters/${chapterId}`, chapterData);
    return response.data;
  },

  delete: async (chapterId) => {
    const response = await api.delete(`/course-chapters/${chapterId}`);
    return response.data;
  },
};

// Concours API
export const concoursAPI = {
  getAll: async (departmentId = null, year = null) => {
    const params = new URLSearchParams();
    if (departmentId) params.append('department', departmentId);
    if (year) params.append('year', year);
    const response = await api.get(`/concours?${params.toString()}`);
    return response.data;
  },

  getById: async (concoursId) => {
    const response = await api.get(`/concours/${concoursId}`);
    return response.data;
  },

  upload: async (formData) => {
    const response = await api.post('/concours', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (concoursId, formData) => {
    const response = await api.put(`/concours/${concoursId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (concoursId) => {
    const response = await api.delete(`/concours/${concoursId}`);
    return response.data;
  },
};

// Skills API
export const skillsAPI = {
  getAll: async (category = null) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    const response = await api.get(`/skills?${params.toString()}`);
    return response.data;
  },

  getById: async (skillId) => {
    const response = await api.get(`/skills/${skillId}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/skills', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (skillId, formData) => {
    const response = await api.put(`/skills/${skillId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (skillId) => {
    const response = await api.delete(`/skills/${skillId}`);
    return response.data;
  },
};

// Live Sessions API
export const liveSessionsAPI = {
  getAll: async (params = {}) => {
    const search = new URLSearchParams(params);
    const query = search.toString();
    const response = await api.get(`/live-sessions${query ? `?${query}` : ''}`);
    return response.data;
  },

  getById: async (sessionId) => {
    const response = await api.get(`/live-sessions/${sessionId}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post('/live-sessions', payload);
    return response.data;
  },

  update: async (sessionId, payload) => {
    const response = await api.put(`/live-sessions/${sessionId}`, payload);
    return response.data;
  },

  start: async (sessionId) => {
    const response = await api.patch(`/live-sessions/${sessionId}/start`);
    return response.data;
  },

  end: async (sessionId) => {
    const response = await api.patch(`/live-sessions/${sessionId}/end`);
    return response.data;
  },

  delete: async (sessionId) => {
    const response = await api.delete(`/live-sessions/${sessionId}`);
    return response.data;
  },
};

// Library API
export const libraryAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.author) params.append('author', filters.author);
    if (filters.query) params.append('query', filters.query);
    const response = await api.get(`/library?${params.toString()}`);
    return response.data;
  },

  getById: async (bookId) => {
    const response = await api.get(`/library/${bookId}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/library', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (bookId, formData) => {
    const response = await api.put(`/library/${bookId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (bookId) => {
    const response = await api.delete(`/library/${bookId}`);
    return response.data;
  },
};

export { API_URL };
export default api;

