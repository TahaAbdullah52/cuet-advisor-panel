import { Router } from 'express';
import {
  getRoutines,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  addRoutineEntry,
  removeRoutineEntry
} from '../controllers/routine.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Routine routes
router.get('/', getRoutines);
router.get('/:id', getRoutineById);
router.post('/', createRoutine);
router.put('/:id', updateRoutine);
router.delete('/:id', deleteRoutine);

// Entry management routes
router.post('/:id/entries', addRoutineEntry);
router.delete('/:id/entries/:entryIndex', removeRoutineEntry);

export default router;
