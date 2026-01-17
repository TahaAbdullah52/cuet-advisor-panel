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

/**
 * @swagger
 * tags:
 *   - name: Routine
 *     description: Class schedule and routine management endpoints
 */

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/routines:
 *   get:
 *     summary: Get all routines
 *     description: Retrieve advisor's class schedule/routine entries
 *     tags: [Routine]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Routines retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Routine'
 */
router.get('/', getRoutines);

/**
 * @swagger
 * /api/routines/{id}:
 *   get:
 *     summary: Get routine by ID
 *     description: Retrieve a specific routine entry
 *     tags: [Routine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Routine ID
 *     responses:
 *       200:
 *         description: Routine retrieved successfully
 *       404:
 *         description: Routine not found
 */
router.get('/:id', getRoutineById);

/**
 * @swagger
 * /api/routines:
 *   post:
 *     summary: Create new routine entry
 *     description: Add a new class schedule entry
 *     tags: [Routine]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day
 *               - time
 *               - courseCode
 *               - courseTitle
 *               - room
 *               - type
 *             properties:
 *               day:
 *                 type: string
 *                 enum: [Sunday, Monday, Tuesday, Wednesday, Thursday]
 *                 example: Monday
 *               time:
 *                 type: string
 *                 example: "10:00 AM"
 *               courseCode:
 *                 type: string
 *                 example: CSE 401
 *               courseTitle:
 *                 type: string
 *                 example: Software Engineering
 *               room:
 *                 type: string
 *                 example: Room 301
 *               type:
 *                 type: string
 *                 enum: [theory, lab]
 *                 example: theory
 *     responses:
 *       201:
 *         description: Routine created successfully
 *       400:
 *         description: Invalid data
 */
router.post('/', createRoutine);

/**
 * @swagger
 * /api/routines/{id}:
 *   put:
 *     summary: Update routine entry
 *     description: Modify an existing routine entry
 *     tags: [Routine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Routine ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *               time:
 *                 type: string
 *               courseCode:
 *                 type: string
 *               courseTitle:
 *                 type: string
 *               room:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Routine updated successfully
 *       404:
 *         description: Routine not found
 */
router.put('/:id', updateRoutine);

/**
 * @swagger
 * /api/routines/{id}:
 *   delete:
 *     summary: Delete routine entry
 *     description: Remove a class schedule entry
 *     tags: [Routine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Routine ID
 *     responses:
 *       200:
 *         description: Routine deleted successfully
 *       404:
 *         description: Routine not found
 */
router.delete('/:id', deleteRoutine);

/**
 * @swagger
 * /api/routines/{id}/entries:
 *   post:
 *     summary: Add routine entry (alternative method)
 *     description: Add a new entry to the routine collection
 *     tags: [Routine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Entry added successfully
 */
router.post('/:id/entries', addRoutineEntry);

/**
 * @swagger
 * /api/routines/{id}/entries/{entryIndex}:
 *   delete:
 *     summary: Remove routine entry by index
 *     description: Remove a specific entry from routine by its index
 *     tags: [Routine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Routine ID
 *       - in: path
 *         name: entryIndex
 *         required: true
 *         schema:
 *           type: integer
 *         description: Entry index to remove
 *     responses:
 *       200:
 *         description: Entry removed successfully
 *       404:
 *         description: Routine or entry not found
 */
router.delete('/:id/entries/:entryIndex', removeRoutineEntry);

export default router;
