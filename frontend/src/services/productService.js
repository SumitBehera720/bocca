import api from './api';
import { fallbackProducts, fallbackCategories, fallbackBrands } from './fallbackData';

export const getProducts = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.brand) query.append('brand', params.brand);
    if (params.search) query.append('search', params.search);
    if (params.requiresPrescription !== undefined && params.requiresPrescription !== '') {
      query.append('requiresPrescription', params.requiresPrescription);
    }
    if (params.isTopSaver !== undefined) query.append('isTopSaver', params.isTopSaver);
    if (params.isBestSeller !== undefined) query.append('isBestSeller', params.isBestSeller);
    if (params.limit) query.append('limit', params.limit);
    
    const res = await api.get(`/products?${query.toString()}`);
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
    if (res && typeof res === 'object') return res;
  } catch (error) {
    console.warn('Backend API request failed, using fallback pharmacy catalog:', error.message);
  }

  // Fallback filtering
  let filtered = [...fallbackProducts];
  if (params.category) {
    filtered = filtered.filter(p => p.categories?.some(c => c.slug === params.category || c.id === Number(params.category)));
  }
  if (params.brand) {
    filtered = filtered.filter(p => p.brand === params.brand || p.manufacturer === params.brand);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(p => p.productName.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (params.isTopSaver !== undefined) {
    const isTop = params.isTopSaver === true || params.isTopSaver === 'true' || params.isTopSaver === 1 || params.isTopSaver === '1';
    filtered = filtered.filter(p => Boolean(p.isTopSaver) === isTop);
  }
  if (params.isBestSeller !== undefined) {
    const isBest = params.isBestSeller === true || params.isBestSeller === 'true' || params.isBestSeller === 1 || params.isBestSeller === '1';
    filtered = filtered.filter(p => Boolean(p.isBestSeller) === isBest);
  }
  if (params.requiresPrescription !== undefined && params.requiresPrescription !== '') {
    const req = params.requiresPrescription === true || params.requiresPrescription === 'true' || params.requiresPrescription === 1 || params.requiresPrescription === '1';
    filtered = filtered.filter(p => Boolean(p.requiresPrescription) === req);
  }
  if (params.limit) {
    filtered = filtered.slice(0, Number(params.limit));
  }
  return filtered;
};

export const getProductById = async (id) => {
  try {
    const res = await api.get(`/products/${id}`);
    if (res?.data) return res.data;
    if (res) return res;
  } catch (error) {
    console.warn('Backend API request failed, using fallback product detail:', error.message);
  }
  return fallbackProducts.find(p => p.id === Number(id)) || null;
};

export const createProduct = async (productData) => {
  const res = await api.post('/products', productData);
  return res.data || res;
};

export const updateProduct = async (id, productData) => {
  const res = await api.put(`/products/${id}`, productData);
  return res.data || res;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data || res;
};

export const addProductReview = async (productId, reviewData) => {
  try {
    const res = await api.post(`/products/${productId}/reviews`, reviewData);
    return res.data || res;
  } catch (error) {
    console.warn('Review submission offline:', error.message);
    return { ...reviewData, id: Date.now() };
  }
};

export const getCategories = async () => {
  try {
    const res = await api.get('/categories');
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
  } catch (error) {
    console.warn('Backend API request failed, using fallback categories:', error.message);
  }
  return fallbackCategories;
};

export const getBrands = async () => {
  try {
    const res = await api.get('/brands');
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
  } catch (error) {
    console.warn('Backend API request failed, using fallback brands:', error.message);
  }
  return fallbackBrands;
};

const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getCategories,
  getBrands,
};

export default productService;
