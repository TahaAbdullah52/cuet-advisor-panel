import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Student, Term } from '../../core/models';
import { StudentService } from '../../core/student.service';

import { GpaChart } from '../../shared/gpa-chart';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [
    CommonModule,
    GpaChart
  ],
  templateUrl: './student-details.html'
})
export class StudentDetails implements OnInit, OnDestroy {

  student!: Student;
  selectedTerm!: Term;
  private subscription: Subscription = new Subscription();

  termLabels: string[] = [];
  termGpaValues: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // Subscribe to student updates from service
      this.subscription.add(
        this.studentService.students$.subscribe(students => {
          const found = students.find(s => s.studentId === id);
          if (found) {
            this.student = found;
            this.selectedTerm = this.student.terms[0];
            this.prepareChart();
          }
        })
      );

      // Also try to get individual student data
      this.subscription.add(
        this.studentService.getStudent(id).subscribe(student => {
          if (student) {
            this.student = student;
            this.selectedTerm = this.student.terms[0];
            this.prepareChart();
          } else {
            // Redirect to students page if student not found
            this.router.navigate(['/students']);
          }
        })
      );
    } else {
      this.router.navigate(['/students']);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectTerm(term: Term) {
    this.selectedTerm = term;
  }

  toggleApproval() {
    if (this.selectedTerm.resultPublished) {
      this.studentService.toggleStudentApproval(this.student.studentId, this.selectedTerm.termId);
    }
  }

  goBack() {
    this.router.navigate(['/students']);
  }

  getGradeColor(result: string): string {
    if (result === "Result Not Published") return 'text-gray-500';
    
    switch (result) {
      case 'A+': return 'text-green-600';
      case 'A': return 'text-green-500';
      case 'A-': return 'text-yellow-600';
      case 'B+': return 'text-yellow-500';
      case 'B': return 'text-orange-500';
      default: return 'text-red-500';
    }
  }

  getTotalCredits(): number {
    return this.selectedTerm.courses.reduce((sum, course) => sum + course.courseCredit, 0);
  }

  getTermStatus(term: Term): string {
    if (!term.resultPublished) return 'Not Published';
    return term.approved ? 'Approved' : 'Pending';
  }

  getTermStatusColor(term: Term): string {
    if (!term.resultPublished) return 'text-gray-500';
    return term.approved ? 'text-green-600' : 'text-yellow-600';
  }

  private prepareChart() {
    // Only include published terms in the chart
    const publishedTerms = this.student.terms.filter(t => t.resultPublished);
    this.termLabels = publishedTerms.map(t => t.termId);
    this.termGpaValues = publishedTerms.map(t => t.gpa);
  }
}
