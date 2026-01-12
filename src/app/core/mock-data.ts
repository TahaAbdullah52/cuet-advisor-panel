// src/app/core/mock-data.ts
import { Student } from "./models";

/* -------------------------
   ALL SEMESTER COURSES DATA
-------------------------- */

// Level 1 Term 1 Courses
const L1T1_COURSES = [
  { courseCode: "Math-101", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "Math-102", courseCredit: 0.75, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "Phy-101", courseCredit: 3.0, sessional: false, result: "A", courseType: "regular" },
  { courseCode: "Phy-102", courseCredit: 0.75, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "Chem-101", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "Chem-102", courseCredit: 0.75, sessional: true, result: "A", courseType: "regular" },
  { courseCode: "ME-101", courseCredit: 1.5, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "EEE-101", courseCredit: 1.5, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "Hum-101", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" }
];

// Level 1 Term 2 Courses
const L1T2_COURSES = [
  { courseCode: "Math-103", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "Math-104", courseCredit: 0.75, sessional: true, result: "A", courseType: "regular" },
  { courseCode: "Phy-103", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "Phy-104", courseCredit: 0.75, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "CSE-101", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-102", courseCredit: 0.75, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "ME-103", courseCredit: 1.5, sessional: true, result: "A", courseType: "regular" },
  { courseCode: "EEE-103", courseCredit: 1.5, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "Hum-103", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" }
];

// Level 2 Term 1 Courses
const L2T1_COURSES = [
  { courseCode: "Math-201", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-201", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-203", courseCredit: 3.0, sessional: false, result: "A", courseType: "regular" },
  { courseCode: "CSE-204", courseCredit: 0.75, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "EEE-201", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "EEE-202", courseCredit: 0.75, sessional: true, result: "A", courseType: "regular" },
  { courseCode: "Stat-201", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "Hum-201", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" }
];

// Level 2 Term 2 Courses
const L2T2_COURSES = [
  { courseCode: "EE-284", courseCredit: 0.75, sessional: true, result: "A-", courseType: "regular" },
  { courseCode: "CSE-244", courseCredit: 1.5, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "EE-283", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-252", courseCredit: 1.5, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "CSE-223", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-224", courseCredit: 0.75, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "Math-243", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-202", courseCredit: 1.5, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "CSE-243", courseCredit: 3.0, sessional: false, result: "A", courseType: "regular" },
  { courseCode: "CSE-251", courseCredit: 3.0, sessional: false, result: "A", courseType: "regular" }
];

// Level 3 Term 1 Courses
const L3T1_COURSES = [
  { courseCode: "CSE-331", courseCredit: 2.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-333", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-313", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-335", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-314", courseCredit: 0.75, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "CSE-326", courseCredit: 1.5, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "CSE-336", courseCredit: 1.5, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "CSE-334", courseCredit: 1.5, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "CSE-353", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-354", courseCredit: 0.75, sessional: true, result: "A+", courseType: "regular" }
];

// Level 3 Term 2 Courses
const L3T2_COURSES = [
  { courseCode: "CSE-341", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-342", courseCredit: 0.75, sessional: true, result: "A", courseType: "regular" },
  { courseCode: "CSE-343", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-344", courseCredit: 0.75, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "CSE-345", courseCredit: 3.0, sessional: false, result: "A", courseType: "regular" },
  { courseCode: "CSE-346", courseCredit: 0.75, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "CSE-347", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-348", courseCredit: 1.5, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "Hum-341", courseCredit: 3.0, sessional: false, result: "A", courseType: "regular" }
];

// Level 4 Term 1 Courses
const L4T1_COURSES = [
  { courseCode: "CSE-401", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-402", courseCredit: 0.75, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "CSE-403", courseCredit: 3.0, sessional: false, result: "A", courseType: "regular" },
  { courseCode: "CSE-404", courseCredit: 0.75, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "CSE-405", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-406", courseCredit: 0.75, sessional: true, result: "A", courseType: "regular" },
  { courseCode: "CSE-407", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-408", courseCredit: 1.5, sessional: true, result: "A+", courseType: "regular" }
];

// Level 4 Term 2 Courses
const L4T2_COURSES = [
  { courseCode: "CSE-411", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-412", courseCredit: 0.75, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "CSE-413", courseCredit: 3.0, sessional: false, result: "A", courseType: "regular" },
  { courseCode: "CSE-414", courseCredit: 0.75, sessional: true, result: "A+", courseType: "regular" },
  { courseCode: "CSE-415", courseCredit: 3.0, sessional: false, result: "A+", courseType: "regular" },
  { courseCode: "CSE-416", courseCredit: 0.75, sessional: true, result: "A", courseType: "regular" },
  { courseCode: "CSE-499", courseCredit: 3.0, sessional: false, result: "A+", courseType: "thesis" }
];

/* -------------------------
   REALISTIC STUDENT NAMES
-------------------------- */
const STUDENT_NAMES = [
  "Md. Rafiul Islam", "Fatema Khatun", "Arif Hossain", "Nusrat Jahan",
  "Tanvir Ahmed", "Sadia Rahman", "Mehedi Hassan", "Rashida Begum",
  "Sabbir Khan", "Taslima Akter", "Imran Ali", "Ruma Parvin",
  "Karim Uddin", "Nasreen Sultana", "Habib Rahman", "Salma Khatun",
  "Mizanur Rahman", "Shahida Begum", "Alamgir Hossain", "Rehana Akter"
];

// Helper function to generate email from name and student ID
function generateEmail(name: string, studentId: string): string {
  const nameParts = name.toLowerCase()
    .replace(/md\.|dr\.|prof\./g, '') // Remove titles
    .replace(/[^a-z\s]/g, '') // Remove special characters
    .trim()
    .split(' ')
    .filter(part => part.length > 0);
  
  const firstName = nameParts[0] || 'student';
  const lastName = nameParts[nameParts.length - 1] || '';
  
  return `${firstName}${lastName ? '.' + lastName : ''}.${studentId}@student.cuet.ac.bd`;
}

// Helper function to generate thesis information
function generateThesisInfo(batch: string, studentIndex: number): any {
  const batchNum = parseInt(batch);
  
  // Only final year students (batch 20) have thesis assigned
  if (batchNum === 20) {
    const thesisTopics = [
      "Machine Learning Applications in Healthcare",
      "Blockchain Technology for Supply Chain Management",
      "IoT-based Smart City Solutions",
      "Cybersecurity in Cloud Computing",
      "AI-powered Educational Systems",
      "Computer Vision for Medical Diagnosis",
      "Natural Language Processing for Bengali Text",
      "Distributed Systems for Big Data Processing"
    ];
    
    return {
      topicAssigned: true,
      topicName: thesisTopics[studentIndex % thesisTopics.length],
      defenseDate: studentIndex % 2 === 0 ? "2024-12-15" : "", // Some have defense dates
      assignedTask: "Literature Review and System Design",
      meetingDateTime: studentIndex % 3 === 0 ? "2024-11-20 10:00 AM" : "" // Some have meetings
    };
  }
  
  // Other batches don't have thesis yet
  return {
    topicAssigned: false,
    topicName: "",
    defenseDate: "",
    assignedTask: "",
    meetingDateTime: ""
  };
}

function getTermsForBatch(batch: string) {
  const batchNum = parseInt(batch);
  const allTerms = [
    { id: "L1T1", courses: L1T1_COURSES },
    { id: "L1T2", courses: L1T2_COURSES },
    { id: "L2T1", courses: L2T1_COURSES },
    { id: "L2T2", courses: L2T2_COURSES },
    { id: "L3T1", courses: L3T1_COURSES },
    { id: "L3T2", courses: L3T2_COURSES },
    { id: "L4T1", courses: L4T1_COURSES },
    { id: "L4T2", courses: L4T2_COURSES }
  ];

  let publishedTermsCount = 0;
  if (batchNum === 19) publishedTermsCount = 8; // All results published
  else if (batchNum === 20) publishedTermsCount = 7; // Up to L4T1
  else if (batchNum === 21) publishedTermsCount = 5; // Up to L3T1
  else if (batchNum === 22) publishedTermsCount = 4; // Up to L2T2
  else if (batchNum === 23) publishedTermsCount = 3; // Up to L2T1
  else if (batchNum === 24) publishedTermsCount = 2; // Up to L1T2

  const terms = [];
  
  // Add published terms with results (automatically approved)
  for (let i = 0; i < publishedTermsCount; i++) {
    const term = allTerms[i];
    terms.push({
      termId: term.id,
      approved: true, // All published results are automatically approved
      gpa: +(3.2 + Math.random() * 0.8).toFixed(2),
      courses: [...term.courses],
      resultPublished: true
    });
  }

  // Add unpublished terms
  for (let i = publishedTermsCount; i < 8; i++) {
    const term = allTerms[i];
    terms.push({
      termId: term.id,
      approved: false,
      gpa: 0,
      courses: term.courses.map(course => ({
        ...course,
        result: "Result Not Published"
      })),
      resultPublished: false
    });
  }

  return terms;
}

// Helper function to get next semester for registration
function getNextSemesterForRegistration(batch: string): string {
  const batchNum = parseInt(batch);
  const currentYear = 2024;
  const batchYear = 2000 + batchNum;
  const yearsCompleted = currentYear - batchYear;
  
  if (batchNum === 19) return "Graduated"; // All semesters completed
  else if (batchNum === 20) return "L4T2"; // Registering for final semester
  else if (batchNum === 21) return "L3T2"; // Registering for 3-2
  else if (batchNum === 22) return "L3T1"; // Registering for 3-1
  else if (batchNum === 23) return "L2T2"; // Registering for 2-2
  else if (batchNum === 24) return "L2T1"; // Registering for 2-1
  
  return "L1T1";
}

// Helper function to get approval status based on registration workflow
function getApprovalStatus(batch: string, studentIndex: number, registrationStatus: 'registered' | 'not_registered'): 'approved' | 'disapproved' | 'pending' {
  const batchNum = parseInt(batch);
  
  // Graduated students don't need approval
  if (batchNum === 19) return 'approved';
  
  // Only registered students can have approval status
  if (registrationStatus === 'not_registered') return 'pending';
  
  // For registered students, create a mix of statuses for testing
  // This creates a realistic distribution: some approved, some pending, some disapproved
  if (studentIndex % 4 === 0) return 'approved';    // 25% approved
  if (studentIndex % 4 === 1) return 'disapproved'; // 25% disapproved  
  return 'pending';                                  // 50% pending
}

// Helper function to get graduation status
function getGraduationStatus(batch: string): 'graduated' | 'active' {
  const batchNum = parseInt(batch);
  
  // Batch 19 has graduated
  if (batchNum === 19) return 'graduated';
  
  // All other batches are still active
  return 'active';
}

// Helper function to get registration status
function getRegistrationStatus(batch: string, studentIndex: number): 'registered' | 'not_registered' {
  const batchNum = parseInt(batch);
  
  // Graduated students don't need registration
  if (batchNum === 19) return 'registered';
  
  // Mix of registration statuses: 60% registered, 40% not registered
  return studentIndex % 5 < 3 ? 'registered' : 'not_registered';
}

/* -------------------------
   STUDENTS (20 MOCK ACROSS BATCHES 19-24)
-------------------------- */
export const STUDENTS: Student[] = Array.from({ length: 20 }).map((_, i) => {
  const batchYear = 19 + (i % 6); // Distribute across batches 19-24
  const deptCode = "04"; // CSE department
  const studentNum = String(i + 1).padStart(3, "0");
  
  const terms = getTermsForBatch(String(batchYear));
  
  // Calculate overall CGPA from published terms only
  const publishedTerms = terms.filter(t => t.resultPublished);
  const overallCgpa = publishedTerms.length > 0 
    ? +(publishedTerms.reduce((sum, t) => sum + t.gpa, 0) / publishedTerms.length).toFixed(2)
    : 0;
  
  const studentId = `${batchYear}${deptCode}${studentNum}`;
  const studentName = STUDENT_NAMES[i];
  const registrationStatus = getRegistrationStatus(String(batchYear), i);
  
  return {
    studentId,
    name: studentName,
    email: generateEmail(studentName, studentId),
    batch: String(batchYear),
    overallCgpa,
    terms,
    nextSemesterRegistration: getNextSemesterForRegistration(String(batchYear)),
    registrationStatus: registrationStatus,
    approval_status: getApprovalStatus(String(batchYear), i, registrationStatus),
    graduationStatus: getGraduationStatus(String(batchYear)),
    thesisInfo: generateThesisInfo(String(batchYear), i)
  };
});

/* -------------------------
   BATCH-WISE STATISTICS
-------------------------- */
export const getBatchWiseStats = () => {
  const batchMap: Record<string, Student[]> = {};
  
  STUDENTS.forEach(student => {
    if (!batchMap[student.batch]) {
      batchMap[student.batch] = [];
    }
    batchMap[student.batch].push(student);
  });

  return Object.keys(batchMap)
    .sort()
    .map(batch => ({
      batch,
      students: batchMap[batch],
      averageGpa: +(batchMap[batch]
        .filter(s => s.overallCgpa > 0)
        .reduce((sum, s) => sum + s.overallCgpa, 0) / 
        batchMap[batch].filter(s => s.overallCgpa > 0).length || 0).toFixed(2),
      totalStudents: batchMap[batch].length,
      approvedCount: batchMap[batch].filter(s => s.terms.some(t => t.approved && t.resultPublished)).length
    }));
};
