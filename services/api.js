import { getToken } from './storage';

const API_URL = 'https://vlab-backup.up.railway.app/api';

const apiRequest = async (endpoint, options = {}) => {
  try {
    // console.log('API Request to:', API_URL + endpoint);
    // console.log('Request options:', options);
    
    const token = await getToken();
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const data = await response.json();
    // console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.error?.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

export const register = async (username, email, password) => {
  return await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  });
};

export const login = async (email, password) => {
  return await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
};

export const updateTheme = async (theme) => {
  return await apiRequest('/auth/theme', {
    method: 'PUT',
    body: JSON.stringify({ theme })
  });
};

export const getUserProfile = async () => {
  return await apiRequest('/auth/profile', {
    method: 'GET'
  });
};

export const logout = async () => {
  return await apiRequest('/auth/logout', {
    method: 'POST',
  });
};

// Lesson
export const getAllLessons = async () => {
    return await apiRequest('/lesson', {
      method: 'GET'
    });
  };
  
export const getLessonById = async (lessonId) => {
  return await apiRequest(`/lesson/${lessonId}`, {
    method: 'GET'
  });
};

// Quiz
export const getAllQuizzes = async () => {
  return await apiRequest('/quiz', {
    method: 'GET'
  });
};

export const getQuizByLessonId = async (lessonId) => {
  return await apiRequest(`/quiz/${lessonId}`, {
    method: 'GET'
  });
};

export const submitQuizResult = async (lessonId, score) => {
  return await apiRequest(`/quiz/${lessonId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ score })
  });
};

export default apiRequest;