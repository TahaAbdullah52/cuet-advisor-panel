import { Request, Response } from 'express';
import Student from '../models/Student.model';
import { AuthRequest } from '../types/auth.types';
import { generateApprovalEmail } from '../services/gemini.service';
import { sendApprovalEmail } from '../services/email.service';

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
        success: false,
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
      success: true,
      data: students,
      message: 'Students retrieved successfully'
    });
  } catch (error: any) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
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
        success: false,
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
        success: false,
        message: 'Student not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: student,
      message: 'Student retrieved successfully'
    });
  } catch (error: any) {
    console.error('Get student error:', error);
    res.status(500).json({
      success: false,
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
        success: false,
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
        success: false,
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
      success: true,
      data: student,
      message: 'Student updated successfully'
    });
  } catch (error: any) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
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
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      res.status(400).json({
        success: false,
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
      success: true,
      data: updatedStudents,
      message: `${result.modifiedCount} students approved successfully`
    });
  } catch (error: any) {
    console.error('Approve multiple error:', error);
    res.status(500).json({
      success: false,
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
    console.log('🟢 [BACKEND] generateApprovalContent endpoint called');
    const advisorId = (req as unknown as AuthRequest).advisor?.id;
    const { studentId, newStatus } = req.body;
    console.log('Request body:', { studentId, newStatus });
    console.log('Advisor ID:', advisorId);

    if (!advisorId) {
      console.error('❌ [BACKEND] Unauthorized - no advisor ID');
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    // Validate newStatus
    if (!newStatus || !['approved', 'rejected'].includes(newStatus)) {
      console.error('❌ [BACKEND] Invalid newStatus:', newStatus);
      res.status(400).json({
        success: false,
        message: 'newStatus must be either "approved" or "rejected"'
      });
      return;
    }

    // Find student with security check
    console.log('🟢 [BACKEND] Finding student:', studentId);
    console.log('🟢 [BACKEND] Advisor ID:', advisorId);
    
    let student = await Student.findOne({
      student_id: studentId,
      advisor_id: advisorId
    });
    
    // DEBUG: If not found, try without advisor check to see if student exists at all
    if (!student) {
      console.warn('⚠️ [BACKEND] Student not found with advisor check, trying without advisor...');
      const studentWithoutAdvisor = await Student.findOne({ student_id: studentId });
      
      if (studentWithoutAdvisor) {
        console.error('❌ [BACKEND] Student EXISTS but has different advisor_id:', studentWithoutAdvisor.advisor_id);
        console.error('❌ [BACKEND] Expected advisor_id:', advisorId);
        console.error('❌ [BACKEND] This is an authorization issue - student belongs to different advisor');
      } else {
        console.error('❌ [BACKEND] Student does not exist in database at all');
        
        // Show what students DO exist for this advisor
        const advisorStudents = await Student.find({ advisor_id: advisorId }).limit(5);
        console.log('🟢 [BACKEND] Students that exist for this advisor:', advisorStudents.map(s => ({
          id: s.student_id,
          name: s.name
        })));
      }
    } else {
      console.log('Student found:', student.name);
    }

    if (!student) {
      console.error('❌ [BACKEND] Student not found');
      res.status(404).json({
        success: false,
        message: 'Student not found'
      });
      return;
    }

    // Get latest term with results
    // Find the last term that has courses (results published)
    console.log('🟢 [BACKEND] Finding latest term with results...');
    const terms = ['L4T2', 'L4T1', 'L3T2', 'L3T1', 'L2T2', 'L2T1', 'L1T2', 'L1T1'];
    let latestTerm: string | null = null;
    let latestGPA: number | null = null;

    for (const termKey of terms) {
      const term = (student as any)[termKey];
      if (term && term.courses && term.courses.length > 0) {
        latestTerm = termKey;
        latestGPA = term.term_gpa || 0;
        console.log('Found latest term:', latestTerm, 'GPA:', latestGPA);
        break;
      }
    }

    if (!latestTerm) {
      console.error('❌ [BACKEND] No published term results found');
      res.status(400).json({
        success: false,
        message: 'No published term results found for this student'
      });
      return;
    }

    // Generate email content using Gemini/Ollama
    console.log('🟢 [BACKEND] Calling generateApprovalEmail...');
    console.log('Parameters:', { name: student.name, latestTerm, latestGPA, cgpa: student.cgpa, newStatus });
    const startTime = Date.now();
    const generatedContent = await generateApprovalEmail(
      student.name,
      latestTerm,
      latestGPA || 0,
      student.cgpa || 0,
      newStatus as 'approved' | 'rejected'
    );
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ [BACKEND] Email generated in ${duration}s, length: ${generatedContent.length}`);

    res.status(200).json({
      success: true,
      generatedContent,
      message: 'Content generated successfully'
    });
    console.log('🟢 [BACKEND] Response sent to frontend');

  } catch (error: any) {
    console.error('❌ [BACKEND] Generate approval content error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate content',
      error: error.message
    });
  }
};

/**
 * Send approval/disapproval email to student
 * POST /api/students/send-approval-email
 */
export const sendApprovalEmailToStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🟢 [BACKEND] sendApprovalEmailToStudent endpoint called');
    const advisorId = (req as unknown as AuthRequest).advisor?.id;
    const { studentId, newStatus, emailContent } = req.body;
    
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request body:', { studentId, newStatus, emailContent: emailContent ? `${emailContent.length} chars` : 'MISSING' });
    console.log('Advisor ID:', advisorId);

    if (!advisorId) {
      console.error('❌ [BACKEND] Unauthorized - no advisor ID');
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    // Validate inputs
    if (!newStatus || !['approved', 'rejected'].includes(newStatus)) {
      console.error('❌ [BACKEND] Invalid newStatus:', newStatus);
      console.error('Expected: approved or rejected');
      res.status(400).json({
        success: false,
        message: 'newStatus must be either "approved" or "rejected"'
      });
      return;
    }

    if (!emailContent || emailContent.trim().length === 0) {
      console.error('❌ [BACKEND] Missing or empty emailContent');
      res.status(400).json({
        success: false,
        message: 'emailContent is required'
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
        success: false,
        message: 'Student not found'
      });
      return;
    }

    // Send email
    await sendApprovalEmail(
      student.email,
      student.name,
      emailContent,
      newStatus as 'approved' | 'rejected'
    );

    // Update student approval status
    // For rejection/disapproval, set status back to 'pending' (not permanently rejected)
    // For approval, set status to 'approved'
    student.approval_status = newStatus === 'approved' ? 'approved' : 'pending';
    student.approval_date = new Date();
    await student.save();

    console.log(`✅ [BACKEND] Student status updated to: ${student.approval_status}`);

    res.status(200).json({
      success: true,
      data: {
        student: {
          student_id: student.student_id,
          name: student.name,
          email: student.email,
          approval_status: student.approval_status,
          approval_date: student.approval_date
        }
      },
      message: `Email sent successfully and student status updated to ${student.approval_status}`
    });

  } catch (error: any) {
    console.error('❌ [BACKEND] Send approval email error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send email',
      error: error.message
    });
  }
};
