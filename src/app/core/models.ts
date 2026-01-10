export interface Course {
  courseCode: string;
  courseCredit: number;
  sessional: boolean;
  result: string;
  courseType: string;
}

export interface Term {
  termId: string;
  approved: boolean;
  gpa: number;
  courses: Course[];
  resultPublished?: boolean; // New field to track if results are published
}

export interface ThesisInfo {
  topicAssigned: boolean;
  topicName?: string;
  defenseDate?: string;
  assignedTask?: string;
  meetingDateTime?: string;
}

export interface Student {
  studentId: string;
  name: string;
  email: string; // Added email field
  batch: string;
  terms: Term[];
  overallCgpa: number;
  nextSemesterRegistration?: string; // Next semester they're trying to register for
  approval_status: 'approved' | 'disapproved'; // Overall approval status for next semester registration
  thesisInfo?: ThesisInfo; // Thesis information
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  advisor?: {
    name: string;
    email: string;
    department: string;
  };
}
