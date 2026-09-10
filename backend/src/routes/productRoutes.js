import { Router } from 'express';
import { getAllProducts, getSingleProduct, createProduct, updateProduct, deleteProduct, createProductReview } from '../controllers/productController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);
router.post('/', authenticate, requireAdmin, createProduct);
router.put('/:id', authenticate, requireAdmin, updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);
router.post('/:id/reviews', createProductReview);

export default router;
