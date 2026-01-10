import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from './models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  public loading$ = this.isLoading.asObservable();

  constructor(private apiService: ApiService) {
    this.loadStudents();
  }

  // Load students from API (with mock fallback)
  private loadStudents(): void {
    this.isLoading.next(true);
    
    this.apiService.getStudents().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.studentsSubject.next(response.data);
          console.log('Students loaded:', response.message);
        } else {
          console.error('Failed to load students:', response.error);
        }
        this.isLoading.next(false);
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.isLoading.next(false);
      }
    });
  }

  // Refresh data from API
  refreshStudents(): void {
    this.loadStudents();
  }

  getStudents(): Student[] {
    return this.studentsSubject.value;
  }

  getStudent(studentId: string): Observable<Student | null> {
    return new Observable(observer => {
      this.apiService.getStudent(studentId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            observer.next(response.data);
          } else {
            observer.next(null);
          }
          observer.complete();
        },
        error: () => {
          observer.next(null);
          observer.complete();
        }
      });
    });
  }

  updateStudent(updatedStudent: Student): void {
    this.apiService.updateStudent(updatedStudent).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const students = this.studentsSubject.value;
          const index = students.findIndex(s => s.studentId === updatedStudent.studentId);
          if (index !== -1) {
            students[index] = response.data;
            this.studentsSubject.next([...students]);
          }
          console.log('Student updated:', response.message);
        }
      },
      error: (error) => {
        console.error('Error updating student:', error);
      }
    });
  }

  toggleStudentApproval(studentId: string, termId?: string): void {
    this.apiService.approveStudent(studentId, termId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const students = this.studentsSubject.value;
          const index = students.findIndex(s => s.studentId === studentId);
          if (index !== -1) {
            students[index] = response.data;
            this.studentsSubject.next([...students]);
          }
          console.log('Student approval toggled:', response.message);
        }
      },
      error: (error) => {
        console.error('Error toggling student approval:', error);
      }
    });
  }

  // Toggle overall approval status for next semester registration
  toggleOverallApproval(studentId: string): void {
    const students = this.studentsSubject.value;
    const student = students.find(s => s.studentId === studentId);
    
    if (student && student.graduationStatus === 'active') {
      // Toggle approval status
      student.approval_status = student.approval_status === 'approved' ? 'disapproved' : 'approved';
      
      // Update the student
      this.updateStudent(student);
    }
  }

  approveAllStudents(studentIds?: string[]): void {
    const targetIds = studentIds || this.studentsSubject.value.map(s => s.studentId);
    
    this.apiService.approveMultipleStudents(targetIds).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Refresh all students to get updated data
          this.refreshStudents();
          console.log('Multiple students approved:', response.message);
        }
      },
      error: (error) => {
        console.error('Error approving multiple students:', error);
      }
    });
  }

  // Statistics methods
  getTotalStudents(): number {
    return this.studentsSubject.value.length;
  }

  getApprovedCount(): number {
    return this.studentsSubject.value.filter(s =>
      s.graduationStatus === 'active' && // Only active students
      s.approval_status === 'approved' // Using new approval_status field
    ).length;
  }

  getPendingCount(): number {
    return this.studentsSubject.value.filter(s =>
      s.graduationStatus === 'active' && // Only active students
      s.registrationStatus === 'registered' && // Only registered students
      s.approval_status === 'pending' // Using pending status
    ).length;
  }

  getAverageCgpa(): number {
    const students = this.studentsSubject.value;
    const studentsWithResults = students.filter(s => s.overallCgpa > 0);
    
    if (studentsWithResults.length === 0) return 0;
    
    return +(studentsWithResults.reduce((sum, s) => sum + s.overallCgpa, 0) / studentsWithResults.length).toFixed(2);
  }

  getHighestCgpaStudent(): Student | null {
    const students = this.studentsSubject.value.filter(s => s.overallCgpa > 0);
    
    if (students.length === 0) return null;
    
    return students.reduce((prev, current) => 
      (prev.overallCgpa > current.overallCgpa) ? prev : current
    );
  }

  // API Status
  isUsingMockData(): boolean {
    return this.apiService.isUsingMockData();
  }
}