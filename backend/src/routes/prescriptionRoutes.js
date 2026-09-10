import { Router } from 'express';
import { uploadPrescription, getPrescriptions, updatePrescriptionStatus } from '../controllers/prescriptionController.js';
import { optionalAuth, authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/upload', optionalAuth, uploadPrescription);
router.get('/', authenticate, requireAdmin, getPrescriptions);
router.put('/:id/status', authenticate, requireAdmin, updatePrescriptionStatus);

export default router;
