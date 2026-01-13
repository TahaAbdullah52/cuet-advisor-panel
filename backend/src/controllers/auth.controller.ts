import { Request, Response } from 'express';
import Advisor from '../models/Advisor.model';
import { generateToken } from '../utils/jwt.utils';
import { LoginRequest, AuthRequest } from '../types/auth.types';

/**
 * Login advisor
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequest;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
      return;
    }

    // Find advisor by email
    const advisor = await Advisor.findOne({ email: email.toLowerCase() });

    if (!advisor) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Compare password
    const isPasswordValid = await advisor.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Generate JWT token
    const token = generateToken({
      id: advisor._id.toString(),
      email: advisor.email
    });

    // Return success response matching frontend expectations
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      advisor: {
        id: advisor._id,
        name: advisor.name,
        email: advisor.email,
        department: advisor.department,
        designation: advisor.designation,
        phone: advisor.phone,
        office_room: advisor.office_room
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * Get advisor profile
 * GET /api/auth/profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;

    if (!advisorId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    // Find advisor (exclude password)
    const advisor = await Advisor.findById(advisorId).select('-password');

    if (!advisor) {
      res.status(404).json({
        success: false,
        message: 'Advisor not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { advisor }
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

/**
 * Update advisor password
 * PUT /api/auth/password
 */
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
      return;
    }

    // Find advisor
    const advisor = await Advisor.findById(advisorId);

    if (!advisor) {
      res.status(404).json({
        success: false,
        message: 'Advisor not found'
      });
      return;
    }

    // Verify current password
    const isPasswordValid = await advisor.comparePassword(currentPassword);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
      return;
    }

    // Update password (will be hashed by pre-save hook)
    advisor.password = newPassword;
    await advisor.save();

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error: any) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update password',
      error: error.message
    });
  }
};
