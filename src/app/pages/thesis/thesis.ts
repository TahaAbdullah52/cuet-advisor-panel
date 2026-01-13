import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Student, ThesisInfo } from '../../core/models';
import { StudentService } from '../../core/student.service';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-thesis',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './thesis.html'
})
export class Thesis implements OnInit, OnDestroy {

  students: Student[] = [];
  selectedStudent: Student | null = null;
  private subscription: Subscription = new Subscription();
  isLoading = false;
  isUpdating = false;
  showAddStudentForm = false;
  isAddingStudent = false;

  // Add student form data
  newStudent = {
    name: '',
    studentId: ''
  };

  // Thesis form data
  thesisForm: ThesisInfo = {
    topicAssigned: false,
    topicName: '',
    defenseDate: '',
    assignedTask: '',
    meetingDateTime: ''
  };

  constructor(
    private router: Router,
    private studentService: StudentService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // Subscribe to student updates
    this.subscription.add(
      this.studentService.students$.subscribe(students => {
        this.ngZone.run(() => {
          // Filter students who are eligible for thesis (active final year students only)
          this.students = students
            .filter(s => 
              s.graduationStatus === 'active' && // Only active (non-graduated) students
              (s.batch === '20' || s.batch === '21') // Final year and pre-final year students
            )
            .sort((a, b) => {
              // Sort by batch first, then by student ID
              if (a.batch !== b.batch) {
                return a.batch.localeCompare(b.batch);
              }
              return a.studentId.localeCompare(b.studentId);
            });
          console.log('Thesis: Students loaded:', this.students.length);
          this.cdr.detectChanges();
        });
      })
    );

    // Subscribe to loading state
    this.subscription.add(
      this.studentService.loading$.subscribe(loading => {
        this.ngZone.run(() => {
          this.isLoading = loading;
          this.cdr.detectChanges();
        });
      })
    );

    // Ensure data is loaded
    this.studentService.ensureDataLoaded();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectStudent(student: Student) {
    this.selectedStudent = student;
    
    // Populate form with existing thesis info
    if (student.thesisInfo) {
      this.thesisForm = { ...student.thesisInfo };
    } else {
      this.resetForm();
    }
  }

  resetForm() {
    this.thesisForm = {
      topicAssigned: false,
      topicName: '',
      defenseDate: '',
      assignedTask: '',
      meetingDateTime: ''
    };
  }

  updateThesisInfo() {
    if (!this.selectedStudent) return;

    // Prevent multiple submissions
    if (this.isUpdating) return;

    this.isUpdating = true;
    this.cdr.detectChanges();

    this.apiService.updateThesisInfo(this.selectedStudent.studentId, this.thesisForm).subscribe({
      next: (response) => {
        this.isUpdating = false;
        this.cdr.detectChanges();
        
        if (response.success && response.data) {
          // Update the student in the local array
          const index = this.students.findIndex(s => s.studentId === this.selectedStudent!.studentId);
          if (index !== -1) {
            this.students[index] = response.data;
          }
          // Update selected student with proper safety check
          this.selectedStudent = response.data;
          
          // CRITICAL: Update StudentService to persist changes when navigating away
          this.studentService.updateStudentInCache(response.data);
          
          console.log('✅ Thesis information updated successfully');
        } else {
          console.error('Failed to update thesis information:', response.error || 'Unknown error');
        }
      },
      
      error: (error) => {
        console.error('Error updating thesis information:', error);
        this.isUpdating = false;
        this.cdr.detectChanges();
      }
    });
  }
  

  getThesisStatus(student: Student): string {
    if (!student.thesisInfo || !student.thesisInfo.topicAssigned) {
      return 'Not Assigned';
    }
    return 'Assigned';
  }

  getThesisStatusColor(student: Student): string {
    const status = this.getThesisStatus(student);
    return status === 'Assigned' ? 'text-green-600' : 'text-yellow-600';
  }

  // Get only CGPA for all 8 semesters
  getTermCgpaData(): { termId: string, cgpa: number }[] {
    if (!this.selectedStudent || !this.selectedStudent.terms) return [];
    
    return this.selectedStudent.terms
      .filter(t => t.resultPublished)
      .map(t => ({
        termId: t.termId,
        cgpa: t.gpa
      }))
      .sort((a, b) => a.termId.localeCompare(b.termId));
  }

  backToList() {
    this.selectedStudent = null;
    this.resetForm();
  }

  // Add/Remove Student Methods
  toggleAddStudentForm() {
    this.showAddStudentForm = !this.showAddStudentForm;
    if (!this.showAddStudentForm) {
      this.resetNewStudentForm();
    }
  }

  resetNewStudentForm() {
    this.newStudent = {
      name: '',
      studentId: ''
    };
  }

  addStudent() {
    if (!this.newStudent.name || !this.newStudent.studentId) {
      return;
    }

    this.isAddingStudent = true;

    this.apiService.addThesisStudent(this.newStudent).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Force refresh from student service to ensure data consistency
          this.studentService.refreshStudents();
          
          this.showAddStudentForm = false;
          this.resetNewStudentForm();
          console.log('Student added to thesis supervision');
        }
        this.isAddingStudent = false;
      },
      error: (error) => {
        console.error('Error adding student:', error);
        this.isAddingStudent = false;
      }
    });
  }

  removeStudent(student: Student) {
    if (confirm(`Are you sure you want to remove ${student.name} from thesis supervision?`)) {
      this.apiService.removeThesisStudent(student.studentId).subscribe({
        next: (response) => {
          if (response.success) {
            // Force refresh from student service to ensure data consistency
            this.studentService.refreshStudents();
            
            // If the removed student was selected, clear selection
            if (this.selectedStudent?.studentId === student.studentId) {
              this.selectedStudent = null;
              this.resetForm();
            }
            
            console.log('Student removed from thesis supervision');
          }
        },
        error: (error) => {
          console.error('Error removing student:', error);
        }
      });
    }
  }

  // Helper methods
  private extractBatchFromId(studentId: string): string {
    // Extract batch from student ID (first 2 digits)
    return studentId.substring(0, 2);
  }
}