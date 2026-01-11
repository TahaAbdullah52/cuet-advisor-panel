// Authentication request/response types
import { Request } from 'express';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
    advisor: {
      id: string;
      name: string;
      email: string;
      department: string;
      designation: string;
    };
  };
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthRequest extends Request {
  advisor?: {
    id: string;
    email: string;
  };
}

export interface JWTPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}
