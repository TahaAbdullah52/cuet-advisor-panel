import { Router } from 'express';
import {
  getThesisStudents,
  addStudentToThesis,
  updateThesisInfo,
  removeStudentFromThesis
} from '../controllers/thesis.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Thesis
 *     description: Thesis supervision and management endpoints for batch 20-21 students
 */

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/thesis/students:
 *   get:
 *     summary: Get all thesis students
 *     description: Retrieve list of all students (batch 20-21) with their thesis information
 *     tags: [Thesis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thesis students retrieved successfully
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
 *                     $ref: '#/components/schemas/ThesisInfo'
 *       401:
 *         description: Unauthorized
 */
router.get('/students', getThesisStudents);

/**
 * @swagger
 * /api/thesis/students:
 *   post:
 *     summary: Add student to thesis supervision
 *     description: Assign a thesis topic to a student (batch 20-21 only)
 *     tags: [Thesis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - thesis_topic
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: "2004040"
 *               thesis_topic:
 *                 type: string
 *                 example: Machine Learning for Predictive Analytics
 *               thesis_status:
 *                 type: string
 *                 enum: [Not Assigned, In Progress, Completed]
 *                 example: In Progress
 *     responses:
 *       201:
 *         description: Thesis information added successfully
 *       400:
 *         description: Student not eligible for thesis or invalid data
 *       404:
 *         description: Student not found
 */
router.post('/students', addStudentToThesis);

/**
 * @swagger
 * /api/thesis/students/{id}:
 *   put:
 *     summary: Update thesis information
 *     description: Update thesis topic and/or status for a student
 *     tags: [Thesis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *         example: "2004040"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               thesis_topic:
 *                 type: string
 *                 example: Deep Learning for Image Recognition
 *               thesis_status:
 *                 type: string
 *                 enum: [Not Assigned, In Progress, Completed]
 *                 example: Completed
 *     responses:
 *       200:
 *         description: Thesis information updated successfully
 *       404:
 *         description: Student or thesis information not found
 */
router.put('/students/:id', updateThesisInfo);

/**
 * @swagger
 * /api/thesis/students/{id}:
 *   delete:
 *     summary: Remove student from thesis supervision
 *     description: Delete thesis information for a student
 *     tags: [Thesis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *         example: "2004040"
 *     responses:
 *       200:
 *         description: Thesis information removed successfully
 *       404:
 *         description: Thesis information not found
 */
router.delete('/students/:id', removeStudentFromThesis);

export default router;
