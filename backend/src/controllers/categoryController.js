import { getAllCategories } from '../services/productService.js';
import { sendSuccess } from '../utils/responseHandler.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = getAllCategories();
    return sendSuccess(res, categories, 'Categories fetched successfully');
  } catch (error) {
    next(error);
  }
};
