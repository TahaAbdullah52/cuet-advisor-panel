import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoutineEntry } from './routine.models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  private routinesSubject = new BehaviorSubject<RoutineEntry[]>([]);
  public routines$ = this.routinesSubject.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  public loading$ = this.isLoading.asObservable();

  constructor(private apiService: ApiService) {
    this.loadRoutines();
  }

  // Load routines from API (with mock fallback)
  private loadRoutines(): void {
    this.isLoading.next(true);
    
    this.apiService.getRoutines().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.routinesSubject.next(response.data);
          console.log('Routines loaded:', response.message);
        } else {
          console.error('Failed to load routines:', response.error);
        }
        this.isLoading.next(false);
      },
      error: (error) => {
        console.error('Error loading routines:', error);
        this.isLoading.next(false);
      }
    });
  }

  // Refresh data from API
  refreshRoutines(): void {
    this.loadRoutines();
  }

  getRoutines(): RoutineEntry[] {
    return this.routinesSubject.value;
  }

  addRoutine(routine: RoutineEntry): void {
    this.apiService.addRoutine(routine).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const routines = this.routinesSubject.value;
          routines.push(response.data);
          this.routinesSubject.next([...routines]);
          console.log('Routine added:', response.message);
        }
      },
      error: (error) => {
        console.error('Error adding routine:', error);
      }
    });
  }

  removeRoutine(routineId: string): void {
    this.apiService.removeRoutine(routineId).subscribe({
      next: (response) => {
        if (response.success) {
          const routines = this.routinesSubject.value;
          const updatedRoutines = routines.filter(r => r.id !== routineId);
          this.routinesSubject.next(updatedRoutines);
          console.log('Routine removed:', response.message);
        }
      },
      error: (error) => {
        console.error('Error removing routine:', error);
      }
    });
  }

  // API Status
  isUsingMockData(): boolean {
    return this.apiService.isUsingMockData();
  }
}