import { Router } from 'express';
import { login, getProfile, updatePassword } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', authMiddleware, getProfile);
router.put('/password', authMiddleware, updatePassword);

export default router;
