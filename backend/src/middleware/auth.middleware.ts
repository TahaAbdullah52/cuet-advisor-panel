import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { AuthRequest } from '../types/auth.types';

/**
 * Middleware to protect routes - requires valid JWT token
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        status: 'error',
        message: 'No token provided. Please login first.'
      });
      return;
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);

    // Attach advisor info to request
    (req as AuthRequest).advisor = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      status: 'error',
      message: error.message || 'Invalid or expired token'
    });
  }
};
