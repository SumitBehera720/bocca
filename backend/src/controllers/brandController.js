import { getAllBrands } from '../services/productService.js';
import { sendSuccess } from '../utils/responseHandler.js';

export const getBrands = async (req, res, next) => {
  try {
    const brands = getAllBrands();
    return sendSuccess(res, brands, 'Brands fetched successfully');
  } catch (error) {
    next(error);
  }
};
