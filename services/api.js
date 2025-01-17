import { getToken } from './storage';

const API_URL = __DEV__ 
  ? `http://192.168.8.244:5000/api`
  : 'vlabpawm://api';

const apiRequest = async (endpoint, options = {}) => {
  try {
    console.log('API Request to:', API_URL + endpoint);
    console.log('Request options:', options);
    
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
    console.log('Response data:', data);

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

export const getAllQuizzes = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No auth token');
    }

    console.log('Fetching quizzes from:', `${API_URL}/quiz`);
    
    const response = await fetch(`${API_URL}/quiz`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Log response status dan headers untuk debugging
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Unexpected response format:', text);
      throw new Error('Server returned non-JSON response');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch quizzes');
    }

    console.log('Quiz data received:', data);
    return data;
  } catch (error) {
    console.error('Error getting quizzes:', error);
    // Throw error yang lebih deskriptif
    throw new Error(`Failed to fetch quizzes: ${error.message}`);
  }
};

export const getQuizByLessonId = async (lessonId) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No auth token');
    }

    const response = await fetch(`${API_URL}/api/quiz/${lessonId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch quiz');
    }

    return data;
  } catch (error) {
    console.error('Error getting quiz:', error);
    throw error;
  }
};

export const submitQuizResult = async (lessonId, score) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No auth token');
    }

    const response = await fetch(`${API_URL}/api/quiz/${lessonId}/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ score })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to submit quiz');
    }

    return data;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error;
  }
};

export default apiRequest;