import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { getBatchWiseStats } from '../../core/mock-data';
import { Student } from '../../core/models';
import { StudentService } from '../../core/student.service';

import { StatCard } from '../../shared/stat-card';
import { GpaChart } from '../../shared/gpa-chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatCard,
    GpaChart
  ],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit, OnDestroy {

  students: Student[] = [];
  batchStats: any[] = [];
  isLoading = false;
  isUsingMockData = false;
  private subscription: Subscription = new Subscription();

  // ---- KPI VALUES ----
  totalStudents = 0;
  approvedCount = 0;
  pendingCount = 0;
  highestCgpaStudent: Student | null = null;
  averageCgpa = '0.00';

  // ---- BATCH-WISE GPA DATA ----
  batchLabels: string[] = [];
  batchGpaValues: number[] = [];

  // ---- APPROVAL STATISTICS ----
  approvalRate = '0.0';

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    // Subscribe to loading state
    this.subscription.add(
      this.studentService.loading$.subscribe(loading => {
        this.isLoading = loading;
      })
    );

    // Subscribe to student updates
    this.subscription.add(
      this.studentService.students$.subscribe(students => {
        this.students = students;
        this.updateStatistics();
        this.updateBatchData();
      })
    );

    // Check if using mock data
    this.isUsingMockData = this.studentService.isUsingMockData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  refreshData() {
    this.studentService.refreshStudents();
  }

  private updateStatistics() {
    this.totalStudents = this.studentService.getTotalStudents();
    this.approvedCount = this.studentService.getApprovedCount();
    this.pendingCount = this.studentService.getPendingCount();
    this.highestCgpaStudent = this.studentService.getHighestCgpaStudent();
    this.averageCgpa = this.studentService.getAverageCgpa().toString();
    this.approvalRate = this.totalStudents > 0 
      ? ((this.approvedCount / this.totalStudents) * 100).toFixed(1)
      : '0.0';

    console.log('Dashboard Statistics Updated:', {
      totalStudents: this.totalStudents,
      approvedCount: this.approvedCount,
      pendingCount: this.pendingCount,
      averageCgpa: this.averageCgpa,
      isUsingMockData: this.isUsingMockData
    });
  }

  private updateBatchData() {
    // Calculate batch statistics from actual student data (database or mock)
    const batchMap = new Map<string, { students: Student[], totalCgpa: number, approvedCount: number }>();
    
    this.students.forEach(student => {
      if (!batchMap.has(student.batch)) {
        batchMap.set(student.batch, { students: [], totalCgpa: 0, approvedCount: 0 });
      }
      
      const batchData = batchMap.get(student.batch)!;
      batchData.students.push(student);
      batchData.totalCgpa += student.overallCgpa;
      
      // Count approved students (using approval_status field)
      if (student.approval_status === 'approved') {
        batchData.approvedCount++;
      }
    });

    // Convert to array and sort by batch
    this.batchStats = Array.from(batchMap.entries())
      .map(([batch, data]) => ({
        batch,
        totalStudents: data.students.length,
        averageGpa: data.students.length > 0 ? +(data.totalCgpa / data.students.length).toFixed(2) : 0,
        approvedCount: data.approvedCount
      }))
      .sort((a, b) => a.batch.localeCompare(b.batch));

    this.batchLabels = this.batchStats.map(b => `Batch ${b.batch}`);
    this.batchGpaValues = this.batchStats.map(b => b.averageGpa);

    console.log('Batch Data Updated from Student Data:', {
      batchLabels: this.batchLabels,
      batchGpaValues: this.batchGpaValues,
      batchStats: this.batchStats
    });
  }
}
