import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';
import thesisRoutes from './routes/thesis.routes';
import routineRoutes from './routes/routine.routes';

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, _res: Response, next: Function) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'CUET Advisor API Docs',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'CUET Advisor Panel API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
    endpoints: {
      auth: '/api/auth',
      students: '/api/students',
      thesis: '/api/thesis',
      routines: '/api/routines'
    }
  });
});

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'CUET Advisor Panel API is running',
    timestamp: new Date().toISOString(),
    documentation: '/api-docs'
  });
});

// API Routes - MUST come before 404 handler
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/thesis', thesisRoutes);
app.use('/api/routines', routineRoutes);

// 404 handler - MUST be last
app.use((_req: Request, res: Response) => {
  console.log(`404: ${_req.method} ${_req.path}`);
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: _req.path,
    method: _req.method,
    available: {
      auth: '/api/auth',
      students: '/api/students',
      thesis: '/api/thesis',
      routines: '/api/routines',
      docs: '/api-docs',
      health: '/health'
    }
  });
});

export default app;
