import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  updateStudent,
  approveMultiple,
  generateApprovalContent,
  sendApprovalEmailToStudent
} from '../controllers/student.controller';
import { updateThesisInfo } from '../controllers/thesis.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Students
 *     description: Student management, approval, and AI-powered email generation endpoints
 */

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     description: Retrieve list of all students assigned to the authenticated advisor
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students retrieved successfully
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
 *                     $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getStudents);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get student by ID
 *     description: Retrieve detailed information about a specific student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *         example: "2104040"
 *     responses:
 *       200:
 *         description: Student details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getStudentById);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update student information
 *     description: Update student's registration status, approval status, or other information
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *         example: "2104040"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approval_status:
 *                 type: string
 *                 enum: [approved, pending, rejected]
 *                 example: approved
 *               registration_status:
 *                 type: string
 *                 enum: [registered, not_registered]
 *                 example: registered
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', updateStudent);

/**
 * @swagger
 * /api/students/{id}/thesis:
 *   put:
 *     summary: Update student thesis information
 *     description: Update thesis topic and status for a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *         example: "2104040"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               thesis_topic:
 *                 type: string
 *                 example: AI-based Student Performance Prediction
 *               thesis_status:
 *                 type: string
 *                 enum: [Not Assigned, In Progress, Completed]
 *                 example: In Progress
 *     responses:
 *       200:
 *         description: Thesis information updated successfully
 *       404:
 *         description: Student not found
 */
router.put('/:id/thesis', updateThesisInfo);

/**
 * @swagger
 * /api/students/approve-multiple:
 *   post:
 *     summary: Approve multiple students (bulk operation)
 *     description: Approve registration for multiple students at once
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentIds
 *             properties:
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["2104040", "2104041", "2104042"]
 *     responses:
 *       200:
 *         description: Students approved successfully
 *       400:
 *         description: Invalid request
 */
router.post('/approve-multiple', approveMultiple);

/**
 * @swagger
 * /api/students/generate-approval:
 *   post:
 *     summary: Generate AI-powered approval/disapproval email
 *     description: Generate personalized email content using AI (Ollama/Gemini) based on student's academic performance. Takes 6-18 seconds depending on AI model.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApprovalRequest'
 *     responses:
 *       200:
 *         description: Email content generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApprovalResponse'
 *       400:
 *         description: Invalid request or student has no published results
 *       404:
 *         description: Student not found
 *       500:
 *         description: AI generation failed
 */
router.post('/generate-approval', generateApprovalContent);

/**
 * @swagger
 * /api/students/send-approval-email:
 *   post:
 *     summary: Send approval/disapproval email to student
 *     description: Send the generated email content to student and update their approval status
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendEmailRequest'
 *     responses:
 *       200:
 *         description: Email sent and status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Approval email sent successfully. Student status updated to pending.
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Student not found
 *       500:
 *         description: Email sending failed
 */
router.post('/send-approval-email', sendApprovalEmailToStudent);

export default router;
