import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// attach the user's token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dabms_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// if the server says the token is invalid, log the user out and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dabms_token');
      localStorage.removeItem('dabms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
