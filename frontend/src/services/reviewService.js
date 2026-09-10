import api from './api';

export const getReviews = async () => {
  try {
    const res = await api.get('/reviews');
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
  } catch (error) {
    console.warn('Failed to fetch reviews:', error.message);
  }
  return [];
};

export const deleteReview = async (id) => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data || res;
};

const reviewService = { getReviews, deleteReview };
export default reviewService;
