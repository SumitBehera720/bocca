import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Review from '../models/Review.js';

export const getProducts = (filters) => {
  return Product.findAll(filters);
};

export const getProductById = (id) => {
  const product = Product.findById(id);
  if (!product) {
    const error = new Error(`Product with ID ${id} not found.`);
    error.statusCode = 404;
    throw error;
  }
  return product;
};

export const addReview = ({ productId, userName, rating, comment }) => {
  // Ensure product exists
  getProductById(productId);
  return Review.create({ productId, userName, rating, comment });
};

export const getAllCategories = () => {
  return Category.findAll();
};

export const getAllBrands = () => {
  return Brand.findAll();
};
