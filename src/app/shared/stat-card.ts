import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="academic-card p-6 hover:shadow-lg transition-shadow">
      <div class="flex items-center space-x-4">
        
        <!-- Icon -->
        <div class="w-12 h-12 rounded-full flex items-center justify-center"
             [ngClass]="getIconBgClass()">
          <svg class="w-6 h-6" [ngClass]="getIconColorClass()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            
            <!-- Users Icon -->
            <path *ngIf="icon === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            
            <!-- Check Icon -->
            <path *ngIf="icon === 'check'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            
            <!-- Clock Icon -->
            <path *ngIf="icon === 'clock'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            
            <!-- Chart Icon -->
            <path *ngIf="icon === 'chart'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            
            <!-- Default Icon -->
            <path *ngIf="!icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1">
          <p class="text-sm academic-muted mb-1">{{ label }}</p>
          <p class="text-2xl font-bold academic-title">{{ value }}</p>
        </div>

      </div>
    </div>
  `
})
export class StatCard {
  @Input() label!: string;
  @Input() value!: string | number;
  @Input() icon?: string;
  @Input() color?: string;

  getIconBgClass(): string {
    switch (this.color) {
      case 'green': return 'bg-green-100';
      case 'blue': return 'bg-blue-100';
      case 'yellow': return 'bg-yellow-100';
      case 'purple': return 'bg-purple-100';
      default: return 'bg-slate-100';
    }
  }

  getIconColorClass(): string {
    switch (this.color) {
      case 'green': return 'text-green-600';
      case 'blue': return 'text-blue-600';
      case 'yellow': return 'text-yellow-600';
      case 'purple': return 'text-purple-600';
      default: return 'text-slate-600';
    }
  }
}
