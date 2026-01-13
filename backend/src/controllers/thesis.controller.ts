import { Request, Response } from 'express';
import Student from '../models/Student.model';
import { AuthRequest } from '../types/auth.types';

/**
 * Link existing student to thesis supervision
 * POST /api/thesis/students
 */
export const addStudentToThesis = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;
    const { studentId } = req.body;

    if (!advisorId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    if (!studentId) {
      res.status(400).json({
        success: false,
        message: 'studentId is required'
      });
      return;
    }

    // Find student and verify ownership
    const student = await Student.findOne({
      student_id: studentId,
      advisor_id: advisorId
    });

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found or does not belong to this advisor'
      });
      return;
    }

    // Check if already linked to thesis
    if (student.thesisInfo) {
      res.status(400).json({
        success: false,
        message: 'Student is already linked to thesis supervision'
      });
      return;
    }

    // Initialize thesis info
    student.thesisInfo = {
      topicAssigned: false,
      topicName: '',
      defenseDate: '',
      assignedTask: '',
      meetingDateTime: ''
    };

    await student.save();

    res.status(200).json({
      success: true,
      data: student,
      message: 'Student added to thesis supervision successfully'
    });
  } catch (error: any) {
    console.error('Add student to thesis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add student to thesis supervision',
      error: error.message
    });
  }
};

/**
 * Update thesis information for a student
 * PUT /api/students/:id/thesis
 */
export const updateThesisInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;
    const studentId = req.params.id;

    if (!advisorId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    // Find student and verify ownership
    const student = await Student.findOne({
      student_id: studentId,
      advisor_id: advisorId
    });

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found'
      });
      return;
    }

    // Check if student has thesis info initialized
    // If not, initialize it (all batch 20-21 students are eligible for thesis)
    if (!student.thesisInfo) {
      console.log(`📝 [BACKEND] Initializing thesis info for student: ${student.name}`);
      student.thesisInfo = {
        topicAssigned: false,
        topicName: '',
        defenseDate: '',
        assignedTask: '',
        meetingDateTime: ''
      };
    }

    // Update thesis info with provided fields
    const allowedFields = ['topicAssigned', 'topicName', 'defenseDate', 'assignedTask', 'meetingDateTime'];
    
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key) && student.thesisInfo) {
        (student.thesisInfo as any)[key] = req.body[key];
      }
    });

    const updatedStudent = await student.save();

    // Return transformed student object using toJSON
    const transformedStudent = updatedStudent.toJSON();
    res.status(200).json({
      success: true,
      data: transformedStudent,
      message: 'Thesis information updated successfully'
    });
  } catch (error: any) {
    console.error('Update thesis info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update thesis information',
      error: error.message
    });
  }
};

/**
 * Remove student from thesis supervision
 * DELETE /api/thesis/students/:id
 */
export const removeStudentFromThesis = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;
    const studentId = req.params.id;

    if (!advisorId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    // Find student and verify ownership
    const student = await Student.findOne({
      student_id: studentId,
      advisor_id: advisorId
    });

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found'
      });
      return;
    }

    // Check if student has thesis info
    if (!student.thesisInfo) {
      res.status(400).json({
        success: false,
        message: 'Student is not linked to thesis supervision'
      });
      return;
    }

    // Remove thesis info
    student.thesisInfo = undefined;
    await student.save();

    res.status(200).json({
      success: true,
      data: true,
      message: 'Student removed from thesis supervision successfully'
    });
  } catch (error: any) {
    console.error('Remove student from thesis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove student from thesis supervision',
      error: error.message
    });
  }
};

/**
 * Get all thesis students for logged-in advisor
 * GET /api/thesis/students
 */
export const getThesisStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;

    if (!advisorId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    // Find all students with thesis info for this advisor
    const students = await Student.find({
      advisor_id: advisorId,
      thesisInfo: { $exists: true, $ne: null }
    }).sort({ student_id: 1 });

    res.status(200).json({
      success: true,
      data: students,
      message: 'Thesis students retrieved successfully'
    });
  } catch (error: any) {
    console.error('Get thesis students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch thesis students',
      error: error.message
    });
  }
};
