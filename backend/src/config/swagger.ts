import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CUET Academic Advisor Panel API',
      version: '1.0.0',
      description: 'Backend API for CUET Academic Advisor Panel with AI-powered email generation, student management, routine scheduling, and thesis supervision.',
      contact: {
        name: 'Junain Uddin',
        email: 'advisor@cuet.ac.bd',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from the /api/auth/login endpoint',
        },
      },
      schemas: {
        // Auth Schemas
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'advisor@cuet.ac.bd',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'advisor123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            advisor: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'Dr. John Doe',
                },
                email: {
                  type: 'string',
                  example: 'advisor@cuet.ac.bd',
                },
                department: {
                  type: 'string',
                  example: 'Computer Science & Engineering',
                },
              },
            },
            message: {
              type: 'string',
              example: 'Login successful',
            },
          },
        },
        // Student Schemas
        Student: {
          type: 'object',
          properties: {
            student_id: {
              type: 'string',
              example: '2104040',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'john@student.cuet.ac.bd',
            },
            batch: {
              type: 'string',
              example: '21',
            },
            cgpa: {
              type: 'number',
              example: 3.75,
            },
            registration_status: {
              type: 'string',
              enum: ['registered', 'not_registered'],
              example: 'registered',
            },
            approval_status: {
              type: 'string',
              enum: ['approved', 'pending', 'rejected'],
              example: 'pending',
            },
            graduation_status: {
              type: 'string',
              enum: ['active', 'graduated'],
              example: 'active',
            },
            next_semester_registration: {
              type: 'string',
              example: 'L4T2',
            },
          },
        },
        ApprovalRequest: {
          type: 'object',
          required: ['studentId', 'newStatus'],
          properties: {
            studentId: {
              type: 'string',
              example: '2104040',
            },
            currentStatus: {
              type: 'string',
              enum: ['approved', 'pending', 'rejected'],
              example: 'pending',
            },
            newStatus: {
              type: 'string',
              enum: ['approved', 'rejected'],
              example: 'approved',
            },
          },
        },
        ApprovalResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            generatedContent: {
              type: 'string',
              example: 'Dear John Doe,\\n\\nBased on your excellent academic performance...',
            },
            message: {
              type: 'string',
              example: 'Content generated successfully',
            },
          },
        },
        SendEmailRequest: {
          type: 'object',
          required: ['studentId', 'emailContent', 'newStatus'],
          properties: {
            studentId: {
              type: 'string',
              example: '2104040',
            },
            emailContent: {
              type: 'string',
              example: 'Dear John Doe,\\n\\nYour registration has been approved...',
            },
            newStatus: {
              type: 'string',
              enum: ['approved', 'rejected'],
              example: 'approved',
            },
          },
        },
        // Routine Schemas
        Routine: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            day: {
              type: 'string',
              enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
              example: 'Monday',
            },
            time: {
              type: 'string',
              example: '10:00 AM',
            },
            courseCode: {
              type: 'string',
              example: 'CSE 401',
            },
            courseTitle: {
              type: 'string',
              example: 'Software Engineering',
            },
            room: {
              type: 'string',
              example: 'Room 301',
            },
            type: {
              type: 'string',
              enum: ['theory', 'lab'],
              example: 'theory',
            },
          },
        },
        // Thesis Schemas
        ThesisInfo: {
          type: 'object',
          properties: {
            student_id: {
              type: 'string',
              example: '2104040',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            thesis_topic: {
              type: 'string',
              example: 'AI-based Student Performance Prediction',
            },
            thesis_status: {
              type: 'string',
              enum: ['Not Assigned', 'In Progress', 'Completed'],
              example: 'In Progress',
            },
          },
        },
        // Error Response
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            error: {
              type: 'string',
              example: 'Detailed error information',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
