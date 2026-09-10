import api from './api';

export const register = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const subscribeNewsletter = async (email) => {
  const res = await api.post('/newsletter/subscribe', { email });
  return res.data;
};

const authService = {
  register,
  login,
  getMe,
  subscribeNewsletter,
};

export default authService;
