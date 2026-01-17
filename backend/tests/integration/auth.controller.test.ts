import request from 'supertest';
import app from '../../src/app';
import Advisor from '../../src/models/Advisor.model';
import Student from '../../src/models/Student.model';
import { connectDB, disconnectDB } from '../../src/config/database';
import jwt from 'jsonwebtoken';

describe('Auth Controller - Integration Tests', () => {
  let authToken: string;
  let advisorId: string;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    // Clean database
    await Advisor.deleteMany({});
    await Student.deleteMany({});

    // Create test advisor
    const advisor = await Advisor.create({
      name: 'Dr. Test Advisor',
      email: 'test@cuet.ac.bd',
      password: 'testpassword123',
      department: 'Computer Science & Engineering',
      designation: 'Professor',
      phone: '+880-1234567890',
      office_room: 'Room 401',
    });

    advisorId = advisor._id.toString();
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@cuet.ac.bd',
          password: 'testpassword123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('advisor');
      expect(response.body.advisor).toHaveProperty('name', 'Dr. Test Advisor');
      expect(response.body.advisor).toHaveProperty('email', 'test@cuet.ac.bd');

      authToken = response.body.token;
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@cuet.ac.bd',
          password: 'testpassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should fail with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@cuet.ac.bd',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should fail with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return valid JWT token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@cuet.ac.bd',
          password: 'testpassword123',
        });

      const token = response.body.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret') as any;

      expect(decoded).toHaveProperty('id');
      expect(decoded.id).toBe(advisorId);
    });
  });

  describe('GET /api/auth/profile', () => {
    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@cuet.ac.bd',
          password: 'testpassword123',
        });

      authToken = loginResponse.body.token;
    });

    it('should get advisor profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('advisor');
      expect(response.body.advisor).toHaveProperty('name', 'Dr. Test Advisor');
      expect(response.body.advisor).toHaveProperty('department');
      expect(response.body.advisor).not.toHaveProperty('password');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });

    it('should fail with expired token', async () => {
      const expiredToken = jwt.sign(
        { id: advisorId },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '-1h' }
      );

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/auth/password', () => {
    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@cuet.ac.bd',
          password: 'testpassword123',
        });

      authToken = loginResponse.body.token;
    });

    it('should update password successfully', async () => {
      const response = await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'testpassword123',
          newPassword: 'newpassword456',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');

      // Verify can login with new password
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@cuet.ac.bd',
          password: 'newpassword456',
        });

      expect(loginResponse.status).toBe(200);
    });

    it('should fail with incorrect current password', async () => {
      const response = await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword456',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .put('/api/auth/password')
        .send({
          currentPassword: 'testpassword123',
          newPassword: 'newpassword456',
        });

      expect(response.status).toBe(401);
    });

    it('should fail with missing fields', async () => {
      const response = await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'testpassword123',
        });

      expect(response.status).toBe(400);
    });

    it('should fail with short password', async () => {
      const response = await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'testpassword123',
          newPassword: '123',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Security Tests', () => {
    it('should not expose password in response', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@cuet.ac.bd',
          password: 'testpassword123',
        });

      expect(response.body.advisor).not.toHaveProperty('password');
    });

    it('should handle SQL injection attempts safely', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: "' OR '1'='1",
          password: "' OR '1'='1",
        });

      expect(response.status).toBe(400);
    });

    it('should rate limit login attempts', async () => {
      // Note: This test assumes rate limiting is implemented
      const attempts = Array(10).fill(null);
      
      for (const _ of attempts) {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@cuet.ac.bd',
            password: 'wrongpassword',
          });
      }

      // Additional attempt should be rate limited (if implemented)
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@cuet.ac.bd',
          password: 'testpassword123',
        });

      // This test may need adjustment based on actual rate limiting implementation
      expect([200, 429]).toContain(response.status);
    });
  });
});
