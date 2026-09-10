import { Router } from 'express';
import { getCart, addToCart, updateQuantity, removeFromCart } from '../controllers/cartController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(optionalAuth);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateQuantity);
router.delete('/:id', removeFromCart);

export default router;
