export interface Student {
  studentId: string;
  name: string;
  email: string; // Added email field
  batch: string;
  terms: Term[];
  overallCgpa: number;
  nextSemesterRegistration?: string; // Next semester they're trying to register for
  registrationStatus: 'registered' | 'not_registered'; // Registration status for current semester
  approval_status: 'approved' | 'disapproved' | 'pending'; // Overall approval status for next semester registration
  graduationStatus: 'graduated' | 'active'; // Graduation status
  thesisInfo?: ThesisInfo; // Thesis information
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

export interface Course {
  courseCode: string;
  courseCredit: number;
  sessional: boolean;
  result: string;
  courseType: string;
}

export interface ApprovalRequest {
  studentId: string;
  currentStatus: 'approved' | 'disapproved' | 'pending';
  newStatus: 'approved' | 'disapproved';
  generatedContent?: string;
}

export interface ApprovalResponse {
  success: boolean;
  generatedContent?: string;
  message?: string;
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
