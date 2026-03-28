import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Change to your backend URL and port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const login = async (email: string, password: string) => {
  const response = await api.post('/api/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

// Example: Fetch all users (adjust endpoint as needed)
export const fetchUsers = async () => {
  const response = await api.get('/api/users');
  return response.data;
};


// Fetch menu items from backend

// Use public endpoint for menu
export const fetchMenu = async () => {
  const response = await api.get('/api/menu/public');
  return response.data;
};

// Fetch categories from backend

// Use public endpoint for categories
export const fetchCategories = async () => {
  const response = await api.get('/api/categories/public');
  return response.data;
};

export default api;
