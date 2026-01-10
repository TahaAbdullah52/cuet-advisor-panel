import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Student } from '../../core/models';
import { StudentService } from '../../core/student.service';
import { Pagination } from '../../shared/pagination';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    Pagination
  ],
  templateUrl: './students.html'
})
export class Students implements OnInit, OnDestroy {

  students: Student[] = [];
  private subscription: Subscription = new Subscription();

  // ---- FILTER STATE ----
  searchId = '';
  selectedBatch = '';
  selectedApprovalStatus = ''; // Default to all status filter

  // ---- PAGINATION ----
  page = 1;
  pageSize = 8;

  constructor(
    private router: Router,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    // Subscribe to student updates
    this.subscription.add(
      this.studentService.students$.subscribe(students => {
        this.students = students;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get batches(): string[] {
    return [...new Set(this.students.map(s => s.batch))].sort();
  }

  get approvalStatusOptions(): { value: string, label: string }[] {
    return [
      { value: '', label: 'All Status' },
      { value: 'approved', label: 'Approved' },
      { value: 'disapproved', label: 'Disapproved' },
      { value: 'graduated', label: 'Graduated' }
    ];
  }

  // ---- FILTERED STUDENTS ----
  get filteredStudents(): Student[] {
    return this.students.filter(s => {
      const matchesId = s.studentId.includes(this.searchId);
      const matchesBatch = !this.selectedBatch || s.batch === this.selectedBatch;
      
      let matchesApproval = true;
      if (this.selectedApprovalStatus) {
        if (this.selectedApprovalStatus === 'graduated') {
          matchesApproval = s.nextSemesterRegistration === 'Graduated';
        } else {
          matchesApproval = s.nextSemesterRegistration !== 'Graduated' && 
                           s.approval_status === this.selectedApprovalStatus;
        }
      }
      
      return matchesId && matchesBatch && matchesApproval;
    });
  }

  // ---- PAGINATED STUDENTS ----
  get paginatedStudents(): Student[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredStudents.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStudents.length / this.pageSize);
  }

  onPageChange(newPage: number) {
    this.page = newPage;
  }

  // ---- APPROVAL ACTIONS ----
  toggleApproval(student: Student, event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent row click when clicking button
    }
    this.studentService.toggleOverallApproval(student.studentId);
  }

  // ---- APPROVE ALL FUNCTIONALITY ----
  approveAll() {
    const pendingStudentIds = this.filteredStudents
      .filter(s => s.nextSemesterRegistration !== 'Graduated' && s.approval_status === 'disapproved')
      .map(s => s.studentId);
    
    this.studentService.approveAllStudents(pendingStudentIds);
  }

  get pendingStudentsCount(): number {
    return this.filteredStudents.filter(s => 
      s.nextSemesterRegistration !== 'Graduated' && s.approval_status === 'disapproved'
    ).length;
  }

  getApprovalStatus(student: Student): string {
    if (student.nextSemesterRegistration === 'Graduated') return 'Graduated';
    return student.approval_status === 'approved' ? 'Approved' : 'Pending';
  }

  clearFilters() {
    this.searchId = '';
    this.selectedBatch = '';
    this.selectedApprovalStatus = 'disapproved'; // Reset to default disapproved filter
    this.page = 1;
  }

  // ---- NAVIGATION ----
  viewStudentDetails(student: Student) {
    this.router.navigate(['/students', student.studentId]);
  }
}
