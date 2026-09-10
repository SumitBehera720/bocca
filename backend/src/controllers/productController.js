import { getProducts, getProductById, addReview } from '../services/productService.js';
import Product from '../models/Product.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const { category, brand, search, isTopSaver, isBestSeller, requiresPrescription, limit, offset } = req.query;
    const products = getProducts({
      category,
      brand,
      search,
      isTopSaver: isTopSaver !== undefined ? isTopSaver === 'true' || isTopSaver === '1' : undefined,
      isBestSeller: isBestSeller !== undefined ? isBestSeller === 'true' || isBestSeller === '1' : undefined,
      requiresPrescription: requiresPrescription !== undefined ? requiresPrescription === 'true' || requiresPrescription === '1' : undefined,
      limit,
      offset
    });
    return sendSuccess(res, products, 'Pharmaceutical products fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getSingleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = getProductById(Number(id));
    return sendSuccess(res, product, 'Product fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { productName, image, packSize, brandName, manufacturer, description, uses, howToUse, requiresPrescription, price, oldPrice, stock, sku } = req.body;
    if (!productName || !price || !image) {
      return sendError(res, 'Product name, price, and image are required.', 400);
    }
    const product = Product.create({
      productName,
      image,
      packSize: packSize || '1 Pack',
      brandName: brandName || '',
      manufacturer: manufacturer || '',
      description: description || '',
      uses: uses || '',
      howToUse: howToUse || '',
      requiresPrescription: requiresPrescription || 0,
      price: Number(price),
      oldPrice: Number(oldPrice) || 0,
      stock: Number(stock) || 100,
      sku: sku || 'MED-' + Date.now()
    });
    return sendSuccess(res, product, 'Medicine added successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = Product.update(Number(id), req.body);
    if (!updated) {
      return sendError(res, 'Product not found', 404);
    }
    return sendSuccess(res, updated, 'Medicine updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    Product.delete(Number(id));
    return sendSuccess(res, null, 'Medicine deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const createProductReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userName, rating, comment } = req.body;
    if (!userName || !rating) {
      return sendError(res, 'User name and rating are required.', 400);
    }
    const review = addReview({
      productId: Number(id),
      userName,
      rating: Number(rating),
      comment: comment || ''
    });
    return sendSuccess(res, review, 'Review added successfully', 201);
  } catch (error) {
    next(error);
  }
};
