import api from './api';

export const getUsers = async () => {
  try {
    const res = await api.get('/users');
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
  } catch (error) {
    console.warn('Failed to fetch users:', error.message);
  }
  return [
    { id: 1, name: 'Dr. Pharmacist Admin', email: 'admin@farmart.com', role: 'admin', created_at: '2026-09-08' },
    { id: 2, name: 'John Customer', email: 'customer@farmart.com', role: 'customer', created_at: '2026-09-08' }
  ];
};

export const updateUserRole = async (id, role) => {
  const res = await api.patch(`/users/${id}/role`, { role });
  return res.data || res;
};

const userService = { getUsers, updateUserRole };
export default userService;
