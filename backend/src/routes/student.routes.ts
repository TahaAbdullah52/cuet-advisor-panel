import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  updateStudent,
  approveMultiple
} from '../controllers/student.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Student routes
router.get('/', getStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.post('/approve-multiple', approveMultiple);

export default router;
