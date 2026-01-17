import request from 'supertest';
import app from '../../src/app';
import Advisor from '../../src/models/Advisor.model';
import Student from '../../src/models/Student.model';
import { connectDB, disconnectDB } from '../../src/config/database';

describe('Student Controller - Integration Tests', () => {
  let authToken: string;
  let advisorId: string;
  let testStudent: any;

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

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@cuet.ac.bd',
        password: 'testpassword123',
      });

    authToken = loginResponse.body.token;

    // Create test student
    testStudent = await Student.create({
      student_id: '2104040',
      name: 'John Doe',
      email: 'john@student.cuet.ac.bd',
      batch: '21',
      cgpa: 3.75,
      registration_status: 'registered',
      approval_status: 'pending',
      graduation_status: 'active',
      next_semester_registration: 'L4T1',
      advisor_id: advisorId,
      L3T2: {
        term_gpa: 3.85,
        courses: [
          { code: 'CSE 301', title: 'Database', credit: 3.0, grade: 'A', gpa: 4.0 },
        ],
      },
    });
  });

  describe('GET /api/students', () => {
    it('should get all students for authenticated advisor', async () => {
      const response = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).get('/api/students');

      expect(response.status).toBe(401);
    });

    it('should only return students for the authenticated advisor', async () => {
      // Create another advisor with student
      const otherAdvisor = await Advisor.create({
        name: 'Dr. Other Advisor',
        email: 'other@cuet.ac.bd',
        password: 'password123',
        department: 'CSE',
        designation: 'Professor',
        phone: '+880-9876543210',
        office_room: 'Room 402',
      });

      await Student.create({
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

      const response = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${authToken}`);

      // Should only get 1 student (testStudent)
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].student_id).toBe('2104040');
    });
  });

  describe('GET /api/students/:id', () => {
    it('should get specific student by ID', async () => {
      const response = await request(app)
        .get(`/api/students/${testStudent.student_id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('student_id', '2104040');
      expect(response.body.data).toHaveProperty('name', 'John Doe');
    });

    it('should return 404 for non-existent student', async () => {
      const response = await request(app)
        .get('/api/students/9999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get(`/api/students/${testStudent.student_id}`);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/students/:id', () => {
    it('should update student approval status', async () => {
      const response = await request(app)
        .put(`/api/students/${testStudent.student_id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          approval_status: 'approved',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('approval_status', 'approved');
    });

    it('should update student registration status', async () => {
      const response = await request(app)
        .put(`/api/students/${testStudent.student_id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          registration_status: 'not_registered',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('registration_status', 'not_registered');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .put(`/api/students/${testStudent.student_id}`)
        .send({
          approval_status: 'approved',
        });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent student', async () => {
      const response = await request(app)
        .put('/api/students/9999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          approval_status: 'approved',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/students/generate-approval', () => {
    it('should generate approval email content', async () => {
      const response = await request(app)
        .post('/api/students/generate-approval')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          studentId: '2104040',
          currentStatus: 'pending',
          newStatus: 'approved',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('generatedContent');
      expect(response.body.generatedContent).toContain('John Doe');
    }, 30000); // Increase timeout for AI generation

    it('should generate disapproval email content', async () => {
      const response = await request(app)
        .post('/api/students/generate-approval')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          studentId: '2104040',
          currentStatus: 'pending',
          newStatus: 'rejected',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('generatedContent');
    }, 30000);

    it('should fail for non-existent student', async () => {
      const response = await request(app)
        .post('/api/students/generate-approval')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          studentId: '9999999',
          newStatus: 'approved',
        });

      expect(response.status).toBe(404);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/students/generate-approval')
        .send({
          studentId: '2104040',
          newStatus: 'approved',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/students/send-approval-email', () => {
    it('should send approval email and update status', async () => {
      const emailContent = 'Dear John Doe,\n\nYour registration is approved.\n\nBest regards';

      const response = await request(app)
        .post('/api/students/send-approval-email')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          studentId: '2104040',
          emailContent: emailContent,
          newStatus: 'approved',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);

      // Verify student status was updated
      const student = await Student.findOne({ student_id: '2104040' });
      expect(student?.approval_status).toBe('approved');
    });

    it('should send disapproval email and set status to pending', async () => {
      const emailContent = 'Dear John,\n\nNeed to discuss registration.\n\nRegards';

      const response = await request(app)
        .post('/api/students/send-approval-email')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          studentId: '2104040',
          emailContent: emailContent,
          newStatus: 'rejected',
        });

      expect(response.status).toBe(200);

      // Verify status is set to pending (not rejected)
      const student = await Student.findOne({ student_id: '2104040' });
      expect(student?.approval_status).toBe('pending');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/students/send-approval-email')
        .send({
          studentId: '2104040',
          emailContent: 'Email content',
          newStatus: 'approved',
        });

      expect(response.status).toBe(401);
    });

    it('should fail for non-existent student', async () => {
      const response = await request(app)
        .post('/api/students/send-approval-email')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          studentId: '9999999',
          emailContent: 'Email content',
          newStatus: 'approved',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/students/approve-multiple', () => {
    beforeEach(async () => {
      // Create additional test students
      await Student.create([
        {
          student_id: '2104041',
          name: 'Jane Smith',
          email: 'jane@student.cuet.ac.bd',
          batch: '21',
          cgpa: 3.6,
          registration_status: 'registered',
          approval_status: 'pending',
          graduation_status: 'active',
          next_semester_registration: 'L4T1',
          advisor_id: advisorId,
        },
        {
          student_id: '2104042',
          name: 'Bob Johnson',
          email: 'bob@student.cuet.ac.bd',
          batch: '21',
          cgpa: 3.8,
          registration_status: 'registered',
          approval_status: 'pending',
          graduation_status: 'active',
          next_semester_registration: 'L4T1',
          advisor_id: advisorId,
        },
      ]);
    });

    it('should approve multiple students', async () => {
      const response = await request(app)
        .post('/api/students/approve-multiple')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          studentIds: ['2104040', '2104041', '2104042'],
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);

      // Verify all students were approved
      const students = await Student.find({
        student_id: { $in: ['2104040', '2104041', '2104042'] },
      });

      students.forEach(student => {
        expect(student.approval_status).toBe('approved');
      });
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/students/approve-multiple')
        .send({
          studentIds: ['2104040', '2104041'],
        });

      expect(response.status).toBe(401);
    });
  });
});
