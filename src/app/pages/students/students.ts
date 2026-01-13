import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Student, ApprovalRequest } from '../../core/models';
import { StudentService } from '../../core/student.service';
import { ApiService } from '../../core/api.service';
import { Pagination } from '../../shared/pagination';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Pagination
  ],
  templateUrl: './students.html'
})
export class Students implements OnInit, OnDestroy {

  students: Student[] = [];
  isLoading = false;
  isUsingMockData = false;
  private subscription: Subscription = new Subscription();

  // ---- FILTER STATE ----
  searchId = '';
  selectedBatch = '';
  selectedApprovalStatus = ''; // Default to registered filter

  // ---- PAGINATION ----
  page = 1;
  pageSize = 8;

  // ---- ML APPROVAL DIALOG ----
  showApprovalDialog = false;
  selectedStudentForApproval: Student | null = null;
  generatedContent = '';
  isGeneratingContent = false;
  isSendingEmail = false;
  pendingApprovalAction: 'approved' | 'disapproved' | null = null;
  useAIContent = true; // Toggle between AI and generic content

  // ---- CACHED COMPUTED VALUES ----
  private _filteredStudents: Student[] = [];
  private _batches: string[] = [];
  private _pendingStudentsCount = 0;
  private _totalPages = 0;
  private _paginatedStudents: Student[] = [];

  readonly approvalStatusOptions = [
    { value: '', label: 'All Status' },
    { value: 'approved', label: 'Approved' },
    { value: 'disapproved', label: 'Disapproved' },
    { value: 'pending', label: 'Pending' },
    { value: 'registered', label: 'Registered' },
    { value: 'not_registered', label: 'Not Registered' },
    { value: 'graduated', label: 'Graduated' }
  ];

  constructor(
    private router: Router,
    private studentService: StudentService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // Check data source
    this.isUsingMockData = this.studentService.isUsingMockData();
    
    // Subscribe to loading state
    this.subscription.add(
      this.studentService.loading$.subscribe(loading => {
        this.ngZone.run(() => {
          this.isLoading = loading;
          this.cdr.detectChanges();
        });
      })
    );

    // Subscribe to student updates
    this.subscription.add(
      this.studentService.students$.subscribe(students => {
        this.ngZone.run(() => {
          this.students = [...students]; // Create new array reference
          this.updateComputedValues();
          console.log('Students loaded in component:', students.length);
          this.cdr.detectChanges();
        });
      })
    );

    // Ensure data is loaded (only loads once if not already loaded)
    this.studentService.ensureDataLoaded();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    // Ensure body scroll is restored if component is destroyed while dialog is open
    document.body.classList.remove('dialog-open');
  }

  // ---- COMPUTED VALUES (CACHED) ----
  get batches(): string[] {
    return this._batches;
  }

  get filteredStudents(): Student[] {
    return this._filteredStudents;
  }

  get paginatedStudents(): Student[] {
    return this._paginatedStudents;
  }

  get totalPages(): number {
    return this._totalPages;
  }

  get pendingStudentsCount(): number {
    return this._pendingStudentsCount;
  }

  // ---- UPDATE COMPUTED VALUES ----
  private updateComputedValues() {
    // Update batches
    this._batches = [...new Set(this.students.map(s => s.batch))].sort();

    // Update filtered students
    this._filteredStudents = this.students.filter(s => {
      const matchesId = s.studentId.includes(this.searchId);
      const matchesBatch = !this.selectedBatch || s.batch === this.selectedBatch;
      
      let matchesApproval = true;
      if (this.selectedApprovalStatus) {
        if (this.selectedApprovalStatus === 'graduated') {
          matchesApproval = s.graduationStatus === 'graduated';
        } else if (this.selectedApprovalStatus === 'not_registered') {
          matchesApproval = s.graduationStatus === 'active' && 
                           s.registrationStatus === 'not_registered';
        } else if (this.selectedApprovalStatus === 'registered') {
          // Show all registered students regardless of approval status
          matchesApproval = s.graduationStatus === 'active' && 
                           s.registrationStatus === 'registered';
        } else {
          // For approved, disapproved, pending - only show registered students with that specific status
          matchesApproval = s.graduationStatus === 'active' && 
                           s.registrationStatus === 'registered' &&
                           s.approval_status === this.selectedApprovalStatus;
        }
      }
      
      return matchesId && matchesBatch && matchesApproval;
    });

    // Update pagination
    this._totalPages = Math.ceil(this._filteredStudents.length / this.pageSize);
    const start = (this.page - 1) * this.pageSize;
    this._paginatedStudents = this._filteredStudents.slice(start, start + this.pageSize);

    // Update pending count (students who are registered but not yet approved/disapproved)
    this._pendingStudentsCount = this._filteredStudents.filter(s => 
      s.graduationStatus === 'active' && 
      s.registrationStatus === 'registered' && 
      s.approval_status === 'pending'
    ).length;
  }

  // ---- FILTER CHANGE HANDLERS ----
  onSearchIdChange() {
    this.page = 1;
    this.updateComputedValues();
  }

  onBatchChange() {
    this.page = 1;
    this.updateComputedValues();
  }

  onApprovalStatusChange() {
    this.page = 1;
    this.updateComputedValues();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.updateComputedValues();
  }

  // ---- APPROVAL ACTIONS ----
  approveStudent(student: Student, event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent row click when clicking button
    }
    
    // Only registered students can have approval status changed
    if (student.registrationStatus !== 'registered') {
      alert('Only registered students can have their approval status changed.');
      return;
    }
    
    this.selectedStudentForApproval = student;
    this.pendingApprovalAction = 'approved';
    this.showApprovalDialog = true;
    document.body.classList.add('dialog-open');
  }

  disapproveStudent(student: Student, event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent row click when clicking button
    }
    
    // Only registered students can have approval status changed
    if (student.registrationStatus !== 'registered') {
      alert('Only registered students can have their approval status changed.');
      return;
    }
    
    this.selectedStudentForApproval = student;
    this.pendingApprovalAction = 'disapproved';
    this.showApprovalDialog = true;
    document.body.classList.add('dialog-open');
  }

  generateApprovalContent(student: Student, newStatus: 'approved' | 'disapproved') {
    console.log('🔵 [FRONTEND] generateApprovalContent called');
    console.log('Student:', student.name, student.studentId);
    console.log('New Status:', newStatus);
    console.log('Use AI Content:', this.useAIContent);
    console.log('Is Using Mock Data:', this.isUsingMockData);
    
    this.isGeneratingContent = true;
    this.generatedContent = '';
    
    if (this.useAIContent) {
      // Use AI-generated content
      if (!this.isUsingMockData) {
        console.log('🔵 [FRONTEND] Making API call to generate approval content...');
        const approvalRequest: ApprovalRequest = {
          studentId: student.studentId,
          currentStatus: student.approval_status,
          newStatus: newStatus
        };
        console.log('Request payload:', approvalRequest);

        this.apiService.generateApprovalContent(approvalRequest).subscribe({
          next: (response) => {
            console.log('🔵 [FRONTEND] API response received:', response);
            this.ngZone.run(() => {
              this.isGeneratingContent = false;
              
              if (response.success && response.generatedContent) {
                console.log('✅ [FRONTEND] Content generated successfully, length:', response.generatedContent.length);
                this.generatedContent = response.generatedContent;
                this.showApprovalDialog = true;
                document.body.classList.add('dialog-open');
                this.cdr.detectChanges();
              } else {
                console.error('❌ [FRONTEND] Failed to generate content:', response);
                alert('Failed to generate approval content. Please try again.');
              }
            });
          },
          error: (error) => {
            this.ngZone.run(() => {
              console.error('❌ [FRONTEND] API error:', error);
              console.warn('Database ML generation failed, falling back to hardcoded content:', error);
              this.isGeneratingContent = false;
              this.cdr.detectChanges();
            });
            this.generateHardcodedContentFallback(student, newStatus);
          }
        });
      } else {
        // Use hardcoded AI content as fallback
        this.generateHardcodedContentFallback(student, newStatus);
      }
    } else {
      // Use generic content
      this.generateGenericContent(student, newStatus);
    }
  }

  private generateGenericContent(student: Student, newStatus: 'approved' | 'disapproved') {
    setTimeout(() => {
      this.ngZone.run(() => {
        if (newStatus === 'approved') {
          this.generatedContent = `Dear ${student.name},

Your registration for ${student.nextSemesterRegistration} has been approved by your advisor.

You may now proceed with the registration process within the specified deadline.

Best regards,
Academic Advisor
Computer Science & Engineering Department
CUET`;
        } else {
          this.generatedContent = `Dear ${student.name},

Your registration for ${student.nextSemesterRegistration} has been disapproved by your advisor.

Please contact your advisor to discuss the requirements for approval.

Best regards,
Academic Advisor
Computer Science & Engineering Department
CUET`;
        }
        
        this.isGeneratingContent = false;
        this.showApprovalDialog = true;
        document.body.classList.add('dialog-open');
        this.cdr.detectChanges();
      });
    }, 800); // Shorter delay for generic content
  }

  private generateHardcodedContentFallback(student: Student, newStatus: 'approved' | 'disapproved') {
    // Generate hardcoded AI content based on student performance
    setTimeout(() => {
      this.ngZone.run(() => {
        this.generatedContent = this.generateHardcodedContent(student, newStatus);
        this.isGeneratingContent = false;
        this.showApprovalDialog = true;
        
        // Prevent body scroll when dialog is open
        document.body.classList.add('dialog-open');
        this.cdr.detectChanges();
      });
    }, 1500); // Simulate AI processing time
  }

  private generateHardcodedContent(student: Student, newStatus: 'approved' | 'disapproved'): string {
    const latestTerm = student.terms
      .filter(t => t.resultPublished)
      .sort((a, b) => b.termId.localeCompare(a.termId))[0];

    if (newStatus === 'approved') {
      if (latestTerm && latestTerm.gpa >= 3.7) {
        return `Dear ${student.name},

Based on your excellent academic performance in ${latestTerm.termId} with a GPA of ${latestTerm.gpa}, I am pleased to approve your registration for the next semester.

Your consistent performance demonstrates strong academic capability and dedication. You have successfully completed all required courses with satisfactory grades.

Key Performance Highlights:
- Current Term GPA: ${latestTerm.gpa}
- Overall CGPA: ${student.overallCgpa}
- Academic Standing: Excellent

You are hereby approved to register for ${student.nextSemesterRegistration}. Please ensure you complete the registration process within the specified deadline.

Best regards,
Dr. Academic Advisor
Computer Science & Engineering Department
CUET`;
      } else {
        return `Dear ${student.name},

After reviewing your academic performance in ${latestTerm?.termId || 'previous semester'}, I am approving your registration for the next semester with some recommendations.

While your performance shows room for improvement, I believe you have the potential to excel with proper guidance and effort.

Performance Analysis:
- Current Term GPA: ${latestTerm?.gpa || 'N/A'}
- Overall CGPA: ${student.overallCgpa}
- Areas for Improvement: Focus on core subjects

You are approved to register for ${student.nextSemesterRegistration}. I recommend meeting with me during office hours to discuss strategies for academic improvement.

Best regards,
Dr. Academic Advisor
Computer Science & Engineering Department
CUET`;
      }
    } else {
      return `Dear ${student.name},

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
Dr. Academic Advisor
Computer Science & Engineering Department
CUET`;
    }
  }

  sendApprovalEmail() {
    if (!this.selectedStudentForApproval || !this.generatedContent || !this.pendingApprovalAction) {
      return;
    }

    // Ensure we only send approved or disapproved status (not pending)
    if (this.pendingApprovalAction !== 'approved' && this.pendingApprovalAction !== 'disapproved') {
      alert('Invalid approval action');
      return;
    }

    this.isSendingEmail = true;
    const newStatus = this.pendingApprovalAction;
    
    // Store student reference before async operations to avoid null reference
    const student = this.selectedStudentForApproval;
    if (!student) return;

    // Try database first, then fallback to hardcoded simulation
    if (!this.isUsingMockData) {
      this.apiService.sendApprovalEmail(
        student.studentId,
        this.generatedContent,
        newStatus
      ).subscribe({
        next: (response) => {
          console.log('✅ [FRONTEND] Email send response:', response);
          this.ngZone.run(() => {
            this.isSendingEmail = false;
            if (response.success) {
              // Backend already updated the student status when sending email
              // For disapproval, student goes back to pending status
              student.approval_status = newStatus === 'disapproved' ? 'pending' : 'approved';
              
              // Update computed values and close dialog
              this.updateComputedValues();
              this.closeApprovalDialog();
              this.cdr.detectChanges();
              
              const action = newStatus === 'approved' ? 'Approval' : 'Disapproval';
              alert(`${action} email sent successfully to ${student.email}!`);
            } else {
              alert('Failed to send approval email: ' + (response.message || 'Unknown error'));
            }
          });
        },
        error: (error) => {
          this.ngZone.run(() => {
            console.error('❌ [FRONTEND] Email send error:', error);
            console.warn('Database email sending failed, using simulation:', error);
            this.isSendingEmail = false;
            this.cdr.detectChanges();
            this.simulateEmailSending(newStatus);
          });
        }
      });
    } else {
      // Simulate email sending with hardcoded success
      this.simulateEmailSending(newStatus);
    }
  }

  private simulateEmailSending(newStatus: 'approved' | 'disapproved') {
    // Store reference before timeout to avoid null reference
    const student = this.selectedStudentForApproval;
    if (!student) return;

    setTimeout(() => {
      // Update student status through the service to ensure consistency
      student.approval_status = newStatus;
      this.studentService.updateStudent(student);
      
      // Update the cached filtered students to reflect the change
      this.updateComputedValues();
      
      // Log the email (simulating Gmail send)
      console.log(`Email Sent to ${student.email}:`);
      console.log(`Subject: Registration ${newStatus === 'approved' ? 'Approved' : 'Disapproved'} - ${student.nextSemesterRegistration}`);
      console.log(`Content: ${this.generatedContent}`);
      
      this.isSendingEmail = false;
      this.closeApprovalDialog();
      alert(`Approval email sent successfully to ${student.email}!`);
    }, 2000); // Simulate email sending time
  }

  closeApprovalDialog() {
    this.showApprovalDialog = false;
    this.selectedStudentForApproval = null;
    this.generatedContent = '';
    this.isGeneratingContent = false;
    this.isSendingEmail = false;
    this.pendingApprovalAction = null;
    this.useAIContent = true; // Reset to AI content by default
    
    // Re-enable body scroll
    document.body.classList.remove('dialog-open');
  }

  // ---- APPROVE ALL FUNCTIONALITY ----
  approveAll() {
    const pendingStudents = this._filteredStudents
      .filter(s => s.graduationStatus === 'active' && 
                   s.registrationStatus === 'registered' && 
                   s.approval_status === 'pending');
    
    if (pendingStudents.length === 0) {
      alert('No registered students pending approval found.');
      return;
    }

    const confirmMessage = `This will approve ${pendingStudents.length} students and send generic approval emails to each of them. Continue?`;
    if (!confirm(confirmMessage)) {
      return;
    }

    // Send generic emails to all students
    this.sendBulkApprovalEmails(pendingStudents);
  }

  private sendBulkApprovalEmails(students: Student[]) {
    const totalCount = students.length;
    const studentIds = students.map(s => s.studentId);

    // Show progress
    alert(`Sending approval emails to ${totalCount} students...`);

    // Use API service for bulk approval with database-first approach
    if (!this.isUsingMockData) {
      // Try database first
      this.apiService.approveMultipleStudents(studentIds).subscribe({
        next: (response) => {
          if (response.success) {
            // Send individual emails for each student
            this.sendIndividualBulkEmails(students);
          } else {
            alert('Failed to approve students in database');
          }
        },
        error: (error) => {
          console.warn('Database bulk approval failed, using simulation:', error);
          this.simulateBulkApproval(students);
        }
      });
    } else {
      // Use mock data simulation
      this.simulateBulkApproval(students);
    }
  }

  private sendIndividualBulkEmails(students: Student[]) {
    const totalCount = students.length;
    let completedCount = 0;

    students.forEach((student, index) => {
      const genericContent = `Dear ${student.name},

Your registration for ${student.nextSemesterRegistration} has been approved by your advisor.

You may now proceed with the registration process within the specified deadline.

Best regards,
Academic Advisor
Computer Science & Engineering Department
CUET`;

      // Send email via API service
      setTimeout(() => {
        this.apiService.sendApprovalEmail(student.studentId, genericContent, 'approved').subscribe({
          next: (response) => {
            if (response.success) {
              // Update local student status (will be refreshed at the end)
              student.approval_status = 'approved';
            }
            
            // Log the email
            console.log(`Bulk Email ${index + 1}/${totalCount} sent to ${student.email}:`);
            console.log(`Subject: Registration Approved - ${student.nextSemesterRegistration}`);
            
            completedCount++;
            
            // Update UI when all emails are sent
            if (completedCount === totalCount) {
              // Refresh all student data to ensure dashboard gets updated
              this.studentService.refreshStudents();
              alert(`Successfully sent approval emails to ${totalCount} students!`);
            }
          },
          error: (error) => {
            console.error(`Failed to send email to ${student.email}:`, error);
            completedCount++;
            
            if (completedCount === totalCount) {
              // Refresh all student data to ensure dashboard gets updated
              this.studentService.refreshStudents();
              alert(`Completed bulk approval process. Some emails may have failed.`);
            }
          }
        });
      }, (index + 1) * 500); // Stagger emails by 500ms each
    });
  }

  private simulateBulkApproval(students: Student[]) {
    const totalCount = students.length;
    let completedCount = 0;

    students.forEach((student, index) => {
      const genericContent = `Dear ${student.name},

Your registration for ${student.nextSemesterRegistration} has been approved by your advisor.

You may now proceed with the registration process within the specified deadline.

Best regards,
Academic Advisor
Computer Science & Engineering Department
CUET`;

      // Simulate email sending with staggered delays
      setTimeout(() => {
        // Update student status (will be refreshed at the end)
        student.approval_status = 'approved';
        
        // Log the email
        console.log(`Bulk Email ${index + 1}/${totalCount} sent to ${student.email}:`);
        console.log(`Subject: Registration Approved - ${student.nextSemesterRegistration}`);
        console.log(`Content: ${genericContent}`);
        
        completedCount++;
        
        // Update UI when all emails are sent
        if (completedCount === totalCount) {
          // Refresh all student data to ensure dashboard gets updated
          this.studentService.refreshStudents();
          alert(`Successfully sent approval emails to ${totalCount} students!`);
        }
      }, (index + 1) * 500); // Stagger emails by 500ms each
    });
  }

  getApprovalStatus(student: Student): string {
    if (student.graduationStatus === 'graduated') return 'Graduated';
    if (student.registrationStatus === 'not_registered') return 'Not Registered';
    
    // For registered students, show their actual approval status
    if (student.approval_status === 'approved') return 'Approved';
    if (student.approval_status === 'disapproved') return 'Disapproved';
    return 'Pending'; // For pending status
  }

  getRegistrationStatus(student: Student): string {
    if (student.graduationStatus === 'graduated') return 'Graduated';
    return student.registrationStatus === 'registered' ? 'Registered' : 'Not Registered';
  }

  clearFilters() {
    this.searchId = '';
    this.selectedBatch = '';
    this.selectedApprovalStatus = 'registered'; // Reset to default registered filter
    this.page = 1;
    this.updateComputedValues();
  }

  // ---- NAVIGATION ----
  viewStudentDetails(student: Student) {
    this.router.navigate(['/students', student.studentId]);
  }
}
