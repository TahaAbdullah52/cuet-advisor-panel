import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center space-x-2">
      
      <!-- Previous Button -->
      <button
        class="flex items-center px-3 py-2 text-sm font-medium academic-text border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        (click)="prev()"
        [disabled]="page === 1">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Previous
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center space-x-1">
        <button
          *ngFor="let p of getPageNumbers()"
          (click)="goToPage(p)"
          class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          [class.bg-blue-900]="p === page"
          [class.text-white]="p === page"
          [class.academic-text]="p !== page"
          [class.hover:bg-slate-100]="p !== page">
          {{ p }}
        </button>
      </div>

      <!-- Next Button -->
      <button
        class="flex items-center px-3 py-2 text-sm font-medium academic-text border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        (click)="next()"
        [disabled]="page === totalPages">
        Next
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

    </div>

    <!-- Page Info -->
    <div class="text-center mt-3">
      <p class="text-sm academic-muted">
        Page {{ page }} of {{ totalPages }}
      </p>
    </div>
  `
})
export class Pagination {

  @Input() page = 1;
  @Input() totalPages = 1;

  @Output() pageChange = new EventEmitter<number>();

  prev() {
    if (this.page > 1) {
      this.pageChange.emit(this.page - 1);
    }
  }

  next() {
    if (this.page < this.totalPages) {
      this.pageChange.emit(this.page + 1);
    }
  }

  goToPage(pageNum: number) {
    if (pageNum >= 1 && pageNum <= this.totalPages) {
      this.pageChange.emit(pageNum);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, this.page - 2);
      let end = Math.min(this.totalPages, this.page + 2);
      
      // Adjust if we're near the beginning or end
      if (end - start < maxVisible - 1) {
        if (start === 1) {
          end = Math.min(this.totalPages, start + maxVisible - 1);
        } else {
          start = Math.max(1, end - maxVisible + 1);
        }
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
}
