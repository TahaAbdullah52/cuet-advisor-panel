import { Request, Response } from 'express';
import Student from '../models/Student.model';
import { AuthRequest } from '../types/auth.types';
import { generateApprovalEmail } from '../services/gemini.service';

/**
 * Get all students for logged-in advisor
 * GET /api/students
 * Query params: batch, status, thesis
 */
export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;

    if (!advisorId) {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
      return;
    }

    // Build query
    const query: any = { advisor_id: advisorId };

    // Filter by batch
    if (req.query.batch) {
      query.batch = req.query.batch;
    }

    // Filter by approval status
    if (req.query.status) {
      query.approval_status = req.query.status;
    }

    // Filter for thesis-eligible students (optional feature)
    // Only students from batch 20-21 who are still active
    if (req.query.thesis === 'true') {
      query.batch = { $in: ['20', '21'] };
      query.graduation_status = 'active';
    }

    // Fetch students
    const students = await Student.find(query).sort({ student_id: 1 });

    res.status(200).json({
      status: 'success',
      data: students,
      message: 'Students retrieved successfully'
    });
  } catch (error: any) {
    console.error('Get students error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

/**
 * Get single student by ID
 * GET /api/students/:id
 */
export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;
    const studentId = req.params.id;

    if (!advisorId) {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
      return;
    }

    // Find student with security check (must belong to this advisor)
    const student = await Student.findOne({
      student_id: studentId,
      advisor_id: advisorId
    });

    if (!student) {
      res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: student,
      message: 'Student retrieved successfully'
    });
  } catch (error: any) {
    console.error('Get student error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch student',
      error: error.message
    });
  }
};

/**
 * Update student information
 * PUT /api/students/:id
 */
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;
    const studentId = req.params.id;

    if (!advisorId) {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
      return;
    }

    // Find student with security check
    const student = await Student.findOne({
      student_id: studentId,
      advisor_id: advisorId
    });

    if (!student) {
      res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
      return;
    }

    // Update allowed fields
    const allowedUpdates = ['approval_status', 'approval_note'];
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        (student as any)[key] = req.body[key];
      }
    });

    // Set approval date if status changed
    if (req.body.approval_status) {
      student.approval_date = new Date();
    }

    await student.save();

    res.status(200).json({
      status: 'success',
      data: student,
      message: 'Student updated successfully'
    });
  } catch (error: any) {
    console.error('Update student error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update student',
      error: error.message
    });
  }
};

/**
 * Bulk approve multiple students
 * POST /api/students/approve-multiple
 */
export const approveMultiple = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;
    const { studentIds } = req.body;

    if (!advisorId) {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
      return;
    }

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'studentIds array is required'
      });
      return;
    }

    // Bulk update - only students owned by this advisor
    const result = await Student.updateMany(
      {
        student_id: { $in: studentIds },
        advisor_id: advisorId
      },
      {
        $set: {
          approval_status: 'approved',
          approval_date: new Date()
        }
      }
    );

    // Fetch updated students
    const updatedStudents = await Student.find({
      student_id: { $in: studentIds },
      advisor_id: advisorId
    });

    res.status(200).json({
      status: 'success',
      data: updatedStudents,
      message: `${result.modifiedCount} students approved successfully`
    });
  } catch (error: any) {
    console.error('Approve multiple error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to approve students',
      error: error.message
    });
  }
};
/**
 * Generate approval/disapproval email content using Gemini AI
 * POST /api/students/generate-approval
 */
export const generateApprovalContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;
    const { studentId, newStatus } = req.body;

    if (!advisorId) {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
      return;
    }

    // Validate newStatus
    if (!newStatus || !['approved', 'rejected'].includes(newStatus)) {
      res.status(400).json({
        status: 'error',
        message: 'newStatus must be either "approved" or "rejected"'
      });
      return;
    }

    // Find student with security check
    const student = await Student.findOne({
      student_id: studentId,
      advisor_id: advisorId
    });

    if (!student) {
      res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
      return;
    }

    // Get latest term with results
    // Find the last term that has courses (results published)
    const terms = ['L4T2', 'L4T1', 'L3T2', 'L3T1', 'L2T2', 'L2T1', 'L1T2', 'L1T1'];
    let latestTerm: string | null = null;
    let latestGPA: number | null = null;

    for (const termKey of terms) {
      const term = (student as any)[termKey];
      if (term && term.courses && term.courses.length > 0) {
        latestTerm = termKey;
        latestGPA = term.term_gpa || 0;
        break;
      }
    }

    if (!latestTerm) {
      res.status(400).json({
        status: 'error',
        message: 'No published term results found for this student'
      });
      return;
    }

    // Generate email content using Gemini
    const generatedContent = await generateApprovalEmail(
      student.name,
      latestTerm,
      latestGPA || 0,
      student.cgpa || 0,
      newStatus as 'approved' | 'rejected'
    );

    res.status(200).json({
      status: 'success',
      data: {
        generatedContent
      },
      message: 'Content generated successfully'
    });

  } catch (error: any) {
    console.error('Generate approval content error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to generate content',
      error: error.message
    });
  }
};