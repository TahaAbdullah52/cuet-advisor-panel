import request from 'supertest';
import app from '../../src/app';
import Advisor from '../../src/models/Advisor.model';
import Routine from '../../src/models/Routine.model';
import { connectDB, disconnectDB } from '../../src/config/database';

describe('Routine Controller - Integration Tests', () => {
  let authToken: string;
  let advisorId: string;
  let testRoutine: any;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    // Clean database
    await Advisor.deleteMany({});
    await Routine.deleteMany({});

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

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@cuet.ac.bd',
        password: 'testpassword123',
      });

    authToken = loginResponse.body.token;

    // Create test routine
    testRoutine = await Routine.create({
      day: 'Monday',
      time: '10:00 AM - 11:30 AM',
      course_code: 'CSE 301',
      course_name: 'Database Management Systems',
      room: 'Room 201',
      batch: '21',
      advisor_id: advisorId,
    });
  });

  describe('GET /api/routines', () => {
    it('should get all routines for authenticated advisor', async () => {
      const response = await request(app)
        .get('/api/routines')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).get('/api/routines');

      expect(response.status).toBe(401);
    });

    it('should only return routines for the authenticated advisor', async () => {
      // Create another advisor with routine
      const otherAdvisor = await Advisor.create({
        name: 'Dr. Other Advisor',
        email: 'other@cuet.ac.bd',
        password: 'password123',
        department: 'CSE',
        designation: 'Professor',
        phone: '+880-9876543210',
        office_room: 'Room 402',
      });

      await Routine.create({
        day: 'Tuesday',
        time: '2:00 PM - 3:30 PM',
        course_code: 'CSE 401',
        course_name: 'Software Engineering',
        room: 'Room 301',
        batch: '20',
        advisor_id: otherAdvisor._id.toString(),
      });

      const response = await request(app)
        .get('/api/routines')
        .set('Authorization', `Bearer ${authToken}`);

      // Should only get 1 routine (testRoutine)
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].course_code).toBe('CSE 301');
    });
  });

  describe('POST /api/routines', () => {
    it('should create a new routine', async () => {
      const response = await request(app)
        .post('/api/routines')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          day: 'Wednesday',
          time: '1:00 PM - 2:30 PM',
          course_code: 'CSE 305',
          course_name: 'Computer Networks',
          room: 'Room 202',
          batch: '21',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('course_code', 'CSE 305');
      expect(response.body.data).toHaveProperty('course_name', 'Computer Networks');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/routines')
        .send({
          day: 'Wednesday',
          time: '1:00 PM - 2:30 PM',
          course_code: 'CSE 305',
          course_name: 'Computer Networks',
          room: 'Room 202',
          batch: '21',
        });

      expect(response.status).toBe(401);
    });

    it('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/api/routines')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          day: 'Wednesday',
          // Missing other required fields
        });

      expect(response.status).toBe(400);
    });

    it('should validate day field', async () => {
      const response = await request(app)
        .post('/api/routines')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          day: 'InvalidDay',
          time: '1:00 PM - 2:30 PM',
          course_code: 'CSE 305',
          course_name: 'Computer Networks',
          room: 'Room 202',
          batch: '21',
        });

      expect(response.status).toBe(400);
    });

    it('should allow multiple routines for same course', async () => {
      const response1 = await request(app)
        .post('/api/routines')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          day: 'Monday',
          time: '2:00 PM - 3:30 PM',
          course_code: 'CSE 301',
          course_name: 'Database Management Systems',
          room: 'Room 203',
          batch: '21',
        });

      expect(response1.status).toBe(201);

      const response2 = await request(app)
        .post('/api/routines')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          day: 'Thursday',
          time: '10:00 AM - 11:30 AM',
          course_code: 'CSE 301',
          course_name: 'Database Management Systems',
          room: 'Lab 1',
          batch: '21',
        });

      expect(response2.status).toBe(201);
    });
  });

  describe('PUT /api/routines/:id', () => {
    it('should update routine information', async () => {
      const response = await request(app)
        .put(`/api/routines/${testRoutine._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          time: '11:00 AM - 12:30 PM',
          room: 'Room 301',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('time', '11:00 AM - 12:30 PM');
      expect(response.body.data).toHaveProperty('room', 'Room 301');
    });

    it('should update day and maintain other fields', async () => {
      const response = await request(app)
        .put(`/api/routines/${testRoutine._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          day: 'Tuesday',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('day', 'Tuesday');
      expect(response.body.data).toHaveProperty('course_code', 'CSE 301');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .put(`/api/routines/${testRoutine._id}`)
        .send({
          time: '2:00 PM - 3:30 PM',
        });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent routine', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/routines/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          time: '2:00 PM - 3:30 PM',
        });

      expect(response.status).toBe(404);
    });

    it('should validate day field on update', async () => {
      const response = await request(app)
        .put(`/api/routines/${testRoutine._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          day: 'InvalidDay',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/routines/:id', () => {
    it('should delete routine', async () => {
      const response = await request(app)
        .delete(`/api/routines/${testRoutine._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);

      // Verify routine was deleted
      const deletedRoutine = await Routine.findById(testRoutine._id);
      expect(deletedRoutine).toBeNull();
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .delete(`/api/routines/${testRoutine._id}`);

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent routine', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/routines/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should not delete routine of other advisor', async () => {
      // Create another advisor with routine
      const otherAdvisor = await Advisor.create({
        name: 'Dr. Other Advisor',
        email: 'other@cuet.ac.bd',
        password: 'password123',
        department: 'CSE',
        designation: 'Professor',
        phone: '+880-9876543210',
        office_room: 'Room 402',
      });

      const otherRoutine = await Routine.create({
        day: 'Friday',
        time: '3:00 PM - 4:30 PM',
        course_code: 'CSE 501',
        course_name: 'Advanced Algorithms',
        room: 'Room 401',
        batch: '19',
        advisor_id: otherAdvisor._id.toString(),
      });

      // Try to delete other advisor's routine
      const response = await request(app)
        .delete(`/api/routines/${otherRoutine._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);

      // Verify routine still exists
      const existingRoutine = await Routine.findById(otherRoutine._id);
      expect(existingRoutine).not.toBeNull();
    });
  });
});
