import request from 'supertest';
import app from '../../src/app';
import Advisor from '../../src/models/Advisor.model';
import Student from '../../src/models/Student.model';
import ThesisInfo from '../../src/models/ThesisInfo.model';
import { connectDB, disconnectDB } from '../../src/config/database';

describe('Thesis Controller - Integration Tests', () => {
  let authToken: string;
  let advisorId: string;
  let testThesis: any;

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
    await ThesisInfo.deleteMany({});

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

    // Create test student first
    const student = await Student.create({
      student_id: '2104040',
      name: 'John Doe',
      email: 'john@student.cuet.ac.bd',
      registration_number: '2104040',
      department: 'Computer Science & Engineering',
      batch: '21',
      session: '2020-21',
      phone: '+880-1234567890',
      cgpa: 3.5,
      registration_status: 'registered',
      approval_status: 'pending',
      graduation_status: 'active',
      next_semester_registration: 'L4T1',
      advisor_id: advisorId,
    });

    // Create test thesis
    testThesis = await ThesisInfo.create({
      student_id: student._id,
      title: 'Machine Learning Applications in Healthcare',
      supervisor: 'Dr. Test Advisor',
      status: 'ongoing',
      progress_percentage: 45,
    });
  });

  describe('GET /api/thesis/students', () => {
    it('should get all thesis students for authenticated advisor', async () => {
      const response = await request(app)
        .get('/api/thesis/students')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).get('/api/thesis/students');

      expect(response.status).toBe(401);
    });

    it('should only return thesis students for the authenticated advisor', async () => {
      // Create another advisor with thesis student
      const otherAdvisor = await Advisor.create({
        name: 'Dr. Other Advisor',
        email: 'other@cuet.ac.bd',
        password: 'password123',
        department: 'CSE',
        designation: 'Professor',
        phone: '+880-9876543210',
        office_room: 'Room 402',
      });

      const otherStudent = await Student.create({
        student_id: '2104999',
        name: 'Other Student',
        email: 'other@student.cuet.ac.bd',
        batch: '21',
        cgpa: 3.5,
        registration_status: 'registered',
        approval_status: 'pending',
        graduation_status: 'active',
        next_semester_registration: 'L4T1',
        advisor_id: otherAdvisor._id.toString(),
      });

      await ThesisInfo.create({
        student_id: otherStudent._id,
        title: 'AI in Education',
        supervisor: 'Dr. Other Advisor',
        status: 'ongoing',
        progress_percentage: 20,
      });

      const response = await request(app)
        .get('/api/thesis/students')
        .set('Authorization', `Bearer ${authToken}`);

      // Should only get 1 thesis (testThesis)
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].student_id).toBe('2104040');
    });
  });

  describe('POST /api/thesis/students', () => {
    it('should assign thesis topic to student', async () => {
      const response = await request(app)
        .post('/api/thesis/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          student_id: '2104050',
          student_name: 'Alice Johnson',
          thesis_topic: 'Blockchain Technology in Supply Chain',
          status: 'ongoing',
          progress_percentage: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('student_id', '2104050');
      expect(response.body.data).toHaveProperty('thesis_topic', 'Blockchain Technology in Supply Chain');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/thesis/students')
        .send({
          student_id: '2104050',
          student_name: 'Alice Johnson',
          thesis_topic: 'Test Topic',
          status: 'ongoing',
        });

      expect(response.status).toBe(401);
    });

    it('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/api/thesis/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          student_id: '2104050',
          // Missing student_name and thesis_topic
        });

      expect(response.status).toBe(400);
    });

    it('should prevent duplicate student thesis', async () => {
      await request(app)
        .post('/api/thesis/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          student_id: '2104060',
          student_name: 'Bob Smith',
          thesis_topic: 'First Topic',
          status: 'ongoing',
        });

      const response = await request(app)
        .post('/api/thesis/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          student_id: '2104060',
          student_name: 'Bob Smith',
          thesis_topic: 'Second Topic',
          status: 'ongoing',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/thesis/students/:id', () => {
    it('should update thesis information', async () => {
      const response = await request(app)
        .put(`/api/thesis/students/${testThesis.student_id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          thesis_topic: 'Updated: Deep Learning in Medical Diagnostics',
          progress_percentage: 65,
          status: 'ongoing',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('thesis_topic', 'Updated: Deep Learning in Medical Diagnostics');
      expect(response.body.data).toHaveProperty('progress_percentage', 65);
    });

    it('should update thesis status to completed', async () => {
      const response = await request(app)
        .put(`/api/thesis/students/${testThesis.student_id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'completed',
          progress_percentage: 100,
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('status', 'completed');
      expect(response.body.data).toHaveProperty('progress_percentage', 100);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .put(`/api/thesis/students/${testThesis.student_id}`)
        .send({
          progress_percentage: 70,
        });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent thesis', async () => {
      const response = await request(app)
        .put('/api/thesis/students/9999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          progress_percentage: 50,
        });

      expect(response.status).toBe(404);
    });

    it('should validate progress_percentage range', async () => {
      const response = await request(app)
        .put(`/api/thesis/students/${testThesis.student_id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          progress_percentage: 150, // Invalid: > 100
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/thesis/students/:id', () => {
    it('should delete thesis record', async () => {
      const response = await request(app)
        .delete(`/api/thesis/students/${testThesis.student_id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);

      // Verify thesis was deleted
      const deletedThesis = await ThesisInfo.findOne({ student_id: testThesis.student_id });
      expect(deletedThesis).toBeNull();
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .delete(`/api/thesis/students/${testThesis.student_id}`);

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent thesis', async () => {
      const response = await request(app)
        .delete('/api/thesis/students/9999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should not delete thesis of other advisor', async () => {
      // Create another advisor with thesis
      const otherAdvisor = await Advisor.create({
        name: 'Dr. Other Advisor',
        email: 'other@cuet.ac.bd',
        password: 'password123',
        department: 'CSE',
        designation: 'Professor',
        phone: '+880-9876543210',
        office_room: 'Room 402',
      });

      // Create other student first
      const otherStudent = await Student.create({
        student_id: '2104888',
        name: 'Other Student',
        email: 'otherstudent@student.cuet.ac.bd',
        registration_number: '2104888',
        department: 'Computer Science & Engineering',
        batch: '21',
        session: '2020-21',
        phone: '+880-4444444444',
        advisor_id: otherAdvisor._id,
        approval_status: 'approved',
      });

      await ThesisInfo.create({
        student_id: otherStudent._id,
        title: 'AI in Education',
        supervisor: 'Dr. Other Advisor',
        status: 'ongoing',
        progress_percentage: 20,
      });

      // Try to delete other advisor's thesis
      const response = await request(app)
        .delete(`/api/thesis/students/${otherStudent._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);

      // Verify thesis still exists
      const existingThesis = await ThesisInfo.findOne({ student_id: otherStudent._id });
      expect(existingThesis).not.toBeNull();
    });
  });
});
