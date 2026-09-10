import api from './api';

export const getCart = async () => {
  const res = await api.get('/cart');
  return res.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await api.post('/cart', { productId, quantity });
  return res.data;
};

export const updateCartItem = async (cartItemId, quantity) => {
  const res = await api.put(`/cart/${cartItemId}`, { quantity });
  return res.data;
};

export const removeCartItem = async (cartItemId) => {
  const res = await api.delete(`/cart/${cartItemId}`);
  return res.data;
};

export const getWishlist = async () => {
  const res = await api.get('/wishlist');
  return res.data;
};

export const toggleWishlist = async (productId) => {
  const res = await api.post('/wishlist', { productId });
  return res.data;
};

export const removeWishlist = async (wishlistId) => {
  const res = await api.delete(`/wishlist/${wishlistId}`);
  return res.data;
};

export const createOrder = async (orderData) => {
  const res = await api.post('/orders', orderData);
  return res.data;
};
