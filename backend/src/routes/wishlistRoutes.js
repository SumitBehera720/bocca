import { Router } from 'express';
import { getWishlist, toggleWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(optionalAuth);
router.get('/', getWishlist);
router.post('/', toggleWishlist);
router.delete('/:id', removeFromWishlist);

export default router;
