import { Router } from 'express';
import {
  getThesisStudents,
  addStudentToThesis,
  updateThesisInfo,
  removeStudentFromThesis
} from '../controllers/thesis.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Thesis routes
router.get('/students', getThesisStudents);
router.post('/students', addStudentToThesis);
router.put('/students/:id', updateThesisInfo);
router.delete('/students/:id', removeStudentFromThesis);

export default router;
