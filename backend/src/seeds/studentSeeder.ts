import Student from '../models/Student.model';
import { Types } from 'mongoose';

// Course names mapping
const COURSE_NAMES: { [key: string]: string } = {
  'Hum-141': 'English',
  'CSE-141': 'Structured Programming',
  'CSE-142': 'Structured Programming Sessional',
  'EE-181': 'Electrical Circuits',
  'EE-182': 'Electrical Circuits Sessional',
  'Phy-141': 'Physics',
  'CSE-100': 'Computer Fundamentals Sessional',
  'Math-141': 'Differential Calculus and Coordinate Geometry',
  'Phy-142': 'Physics Sessional',
  'EE-183': 'Electronics',
  'Chem-141': 'Chemistry',
  'CSE-111': 'Computer Programming',
  'CSE-144': 'Computer Programming Sessional',
  'Chem-142': 'Chemistry Sessional',
  'Hum-144': 'Bangladesh Studies Sessional',
  'Math-143': 'Integral Calculus',
  'EE-184': 'Electronics Sessional',
  'CSE-143': 'Discrete Mathematics',
  'ME-246': 'Engineering Drawing Sessional',
  'CSE-242': 'Digital Logic Design Sessional',
  'CSE-221': 'Algorithms',
  'CSE-222': 'Algorithms Sessional',
  'CSE-200': 'Technical Writing and Presentation',
  'Math-241': 'Complex Variable',
  'CSE-241': 'Digital Logic Design',
  'HUM-243': 'Economics',
  'CSE-231': 'Data Structures',
  'EE-284': 'Numerical Techniques Sessional',
  'CSE-244': 'Data Structures Sessional',
  'EE-283': 'Numerical Techniques',
  'CSE-252': 'Object Oriented Programming Sessional',
  'CSE-223': 'Data Communication',
  'CSE-224': 'Data Communication Sessional',
  'Math-243': 'Linear Algebra',
  'CSE-202': 'Ethics and Cyber Law Sessional',
  'CSE-243': 'Digital Electronics',
  'CSE-251': 'Object Oriented Programming',
  'CSE-331': 'Microprocessors',
  'CSE-333': 'Computer Organization and Architecture',
  'CSE-313': 'Operating System',
  'CSE-335': 'Theory of Computation',
  'CSE-314': 'Operating System Sessional',
  'CSE-326': 'Microprocessors and Interfacing Sessional',
  'CSE-336': 'Computer Organization and Architecture Sessional',
  'CSE-334': 'Digital Signal Processing Sessional',
  'CSE-353': 'Database Management System',
  'CSE-354': 'Database Management System Sessional',
  'CSE-311': 'Computer Networks',
  'CSE-321': 'Software Engineering',
  'CSE-355': 'Artificial Intelligence',
  'CSE-345': 'Compiler Design',
  'CSE-347': 'Information System Design',
  'CSE-312': 'Computer Networks Sessional',
  'CSE-356': 'Artificial Intelligence Sessional',
  'CSE-346': 'Compiler Design Sessional',
  'CSE-300': 'Technical Documentation',
  'CSE-302': 'Software Development Sessional',
  'CSE-437': 'Computer Graphics',
  'CSE-435': 'Pattern Recognition',
  'CSE-445': 'Distributed Systems',
  'CSE-436': 'Computer Graphics Sessional',
  'CSE-438': 'Pattern Recognition Sessional',
  'CSE-446': 'Distributed Systems Sessional',
  'CSE-400': 'Project and Thesis',
  'CSE-402': 'Industrial Training',
  'CSE-Option-I': 'Technical Elective I',
  'Hum-Option-I': 'Humanities Elective I',
  'CSE-431': 'Simulation and Modeling',
  'CSE-457': 'Machine Learning',
  'Hum-445': 'Engineering Management',
  'Hum-447': 'Accounting',
  'CSE-432': 'Simulation and Modeling Sessional',
  'CSE-458': 'Machine Learning Sessional',
  'CSE-Option-II': 'Technical Elective II'
};

// Real course data for all 8 semesters
const COURSES = {
  L1T1: [
    { code: 'Hum-141', credits: 2, sessional: false },
    { code: 'CSE-141', credits: 3, sessional: false },
    { code: 'CSE-142', credits: 1.5, sessional: true },
    { code: 'EE-181', credits: 3, sessional: false },
    { code: 'EE-182', credits: 1.5, sessional: true },
    { code: 'Phy-141', credits: 3, sessional: false },
    { code: 'CSE-100', credits: 0.75, sessional: true },
    { code: 'Math-141', credits: 3.0, sessional: false },
    { code: 'Phy-142', credits: 1.5, sessional: true }
  ],
  L1T2: [
    { code: 'EE-183', credits: 4.0, sessional: false },
    { code: 'Chem-141', credits: 3.0, sessional: false },
    { code: 'CSE-111', credits: 3.0, sessional: false },
    { code: 'CSE-144', credits: 1.5, sessional: true },
    { code: 'Chem-142', credits: 0.75, sessional: true },
    { code: 'Hum-144', credits: 1.5, sessional: true },
    { code: 'Math-143', credits: 3.0, sessional: false },
    { code: 'EE-184', credits: 1.5, sessional: true },
    { code: 'CSE-143', credits: 3.0, sessional: false }
  ],
  L2T1: [
    { code: 'ME-246', credits: 1.5, sessional: true },
    { code: 'CSE-242', credits: 1.5, sessional: true },
    { code: 'CSE-221', credits: 3, sessional: false },
    { code: 'CSE-222', credits: 1.5, sessional: true },
    { code: 'CSE-200', credits: 0.75, sessional: true },
    { code: 'Math-241', credits: 3, sessional: false },
    { code: 'CSE-241', credits: 3, sessional: false },
    { code: 'HUM-243', credits: 3, sessional: false },
    { code: 'CSE-231', credits: 3, sessional: false }
  ],
  L2T2: [
    { code: 'EE-284', credits: 0.75, sessional: true },
    { code: 'CSE-244', credits: 1.5, sessional: true },
    { code: 'EE-283', credits: 3, sessional: false },
    { code: 'CSE-252', credits: 1.5, sessional: true },
    { code: 'CSE-223', credits: 3, sessional: false },
    { code: 'CSE-224', credits: 0.75, sessional: true },
    { code: 'Math-243', credits: 3, sessional: false },
    { code: 'CSE-202', credits: 1.5, sessional: true },
    { code: 'CSE-243', credits: 3, sessional: false },
    { code: 'CSE-251', credits: 3, sessional: false }
  ],
  L3T1: [
    { code: 'CSE-331', credits: 2.0, sessional: false },
    { code: 'CSE-333', credits: 3.0, sessional: false },
    { code: 'CSE-313', credits: 3.0, sessional: false },
    { code: 'CSE-335', credits: 3.0, sessional: false },
    { code: 'CSE-314', credits: 0.75, sessional: true },
    { code: 'CSE-326', credits: 1.5, sessional: true },
    { code: 'CSE-336', credits: 1.5, sessional: true },
    { code: 'CSE-334', credits: 1.5, sessional: true },
    { code: 'CSE-353', credits: 3, sessional: false },
    { code: 'CSE-354', credits: 0.75, sessional: true }
  ],
  L3T2: [
    { code: 'CSE-311', credits: 3, sessional: false },
    { code: 'CSE-321', credits: 3, sessional: false },
    { code: 'CSE-355', credits: 3, sessional: false },
    { code: 'CSE-345', credits: 3, sessional: false },
    { code: 'CSE-347', credits: 3, sessional: false },
    { code: 'CSE-312', credits: 1.5, sessional: true },
    { code: 'CSE-356', credits: 0.75, sessional: true },
    { code: 'CSE-346', credits: 1.5, sessional: true },
    { code: 'CSE-300', credits: 0.75, sessional: true },
    { code: 'CSE-302', credits: 0.75, sessional: true }
  ],
  L4T1: [
    { code: 'CSE-437', credits: 3, sessional: false },
    { code: 'CSE-435', credits: 3, sessional: false },
    { code: 'CSE-445', credits: 3, sessional: false },
    { code: 'CSE-436', credits: 0.75, sessional: true },
    { code: 'CSE-438', credits: 0.75, sessional: true },
    { code: 'CSE-446', credits: 0.75, sessional: true },
    { code: 'CSE-400', credits: 1.0, sessional: true },
    { code: 'CSE-402', credits: 1.5, sessional: true },
    { code: 'CSE-Option-I', credits: 3.75, sessional: false },
    { code: 'Hum-Option-I', credits: 2, sessional: false }
  ],
  L4T2: [
    { code: 'CSE-431', credits: 3, sessional: false },
    { code: 'CSE-457', credits: 3, sessional: false },
    { code: 'Hum-445', credits: 2, sessional: false },
    { code: 'Hum-447', credits: 2, sessional: false },
    { code: 'CSE-432', credits: 1.5, sessional: true },
    { code: 'CSE-458', credits: 0.75, sessional: true },
    { code: 'CSE-400', credits: 3, sessional: true },
    { code: 'CSE-Option-II', credits: 3, sessional: false }
  ]
};

// Grade distribution
const GRADE_POINTS: { [key: string]: number } = {
  'A+': 4.0,
  'A': 3.75,
  'A-': 3.5,
  'B+': 3.25,
  'B': 3.0
};

// Generate term data matching backend model structure
const generateTerm = (termId: string, avgGpa: number, variability: number = 0.3) => {
  const courses = COURSES[termId as keyof typeof COURSES].map(course => {
    const targetGpa = avgGpa + (Math.random() - 0.5) * variability;
    let selectedGrade = 'A';
    
    if (targetGpa >= 3.85) selectedGrade = 'A+';
    else if (targetGpa >= 3.6) selectedGrade = 'A';
    else if (targetGpa >= 3.35) selectedGrade = 'A-';
    else if (targetGpa >= 3.1) selectedGrade = 'B+';
    else selectedGrade = 'B';

    return {
      code: course.code,
      name: COURSE_NAMES[course.code] || course.code,
      credits: course.credits,
      grade: selectedGrade,
      gpa: GRADE_POINTS[selectedGrade]
    };
  });

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const totalPoints = courses.reduce((sum, c) => sum + (c.credits * c.gpa), 0);
  const actualGpa = parseFloat((totalPoints / totalCredits).toFixed(2));

  return {
    courses,
    term_gpa: actualGpa,
    term_credits: totalCredits
  };
};

export const seedStudents = async (advisorIds: Types.ObjectId[]) => {
  try {
    await Student.deleteMany({});
    console.log('Cleared existing students');

    const students = [];
    const demoAdvisorId = advisorIds[0];
    const advisor2Id = advisorIds[1];
    const advisor3Id = advisorIds[2];

    // ========== BATCH 19 - GRADUATED (3 students) ==========
    students.push({
      student_id: '1904015',
      registration_number: '2019831015',
      name: 'Md. Ashraful Islam',
      email: 'u1904015@student.cuet.ac.bd',
      department: 'CSE',
      batch: '19',
      session: '2019-20',
      phone: '+880 1712-000015',
      advisor_id: advisor2Id,
      L1T1: generateTerm('L1T1', 3.7),
      L1T2: generateTerm('L1T2', 3.7),
      L2T1: generateTerm('L2T1', 3.7),
      L2T2: generateTerm('L2T2', 3.7),
      L3T1: generateTerm('L3T1', 3.7),
      L3T2: generateTerm('L3T2', 3.7),
      L4T1: generateTerm('L4T1', 3.7),
      L4T2: generateTerm('L4T2', 3.7),
      cgpa: 3.68,
      next_semester_registration: undefined,
      registration_status: 'not_registered',
      approval_status: 'approved',
      graduation_status: 'graduated',
      thesisInfo: {
        topicAssigned: true,
        topicName: 'Deep Learning Based Medical Image Classification System',
        defenseDate: '2024-12-10',
        assignedTask: 'Thesis completed and defended'
      }
    });

    students.push({
      student_id: '1904028',
      registration_number: '2019831028',
      name: 'Fatema Akter',
      email: 'u1904028@student.cuet.ac.bd',
      department: 'CSE',
      batch: '19',
      session: '2019-20',
      phone: '+880 1712-000028',
      advisor_id: advisor3Id,
      L1T1: generateTerm('L1T1', 3.8),
      L1T2: generateTerm('L1T2', 3.8),
      L2T1: generateTerm('L2T1', 3.8),
      L2T2: generateTerm('L2T2', 3.8),
      L3T1: generateTerm('L3T1', 3.8),
      L3T2: generateTerm('L3T2', 3.8),
      L4T1: generateTerm('L4T1', 3.8),
      L4T2: generateTerm('L4T2', 3.8),
      cgpa: 3.79,
      next_semester_registration: undefined,
      registration_status: 'not_registered',
      approval_status: 'approved',
      graduation_status: 'graduated',
      thesisInfo: {
        topicAssigned: true,
        topicName: 'Blockchain-Based Secure Healthcare Data Management',
        defenseDate: '2024-12-12',
        assignedTask: 'Thesis completed and defended'
      }
    });

    students.push({
      student_id: '1904033',
      registration_number: '2019831033',
      name: 'Nusrat Jahan',
      email: 'u1904033@student.cuet.ac.bd',
      department: 'CSE',
      batch: '19',
      session: '2019-20',
      phone: '+880 1712-000033',
      advisor_id: demoAdvisorId,
      L1T1: generateTerm('L1T1', 3.6),
      L1T2: generateTerm('L1T2', 3.6),
      L2T1: generateTerm('L2T1', 3.6),
      L2T2: generateTerm('L2T2', 3.6),
      L3T1: generateTerm('L3T1', 3.6),
      L3T2: generateTerm('L3T2', 3.6),
      L4T1: generateTerm('L4T1', 3.6),
      L4T2: generateTerm('L4T2', 3.6),
      cgpa: 3.59,
      next_semester_registration: undefined,
      registration_status: 'not_registered',
      approval_status: 'approved',
      graduation_status: 'graduated',
      thesisInfo: {
        topicAssigned: true,
        topicName: 'IoT-Based Smart Home Automation System',
        defenseDate: '2024-12-15',
        assignedTask: 'Thesis completed and defended'
      }
    });

    // ========== BATCH 20 - FINAL YEAR (4 students) ==========
    students.push({
      student_id: '2004012',
      registration_number: '2020831012',
      name: 'Sadia Rahman',
      email: 'u2004012@student.cuet.ac.bd',
      department: 'CSE',
      batch: '20',
      session: '2020-21',
      phone: '+880 1713-000012',
      advisor_id: advisor2Id,
      L1T1: generateTerm('L1T1', 3.75),
      L1T2: generateTerm('L1T2', 3.75),
      L2T1: generateTerm('L2T1', 3.75),
      L2T2: generateTerm('L2T2', 3.75),
      L3T1: generateTerm('L3T1', 3.75),
      L3T2: generateTerm('L3T2', 3.75),
      L4T1: generateTerm('L4T1', 3.75),
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.74,
      next_semester_registration: 'L4T2',
      registration_status: 'registered',
      approval_status: 'pending',
      graduation_status: 'active',
      thesisInfo: {
        topicAssigned: true,
        topicName: 'Natural Language Processing for Bengali Text Analysis',
        assignedTask: 'Complete chapter 3 by next week',
        meetingDateTime: '2026-01-20 10:00 AM'
      }
    });

    students.push({
      student_id: '2004025',
      registration_number: '2020831025',
      name: 'Imran Hossain',
      email: 'u2004025@student.cuet.ac.bd',
      department: 'CSE',
      batch: '20',
      session: '2020-21',
      phone: '+880 1713-000025',
      advisor_id: advisor3Id,
      L1T1: generateTerm('L1T1', 3.65),
      L1T2: generateTerm('L1T2', 3.65),
      L2T1: generateTerm('L2T1', 3.65),
      L2T2: generateTerm('L2T2', 3.65),
      L3T1: generateTerm('L3T1', 3.65),
      L3T2: generateTerm('L3T2', 3.65),
      L4T1: generateTerm('L4T1', 3.65),
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.64,
      next_semester_registration: 'L4T2',
      registration_status: 'registered',
      approval_status: 'approved',
      graduation_status: 'active',
      thesisInfo: {
        topicAssigned: true,
        topicName: 'Cloud-Based Microservices Architecture for E-commerce',
        assignedTask: 'Implement payment gateway module',
        meetingDateTime: '2026-01-18 02:00 PM'
      }
    });

    students.push({
      student_id: '2004037',
      registration_number: '2020831037',
      name: 'Tahsin Ahmed',
      email: 'u2004037@student.cuet.ac.bd',
      department: 'CSE',
      batch: '20',
      session: '2020-21',
      phone: '+880 1713-000037',
      advisor_id: demoAdvisorId,
      L1T1: generateTerm('L1T1', 3.8),
      L1T2: generateTerm('L1T2', 3.8),
      L2T1: generateTerm('L2T1', 3.8),
      L2T2: generateTerm('L2T2', 3.8),
      L3T1: generateTerm('L3T1', 3.8),
      L3T2: generateTerm('L3T2', 3.8),
      L4T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T2: generateTerm('L4T2', 3.8),
      cgpa: 3.79,
      next_semester_registration: 'L4T1',
      registration_status: 'registered',
      approval_status: 'pending',
      graduation_status: 'active',
      thesisInfo: {
        topicAssigned: true,
        topicName: 'Real-time Object Detection Using YOLO Algorithm',
        assignedTask: 'Train model with custom dataset',
        meetingDateTime: '2026-01-22 11:00 AM'
      }
    });

    students.push({
      student_id: '2004041',
      registration_number: '2020831041',
      name: 'Lamia Sultana',
      email: 'u2004041@student.cuet.ac.bd',
      department: 'CSE',
      batch: '20',
      session: '2020-21',
      phone: '+880 1713-000041',
      advisor_id: advisor2Id,
      L1T1: generateTerm('L1T1', 3.55),
      L1T2: generateTerm('L1T2', 3.55),
      L2T1: generateTerm('L2T1', 3.55),
      L2T2: generateTerm('L2T2', 3.55),
      L3T1: generateTerm('L3T1', 3.55),
      L3T2: generateTerm('L3T2', 3.55),
      L4T1: generateTerm('L4T1', 3.55),
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.54,
      next_semester_registration: 'L4T2',
      registration_status: 'not_registered',
      approval_status: 'pending',
      graduation_status: 'active',
      thesisInfo: {
        topicAssigned: true,
        topicName: 'Mobile Application for Mental Health Monitoring',
        assignedTask: 'Design database schema',
        meetingDateTime: '2026-01-25 03:00 PM'
      }
    });

    // ========== BATCH 21 - DEMO ADVISOR (6 students) ==========
    // Demo students with real emails
    students.push({
      student_id: '2104040',
      registration_number: '2021831040',
      name: 'Junain Uddin',
      email: 'u2104040@student.cuet.ac.bd',
      department: 'CSE',
      batch: '21',
      session: '2021-22',
      phone: '+880 1714-000040',
      advisor_id: demoAdvisorId,
      L1T1: generateTerm('L1T1', 3.75),
      L1T2: generateTerm('L1T2', 3.75),
      L2T1: generateTerm('L2T1', 3.75),
      L2T2: generateTerm('L2T2', 3.75),
      L3T1: generateTerm('L3T1', 3.75),
      L3T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.73,
      next_semester_registration: 'L3T2',
      registration_status: 'registered',
      approval_status: 'pending',
      graduation_status: 'active',
      thesisInfo: {
        topicAssigned: true,
        topicName: 'AI-Powered Code Review System',
        assignedTask: 'Research existing code review tools',
        meetingDateTime: '2026-01-15 10:00 AM'
      }
    });

    students.push({
      student_id: '2104052',
      registration_number: '2021831052',
      name: 'Taha Ibne Abdullah',
      email: 'u2104052@student.cuet.ac.bd',
      department: 'CSE',
      batch: '21',
      session: '2021-22',
      phone: '+880 1714-000052',
      advisor_id: demoAdvisorId,
      L1T1: generateTerm('L1T1', 3.65),
      L1T2: generateTerm('L1T2', 3.65),
      L2T1: generateTerm('L2T1', 3.65),
      L2T2: generateTerm('L2T2', 3.65),
      L3T1: generateTerm('L3T1', 3.65),
      L3T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.64,
      next_semester_registration: 'L3T2',
      registration_status: 'registered',
      approval_status: 'pending',
      graduation_status: 'active'
    });

    students.push({
      student_id: '2104048',
      registration_number: '2021831048',
      name: 'Rahul Dutta',
      email: 'u2104048@student.cuet.ac.bd',
      department: 'CSE',
      batch: '21',
      session: '2021-22',
      phone: '+880 1714-000048',
      advisor_id: demoAdvisorId,
      L1T1: generateTerm('L1T1', 3.8),
      L1T2: generateTerm('L1T2', 3.8),
      L2T1: generateTerm('L2T1', 3.8),
      L2T2: generateTerm('L2T2', 3.8),
      L3T1: generateTerm('L3T1', 3.8),
      L3T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.79,
      next_semester_registration: 'L3T2',
      registration_status: 'registered',
      approval_status: 'pending',
      graduation_status: 'active'
    });

    students.push({
      student_id: '2104053',
      registration_number: '2021831053',
      name: 'Rafiul Islam',
      email: 'u2104053@student.cuet.ac.bd',
      department: 'CSE',
      batch: '21',
      session: '2021-22',
      phone: '+880 1714-000053',
      advisor_id: demoAdvisorId,
      L1T1: generateTerm('L1T1', 3.7),
      L1T2: generateTerm('L1T2', 3.7),
      L2T1: generateTerm('L2T1', 3.7),
      L2T2: generateTerm('L2T2', 3.7),
      L3T1: generateTerm('L3T1', 3.7),
      L3T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.7,
      next_semester_registration: 'L3T2',
      registration_status: 'registered',
      approval_status: 'approved',
      graduation_status: 'active'
    });

    students.push({
      student_id: '2104060',
      registration_number: '2021831060',
      name: 'Nadia Khan',
      email: 'u2104060@student.cuet.ac.bd',
      department: 'CSE',
      batch: '21',
      session: '2021-22',
      phone: '+880 1714-000060',
      advisor_id: demoAdvisorId,
      L1T1: generateTerm('L1T1', 3.55),
      L1T2: generateTerm('L1T2', 3.55),
      L2T1: generateTerm('L2T1', 3.55),
      L2T2: generateTerm('L2T2', 3.55),
      L3T1: generateTerm('L3T1', 3.55),
      L3T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.55,
      next_semester_registration: 'L3T2',
      registration_status: 'registered',
      approval_status: 'rejected',
      graduation_status: 'active'
    });

    students.push({
      student_id: '2104064',
      registration_number: '2021831064',
      name: 'Sabbir Ahmed',
      email: 'u2104064@student.cuet.ac.bd',
      department: 'CSE',
      batch: '21',
      session: '2021-22',
      phone: '+880 1714-000064',
      advisor_id: demoAdvisorId,
      L1T1: generateTerm('L1T1', 3.75),
      L1T2: generateTerm('L1T2', 3.75),
      L2T1: generateTerm('L2T1', 3.75),
      L2T2: generateTerm('L2T2', 3.75),
      L3T1: generateTerm('L3T1', 3.75),
      L3T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.75,
      next_semester_registration: 'L3T2',
      registration_status: 'registered',
      approval_status: 'pending',
      graduation_status: 'active',
      thesisInfo: {
        topicAssigned: true,
        topicName: 'Smart Healthcare Monitoring System',
        assignedTask: 'Design system architecture'
      }
    });

    // One student under advisor 2
    students.push({
      student_id: '2104019',
      registration_number: '2021831019',
      name: 'Sazzad Hossain',
      email: 'u2104019@student.cuet.ac.bd',
      department: 'CSE',
      batch: '21',
      session: '2021-22',
      phone: '+880 1714-000019',
      advisor_id: advisor2Id,
      L1T1: generateTerm('L1T1', 3.7),
      L1T2: generateTerm('L1T2', 3.7),
      L2T1: generateTerm('L2T1', 3.7),
      L2T2: generateTerm('L2T2', 3.7),
      L3T1: generateTerm('L3T1', 3.7),
      L3T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.69,
      next_semester_registration: 'L3T2',
      registration_status: 'registered',
      approval_status: 'approved',
      graduation_status: 'active'
    });

    // ========== BATCH 22 - L2 STUDENTS (3 students) ==========
    students.push({
      student_id: '2204015',
      registration_number: '2022831015',
      name: 'Minhaj Uddin',
      email: 'u2204015@student.cuet.ac.bd',
      department: 'CSE',
      batch: '22',
      session: '2022-23',
      phone: '+880 1715-000015',
      advisor_id: demoAdvisorId,
      L1T1: generateTerm('L1T1', 3.65),
      L1T2: generateTerm('L1T2', 3.65),
      L2T1: generateTerm('L2T1', 3.65),
      L2T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L3T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L3T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.64,
      next_semester_registration: 'L2T2',
      registration_status: 'registered',
      approval_status: 'pending',
      graduation_status: 'active'
    });

    students.push({
      student_id: '2204028',
      registration_number: '2022831028',
      name: 'Rumana Akter',
      email: 'u2204028@student.cuet.ac.bd',
      department: 'CSE',
      batch: '22',
      session: '2022-23',
      phone: '+880 1715-000028',
      advisor_id: advisor3Id,
      L1T1: generateTerm('L1T1', 3.75),
      L1T2: generateTerm('L1T2', 3.75),
      L2T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L2T2: generateTerm('L2T2', 3.75),
      L3T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L3T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.74,
      next_semester_registration: 'L2T1',
      registration_status: 'registered',
      approval_status: 'approved',
      graduation_status: 'active'
    });

    students.push({
      student_id: '2204033',
      registration_number: '2022831033',
      name: 'Sadman Sakib',
      email: 'u2204033@student.cuet.ac.bd',
      department: 'CSE',
      batch: '22',
      session: '2022-23',
      phone: '+880 1715-000033',
      advisor_id: advisor2Id,
      L1T1: generateTerm('L1T1', 3.7),
      L1T2: generateTerm('L1T2', 3.7),
      L2T1: generateTerm('L2T1', 3.7),
      L2T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L3T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L3T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.69,
      next_semester_registration: 'L2T2',
      registration_status: 'not_registered',
      approval_status: 'pending',
      graduation_status: 'active'
    });

    // ========== BATCH 23 - L1 STUDENTS (2 students) ==========
    students.push({
      student_id: '2304020',
      registration_number: '2023831020',
      name: 'Tamim Iqbal',
      email: 'u2304020@student.cuet.ac.bd',
      department: 'CSE',
      batch: '23',
      session: '2023-24',
      phone: '+880 1716-000020',
      advisor_id: advisor3Id,
      L1T1: generateTerm('L1T1', 3.6),
      L1T2: generateTerm('L1T2', 3.6),
      L2T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L2T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L3T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L3T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.59,
      next_semester_registration: 'L2T1',
      registration_status: 'registered',
      approval_status: 'pending',
      graduation_status: 'active'
    });

    students.push({
      student_id: '2304045',
      registration_number: '2023831045',
      name: 'Priyanka Das',
      email: 'u2304045@student.cuet.ac.bd',
      department: 'CSE',
      batch: '23',
      session: '2023-24',
      phone: '+880 1716-000045',
      advisor_id: demoAdvisorId,
      L1T1: generateTerm('L1T1', 3.8),
      L1T2: generateTerm('L1T2', 3.8),
      L2T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L2T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L3T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L3T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.79,
      next_semester_registration: 'L2T1',
      registration_status: 'registered',
      approval_status: 'approved',
      graduation_status: 'active'
    });

    // ========== BATCH 24 - FRESHMAN (1 student) ==========
    students.push({
      student_id: '2404010',
      registration_number: '2024831010',
      name: 'Arif Hossain',
      email: 'u2404010@student.cuet.ac.bd',
      department: 'CSE',
      batch: '24',
      session: '2024-25',
      phone: '+880 1717-000010',
      advisor_id: advisor2Id,
      L1T1: generateTerm('L1T1', 3.7),
      L1T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L2T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L2T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L3T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L3T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T1: { courses: [], term_gpa: undefined, term_credits: undefined },
      L4T2: { courses: [], term_gpa: undefined, term_credits: undefined },
      cgpa: 3.69,
      next_semester_registration: 'L1T2',
      registration_status: 'registered',
      approval_status: 'pending',
      graduation_status: 'active'
    });

    await Student.insertMany(students);
    console.log(`✅ Seeded ${students.length} students`);

  } catch (error: any) {
    console.error('❌ Error seeding students:', error.message);
    throw error;
  }
};
