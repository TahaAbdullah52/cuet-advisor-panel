import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, TimeoutError } from 'rxjs';
import { catchError, delay, map, timeout } from 'rxjs/operators';
import { Student, LoginCredentials, LoginResponse, ThesisInfo, ApprovalRequest, ApprovalResponse } from './models';
import { RoutineEntry } from './routine.models';
import { STUDENTS } from './mock-data';
import { MOCK_ROUTINE } from './routine-mock-data';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;
  private readonly useMockData = environment.useMockData;
  private readonly mockDelay = environment.mockDataDelay;

  constructor(private http: HttpClient) {
    console.log(`API Service initialized: ${this.useMockData ? 'Mock Data Mode' : 'Database Mode'}`);
  }

  // Authentication API
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    if (this.useMockData) {
      return this.mockLogin(credentials);
    }
    
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        timeout(10000), // 10 second timeout
        catchError((error) => {
          console.error('Login API error:', error);
          // Always return success: false for any error
          const errorMessage = error instanceof TimeoutError 
            ? 'Request timeout. Please check your connection.' 
            : (error.error?.message || error.message || 'Invalid credentials');
          
          return of({
            success: false,
            message: errorMessage
          } as LoginResponse);
        })
      );
  }

  updatePassword(passwordData: { currentPassword: string, newPassword: string, email: string }): Observable<ApiResponse<boolean>> {
    if (this.useMockData) {
      return this.mockUpdatePassword(passwordData);
    }
    
    return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/auth/password`, passwordData)
      .pipe(
        catchError(error => {
          console.warn('Password update API call failed, falling back to mock:', error);
          return this.mockUpdatePassword(passwordData);
        })
      );
  }

  // Students API
  getStudents(): Observable<ApiResponse<Student[]>> {
    if (this.useMockData) {
      return this.getMockStudents();
    }
    
    return this.http.get<ApiResponse<Student[]>>(`${this.baseUrl}/students`)
      .pipe(
        catchError(error => {
          console.warn('API call failed, falling back to mock data:', error);
          return this.getMockStudents();
        })
      );
  }

  getStudent(id: string): Observable<ApiResponse<Student>> {
    if (this.useMockData) {
      return this.getMockStudent(id);
    }

    return this.http.get<ApiResponse<Student>>(`${this.baseUrl}/students/${id}`)
      .pipe(
        catchError(error => {
          console.warn('API call failed, falling back to mock data:', error);
          return this.getMockStudent(id);
        })
      );
  }

  updateStudent(student: Student): Observable<ApiResponse<Student>> {
    if (this.useMockData) {
      return this.updateMockStudent(student);
    }

    return this.http.put<ApiResponse<Student>>(`${this.baseUrl}/students/${student.studentId}`, student)
      .pipe(
        catchError(error => {
          console.warn('API call failed, falling back to mock data:', error);
          return this.updateMockStudent(student);
        })
      );
  }

  approveStudent(studentId: string, termId?: string): Observable<ApiResponse<Student>> {
    if (this.useMockData) {
      return this.approveMockStudent(studentId, termId);
    }

    const payload = { studentId, termId };
    return this.http.post<ApiResponse<Student>>(`${this.baseUrl}/students/approve`, payload)
      .pipe(
        catchError(error => {
          console.warn('API call failed, falling back to mock data:', error);
          return this.approveMockStudent(studentId, termId);
        })
      );
  }

  // ML-based approval with generated content
  generateApprovalContent(approvalRequest: ApprovalRequest): Observable<ApprovalResponse> {
    if (this.useMockData) {
      return this.mockGenerateApprovalContent(approvalRequest);
    }

    // Backend expects 'approved' or 'rejected', convert 'disapproved' to 'rejected'
    const backendRequest = {
      ...approvalRequest,
      newStatus: approvalRequest.newStatus === 'disapproved' ? 'rejected' : approvalRequest.newStatus
    };
    
    console.log('🔵 [API] generateApprovalContent called');
    console.log('Frontend request:', approvalRequest);
    console.log('Backend request:', backendRequest);

    return this.http.post<ApprovalResponse>(`${this.baseUrl}/students/generate-approval`, backendRequest)
      .pipe(
        timeout(30000), // 30 second timeout for AI generation
        catchError((error) => {
          console.error('ML API error:', error);
          if (error instanceof TimeoutError) {
            return of({
              success: false,
              message: 'AI generation timeout. Using fallback...'
            });
          }
          console.warn('ML API call failed, falling back to mock:', error);
          return this.mockGenerateApprovalContent(approvalRequest);
        })
      );
  }

  sendApprovalEmail(studentId: string, content: string, status: 'approved' | 'disapproved'): Observable<ApiResponse<boolean>> {
    if (this.useMockData) {
      return this.mockSendApprovalEmail(studentId, content, status);
    }

    // Backend expects 'approved' or 'rejected', convert 'disapproved' to 'rejected'
    const backendStatus = status === 'disapproved' ? 'rejected' : 'approved';
    console.log('🔵 [API] sendApprovalEmail called');
    console.log('Student ID:', studentId);
    console.log('Content length:', content.length);
    console.log('Frontend status:', status);
    console.log('Backend status:', backendStatus);
    
    const payload = { studentId, emailContent: content, newStatus: backendStatus };
    console.log('Payload:', payload);
    
    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/students/send-approval-email`, payload)
      .pipe(
        catchError(error => {
          console.error('❌ [API] Email send error:', error);
          console.warn('Email API call failed, falling back to mock:', error);
          return this.mockSendApprovalEmail(studentId, content, status);
        })
      );
  }

  approveMultipleStudents(studentIds: string[]): Observable<ApiResponse<Student[]>> {
    if (this.useMockData) {
      return this.approveMultipleMockStudents(studentIds);
    }

    return this.http.post<ApiResponse<Student[]>>(`${this.baseUrl}/students/approve-multiple`, { studentIds })
      .pipe(
        catchError(error => {
          console.warn('API call failed, falling back to mock data:', error);
          return this.approveMultipleMockStudents(studentIds);
        })
      );
  }

  // Thesis API
  updateThesisInfo(studentId: string, thesisInfo: ThesisInfo): Observable<ApiResponse<Student>> {
    if (this.useMockData) {
      return this.updateMockThesisInfo(studentId, thesisInfo);
    }

    return this.http.put<ApiResponse<Student>>(`${this.baseUrl}/students/${studentId}/thesis`, thesisInfo)
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Update thesis API error:', error);
          return of({
            success: false,
            error: error instanceof TimeoutError 
              ? 'Request timeout' 
              : error.error?.message || 'Failed to update thesis information'
          });
        })
      );
  }

  addThesisStudent(studentData: { name: string, studentId: string }): Observable<ApiResponse<Student>> {
    if (this.useMockData) {
      return this.addMockThesisStudent(studentData);
    }

    return this.http.post<ApiResponse<Student>>(`${this.baseUrl}/thesis/students`, studentData)
      .pipe(
        catchError(error => {
          console.warn('API call failed, falling back to mock data:', error);
          return this.addMockThesisStudent(studentData);
        })
      );
  }

  removeThesisStudent(studentId: string): Observable<ApiResponse<boolean>> {
    if (this.useMockData) {
      return this.removeMockThesisStudent(studentId);
    }

    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/thesis/students/${studentId}`)
      .pipe(
        catchError(error => {
          console.warn('API call failed, falling back to mock data:', error);
          return this.removeMockThesisStudent(studentId);
        })
      );
  }

  // Routine API
  getRoutines(): Observable<ApiResponse<RoutineEntry[]>> {
    if (this.useMockData) {
      return this.getMockRoutines();
    }

    return this.http.get<ApiResponse<RoutineEntry[]>>(`${this.baseUrl}/routines`)
      .pipe(
        catchError(error => {
          console.warn('API call failed, falling back to mock data:', error);
          return this.getMockRoutines();
        })
      );
  }

  addRoutine(routine: RoutineEntry): Observable<ApiResponse<RoutineEntry[]>> {
    if (this.useMockData) {
      return this.addMockRoutine(routine).pipe(
        map(response => ({
          ...response,
          data: response.data ? [response.data] : []
        }))
      );
    }

    // Transform frontend format to backend format
    const currentYear = new Date().getFullYear();
    const batchYear = routine.batchName.replace('Batch ', '20'); // Extract year from "Batch 21" -> "2021"
    
    const backendFormat = {
      semester: 'Spring', // Default to current semester
      academic_year: `${currentYear}-${(currentYear + 1).toString().slice(-2)}`,
      entries: [{
        day: routine.dayName,
        time: `${routine.startTime} - ${routine.endTime}`,
        course_code: 'CSE' + Math.floor(Math.random() * 1000), // Generate course code if not provided
        course_name: routine.courseName,
        room: routine.roomNo,
        type: routine.type.toLowerCase() === 'lab' ? 'lab' : 'lecture'
      }]
    };

    return this.http.post<ApiResponse<RoutineEntry[]>>(`${this.baseUrl}/routines`, backendFormat)
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Add routine API error:', error);
          return of({
            success: false,
            error: error instanceof TimeoutError 
              ? 'Request timeout' 
              : error.error?.message || 'Failed to add routine'
          });
        })
      );
  }

  removeRoutine(routineId: string): Observable<ApiResponse<boolean>> {
    if (this.useMockData) {
      return this.removeMockRoutine(routineId);
    }

    // Extract MongoDB ID from composite ID (format: mongoId_courseCode)
    const mongoId = routineId.split('_')[0];

    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/routines/${mongoId}`)
      .pipe(
        catchError(error => {
          console.warn('API call failed, falling back to mock data:', error);
          return this.removeMockRoutine(routineId);
        })
      );
  }

  // Mock Data Methods (Fallback)
  private getMockStudents(): Observable<ApiResponse<Student[]>> {
    return of({
      success: true,
      data: [...STUDENTS],
      message: 'Students retrieved successfully (mock data)'
    }).pipe(delay(this.mockDelay));
  }

  private getMockStudent(id: string): Observable<ApiResponse<Student>> {
    const student = STUDENTS.find(s => s.studentId === id);
    
    if (student) {
      return of({
        success: true,
        data: { ...student },
        message: 'Student retrieved successfully (mock data)'
      }).pipe(delay(this.mockDelay));
    } else {
      return of({
        success: false,
        error: 'Student not found'
      }).pipe(delay(this.mockDelay));
    }
  }

  private updateMockStudent(student: Student): Observable<ApiResponse<Student>> {
    const index = STUDENTS.findIndex(s => s.studentId === student.studentId);
    
    if (index !== -1) {
      STUDENTS[index] = { ...student };
      return of({
        success: true,
        data: { ...student },
        message: 'Student updated successfully (mock data)'
      }).pipe(delay(this.mockDelay));
    } else {
      return of({
        success: false,
        error: 'Student not found'
      }).pipe(delay(this.mockDelay));
    }
  }

  private approveMockStudent(studentId: string, termId?: string): Observable<ApiResponse<Student>> {
    const student = STUDENTS.find(s => s.studentId === studentId);
    
    if (student) {
      if (termId) {
        const term = student.terms.find(t => t.termId === termId);
        if (term && term.resultPublished) {
          term.approved = !term.approved;
        }
      } else {
        // Toggle overall approval status for next semester registration
        if (student.nextSemesterRegistration !== 'Graduated') {
          student.approval_status = student.approval_status === 'approved' ? 'disapproved' : 'approved';
        }
      }

      return of({
        success: true,
        data: { ...student },
        message: 'Student approval updated successfully (mock data)'
      }).pipe(delay(this.mockDelay));
    } else {
      return of({
        success: false,
        error: 'Student not found'
      }).pipe(delay(this.mockDelay));
    }
  }

  private approveMultipleMockStudents(studentIds: string[]): Observable<ApiResponse<Student[]>> {
    const updatedStudents: Student[] = [];

    studentIds.forEach(studentId => {
      const student = STUDENTS.find(s => s.studentId === studentId);
      if (student && student.nextSemesterRegistration !== 'Graduated') {
        student.approval_status = 'approved';
        updatedStudents.push({ ...student });
      }
    });

    return of({
      success: true,
      data: updatedStudents,
      message: `${updatedStudents.length} students approved successfully (mock data)`
    }).pipe(delay(this.mockDelay));
  }

  // Mock Login Method
  private mockLogin(credentials: LoginCredentials): Observable<LoginResponse> {
    const validEmail = 'advisor@cuet.ac.bd';
    const validPassword = 'pass12345';
    
    if (credentials.email === validEmail && credentials.password === validPassword) {
      return of({
        success: true,
        message: 'Login successful (mock data)',
        advisor: {
          name: 'Dr. Academic Advisor',
          email: validEmail,
          department: 'Computer Science & Engineering'
        }
      }).pipe(delay(this.mockDelay));
    } else {
      // Return observable with failed response instead of throwing error
      return of({
        success: false,
        message: 'Invalid email or password'
      }).pipe(delay(this.mockDelay));
    }
  }

  // Mock Password Update Method
  private mockUpdatePassword(passwordData: { currentPassword: string, newPassword: string, email: string }): Observable<ApiResponse<boolean>> {
    const validEmail = 'advisor@cuet.ac.bd';
    const validCurrentPassword = 'pass12345';
    
    if (passwordData.email !== validEmail) {
      return of({
        success: false,
        message: 'Invalid user'
      }).pipe(delay(this.mockDelay));
    }
    
    if (passwordData.currentPassword !== validCurrentPassword) {
      return of({
        success: false,
        message: 'Current password is incorrect'
      }).pipe(delay(this.mockDelay));
    }
    
    // In a real implementation, this would hash and store the new password
    console.log('Mock: Password updated successfully for', passwordData.email);
    
    return of({
      success: true,
      data: true,
      message: 'Password updated successfully (mock data)'
    }).pipe(delay(this.mockDelay));
  }

  // Mock Thesis Update Method
  private updateMockThesisInfo(studentId: string, thesisInfo: ThesisInfo): Observable<ApiResponse<Student>> {
    const student = STUDENTS.find(s => s.studentId === studentId);
    
    if (student) {
      student.thesisInfo = { ...thesisInfo };
      return of({
        success: true,
        data: { ...student },
        message: 'Thesis information updated successfully (mock data)'
      }).pipe(delay(this.mockDelay));
    } else {
      // Return observable with error response instead of throwing
      return of({
        success: false,
        error: 'Student not found'
      }).pipe(delay(this.mockDelay));
    }
  }

  // Mock Add Thesis Student Method
  private addMockThesisStudent(studentData: { name: string, studentId: string }): Observable<ApiResponse<Student>> {
    // Check if student already exists
    const existingStudent = STUDENTS.find(s => s.studentId === studentData.studentId);
    if (existingStudent) {
      return of({
        success: false,
        error: 'Student already exists'
      }).pipe(delay(this.mockDelay));
    }

    // Create new student
    const newStudent: Student = {
      studentId: studentData.studentId,
      name: studentData.name,
      email: this.generateEmailFromNameAndId(studentData.name, studentData.studentId),
      batch: studentData.studentId.substring(0, 2),
      terms: [],
      overallCgpa: 0,
      nextSemesterRegistration: 'L4T2',
      registrationStatus: 'registered', // New students are registered by default
      approval_status: 'disapproved',
      graduationStatus: 'active', // New students are always active
      thesisInfo: {
        topicAssigned: false,
        topicName: '',
        defenseDate: '',
        assignedTask: '',
        meetingDateTime: ''
      }
    };

    STUDENTS.push(newStudent);

    return of({
      success: true,
      data: { ...newStudent },
      message: 'Student added to thesis supervision successfully (mock data)'
    }).pipe(delay(this.mockDelay));
  }

  // Mock Remove Thesis Student Method
  private removeMockThesisStudent(studentId: string): Observable<ApiResponse<boolean>> {
    const index = STUDENTS.findIndex(s => s.studentId === studentId);
    
    if (index !== -1) {
      STUDENTS.splice(index, 1);
      return of({
        success: true,
        data: true,
        message: 'Student removed from thesis supervision successfully (mock data)'
      }).pipe(delay(this.mockDelay));
    } else {
      return of({
        success: false,
        error: 'Student not found'
      }).pipe(delay(this.mockDelay));
    }
  }

  // Helper method for email generation
  private generateEmailFromNameAndId(name: string, studentId: string): string {
    const nameParts = name.toLowerCase()
      .replace(/md\.|dr\.|prof\./g, '')
      .replace(/[^a-z\s]/g, '')
      .trim()
      .split(' ')
      .filter(part => part.length > 0);
    
    const firstName = nameParts[0] || 'student';
    const lastName = nameParts[nameParts.length - 1] || '';
    
    return `${firstName}${lastName ? '.' + lastName : ''}.${studentId}@student.cuet.ac.bd`;
  }

  // Mock Routine Methods
  private getMockRoutines(): Observable<ApiResponse<RoutineEntry[]>> {
    return of({
      success: true,
      data: [...MOCK_ROUTINE],
      message: 'Routines retrieved successfully (mock data)'
    }).pipe(delay(this.mockDelay));
  }

  private addMockRoutine(routine: RoutineEntry): Observable<ApiResponse<RoutineEntry>> {
    const newRoutine: RoutineEntry = {
      ...routine,
      id: (MOCK_ROUTINE.length + 1).toString()
    };
    
    MOCK_ROUTINE.push(newRoutine);

    return of({
      success: true,
      data: { ...newRoutine },
      message: 'Routine added successfully (mock data)'
    }).pipe(delay(this.mockDelay));
  }

  private removeMockRoutine(routineId: string): Observable<ApiResponse<boolean>> {
    const index = MOCK_ROUTINE.findIndex(r => r.id === routineId);
    
    if (index !== -1) {
      MOCK_ROUTINE.splice(index, 1);
      return of({
        success: true,
        data: true,
        message: 'Routine removed successfully (mock data)'
      }).pipe(delay(this.mockDelay));
    } else {
      return of({
        success: false,
        error: 'Routine not found'
      }).pipe(delay(this.mockDelay));
    }
  }

  // Mock ML-based Approval Content Generation
  private mockGenerateApprovalContent(approvalRequest: ApprovalRequest): Observable<ApprovalResponse> {
    const student = STUDENTS.find(s => s.studentId === approvalRequest.studentId);
    
    if (!student) {
      return of({
        success: false,
        message: 'Student not found'
      }).pipe(delay(this.mockDelay));
    }

    // Get advisor name from localStorage
    let advisorName = 'Dr. Academic Advisor';
    try {
      const advisorData = localStorage.getItem('advisor');
      if (advisorData) {
        const advisor = JSON.parse(advisorData);
        advisorName = advisor.name || 'Dr. Academic Advisor';
      }
    } catch (e) {
      console.error('Error getting advisor name:', e);
    }

    // Generate mock ML content based on student performance
    let generatedContent = '';
    const latestTerm = student.terms
      .filter(t => t.resultPublished)
      .sort((a, b) => b.termId.localeCompare(a.termId))[0];

    if (approvalRequest.newStatus === 'approved') {
      if (latestTerm && latestTerm.gpa >= 3.5) {
        generatedContent = `Dear ${student.name},

Based on your excellent academic performance in ${latestTerm.termId} with a GPA of ${latestTerm.gpa}, I am pleased to approve your registration for the next semester.

Your consistent performance demonstrates strong academic capability and dedication. You have successfully completed all required courses with satisfactory grades.

Key Performance Highlights:
- Current Term GPA: ${latestTerm.gpa}
- Overall CGPA: ${student.overallCgpa}
- Academic Standing: Excellent

You are hereby approved to register for ${student.nextSemesterRegistration}. Please ensure you complete the registration process within the specified deadline.

Best regards,
${advisorName}
Computer Science & Engineering Department
CUET`;
      } else {
        generatedContent = `Dear ${student.name},

After reviewing your academic performance in ${latestTerm?.termId || 'previous semester'}, I am approving your registration for the next semester with some recommendations.

While your performance shows room for improvement, I believe you have the potential to excel with proper guidance and effort.

Performance Analysis:
- Current Term GPA: ${latestTerm?.gpa || 'N/A'}
- Overall CGPA: ${student.overallCgpa}
- Areas for Improvement: Focus on core subjects

You are approved to register for ${student.nextSemesterRegistration}. I recommend meeting with me during office hours to discuss strategies for academic improvement.

Best regards,
${advisorName}
Computer Science & Engineering Department
CUET`;
      }
    } else {
      generatedContent = `Dear ${student.name},

After careful review of your academic performance in ${latestTerm?.termId || 'previous semester'}, I regret to inform you that your registration for the next semester cannot be approved at this time.

This decision is based on the following academic concerns:
- Current Term GPA: ${latestTerm?.gpa || 'N/A'}
- Overall CGPA: ${student.overallCgpa}
- Academic Standing: Requires Improvement

To proceed with registration, you will need to:
1. Meet with me during office hours to discuss your academic plan
2. Complete any pending assignments or retake failed courses
3. Demonstrate improved academic commitment

Please schedule an appointment to discuss your path forward. I am committed to helping you succeed academically.

Best regards,
${advisorName}
Computer Science & Engineering Department
CUET`;
    }

    return of({
      success: true,
      generatedContent,
      message: 'Content generated successfully (mock ML)'
    }).pipe(delay(this.mockDelay));
  }

  // Mock Send Approval Email
  private mockSendApprovalEmail(studentId: string, content: string, status: 'approved' | 'disapproved'): Observable<ApiResponse<boolean>> {
    const student = STUDENTS.find(s => s.studentId === studentId);
    
    if (!student) {
      return of({
        success: false,
        message: 'Student not found'
      }).pipe(delay(this.mockDelay));
    }

    // Update student approval status
    student.approval_status = status;

    console.log(`Mock Email Sent to ${student.email}:`);
    console.log(`Subject: Registration ${status === 'approved' ? 'Approved' : 'Disapproved'} - ${student.nextSemesterRegistration}`);
    console.log(`Content: ${content}`);

    return of({
      success: true,
      data: true,
      message: `Approval email sent successfully to ${student.email} (mock)`
    }).pipe(delay(this.mockDelay));
  }

  // Configuration
  isUsingMockData(): boolean {
    return this.useMockData;
  }

  getApiUrl(): string {
    return this.baseUrl;
  }
}