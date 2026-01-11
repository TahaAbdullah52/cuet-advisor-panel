import 'dotenv/config';
import mongoose from 'mongoose';
import Student from './src/models/Student.model';
import Advisor from './src/models/Advisor.model';

// Test data
const testData = {
  advisorEmail: 'advisor@cuet.ac.bd',
  advisorPassword: 'pass12345',
  studentId: '2104001'
};

async function testThesisManagement() {
  console.log('🔄 Testing Thesis Management Endpoints...\n');
  
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ MongoDB connected\n');

    // Find advisor
    const advisor = await Advisor.findOne({ email: testData.advisorEmail });
    if (!advisor) {
      console.error('❌ Advisor not found. Please create an advisor first.');
      return;
    }
    console.log('✅ Advisor found:', advisor.name, '\n');

    // Find student
    let student = await Student.findOne({ 
      student_id: testData.studentId,
      advisor_id: advisor._id
    });

    if (!student) {
      console.error('❌ Student not found. Creating a test student...');
      
      // Create a test student
      student = new Student({
        student_id: testData.studentId,
        name: 'Md. Test Student',
        email: 'u2104001@student.cuet.ac.bd',
        registration_number: '2021-04-001',
        department: 'Computer Science & Engineering',
        batch: '21',
        session: '2020-21',
        phone: '01712345678',
        advisor_id: advisor._id,
        cgpa: 3.50,
        total_credits: 60,
        approval_status: 'approved',
        L1T1: {
          courses: [
            { code: 'CSE-101', name: 'Programming', credits: 3, grade: 'A', gpa: 4.0 }
          ],
          term_gpa: 4.0,
          term_credits: 3
        }
      });
      
      await student.save();
      console.log('✅ Test student created\n');
    }

    console.log('📋 Initial Student Data:');
    console.log('- Student ID:', student.student_id);
    console.log('- Name:', student.name);
    console.log('- ThesisInfo:', student.thesisInfo ? 'Exists' : 'Not set');
    console.log('\n---\n');

    // Test 1: Add student to thesis supervision
    console.log('🧪 Test 1: Adding student to thesis supervision...');
    if (!student.thesisInfo) {
      student.thesisInfo = {
        topicAssigned: false,
        topicName: '',
        defenseDate: '',
        assignedTask: '',
        meetingDateTime: ''
      };
      await student.save();
      console.log('✅ Student added to thesis supervision');
      console.log('ThesisInfo:', student.thesisInfo);
    } else {
      console.log('ℹ️  Student already linked to thesis');
    }
    console.log('\n---\n');

    // Test 2: Update thesis info
    console.log('🧪 Test 2: Updating thesis information...');
    if (student.thesisInfo) {
      student.thesisInfo.topicAssigned = true;
      student.thesisInfo.topicName = 'Machine Learning Applications in Healthcare';
      student.thesisInfo.defenseDate = '2024-12-15';
      student.thesisInfo.assignedTask = 'Complete literature review by next week';
      student.thesisInfo.meetingDateTime = '2024-11-20T10:00:00';
      
      await student.save();
      console.log('✅ Thesis information updated');
      console.log('Updated ThesisInfo:', student.thesisInfo);
    }
    console.log('\n---\n');

    // Test 3: Get all thesis students
    console.log('🧪 Test 3: Getting all thesis students...');
    const thesisStudents = await Student.find({
      advisor_id: advisor._id,
      thesisInfo: { $exists: true, $ne: null }
    });
    console.log(`✅ Found ${thesisStudents.length} thesis student(s)`);
    thesisStudents.forEach(s => {
      console.log(`  - ${s.student_id}: ${s.name} (Topic: ${s.thesisInfo?.topicName || 'Not assigned'})`);
    });
    console.log('\n---\n');

    // Test 4: Remove from thesis supervision
    console.log('🧪 Test 4: Removing student from thesis supervision...');
    student.thesisInfo = undefined;
    await student.save();
    console.log('✅ Student removed from thesis supervision');
    console.log('ThesisInfo:', student.thesisInfo);
    console.log('\n---\n');

    console.log('✅ ALL TESTS PASSED!\n');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run tests
testThesisManagement();
