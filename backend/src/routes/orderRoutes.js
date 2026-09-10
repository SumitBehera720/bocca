import { Router } from 'express';
import { createOrder, getOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { optionalAuth, authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/all', authenticate, requireAdmin, getAllOrders);
router.get('/:id', getOrder);
router.put('/:id/status', authenticate, requireAdmin, updateOrderStatus);

export default router;
