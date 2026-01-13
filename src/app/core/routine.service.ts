import { Injectable, NgZone } from '@angular/core';
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
  private initialized = false;

  constructor(
    private apiService: ApiService,
    private ngZone: NgZone
  ) {
    // Don't auto-load in constructor to prevent race conditions
    // Components will call refreshRoutines() or ensureDataLoaded() when needed
  }

  // Load routines from API (with mock fallback)
  private loadRoutines(): void {
    this.ngZone.run(() => {
      this.isLoading.next(true);
    });
    
    this.apiService.getRoutines().subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          if (response.success && response.data) {
            this.routinesSubject.next([...response.data]);
            console.log('Routines loaded from API:', response.data.length, 'routines');
          } else {
            console.error('Failed to load routines:', response.error);
          }
          this.isLoading.next(false);
        });
      },
      error: (error) => {
        this.ngZone.run(() => {
          console.error('Error loading routines:', error);
          this.isLoading.next(false);
        });
      }
    });
  }

  // Ensure data is loaded (only loads once)
  ensureDataLoaded(): void {
    if (!this.initialized && this.routinesSubject.value.length === 0) {
      this.initialized = true;
      this.loadRoutines();
    }
  }

  // Refresh data from API
  refreshRoutines(): void {
    this.loadRoutines();
  }

  getRoutines(): RoutineEntry[] {
    return this.routinesSubject.value;
  }

  addRoutine(routine: RoutineEntry): Observable<boolean> {
    return new Observable(observer => {
      this.ngZone.run(() => {
        this.isLoading.next(true);
      });
      
      this.apiService.addRoutine(routine).subscribe({
        next: (response) => {
          this.ngZone.run(() => {
            console.log('Add routine response:', response);
            this.isLoading.next(false);
            
            if (response.success && response.data) {
              // API returns array of routines
              const newRoutines = Array.isArray(response.data) ? response.data : [response.data];
              
              console.log('New routines to add:', newRoutines);
              console.log('First new routine:', newRoutines[0]);
              console.log('Current routines count:', this.routinesSubject.value.length);
              
              // Update local state immediately - create completely new array
              const currentRoutines = this.routinesSubject.value;
              const updatedRoutines = [...currentRoutines, ...newRoutines];
              
              console.log('Updated routines count:', updatedRoutines.length);
              console.log('Last routine in updated list:', updatedRoutines[updatedRoutines.length - 1]);
              
              // Force emission with new array reference
              this.routinesSubject.next([...updatedRoutines]);
              
              // Verify emission worked
              console.log('After next(), current value count:', this.routinesSubject.value.length);
              console.log('✅ Routine added to local state:', newRoutines.length, 'entries');
              observer.next(true);
              observer.complete();
            } else {
              const errorMsg = response.error || 'Unknown error';
              console.error('Failed to add routine:', errorMsg);
              observer.next(false);
              observer.complete();
            }
          });
        },
        error: (error) => {
          this.ngZone.run(() => {
            console.error('Error adding routine:', error);
            this.isLoading.next(false);
            observer.next(false);
            observer.complete();
          });
        }
      });
    });
  }

  removeRoutine(routineId: string): void {
    this.apiService.removeRoutine(routineId).subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          if (response.success) {
            const routines = this.routinesSubject.value;
            const updatedRoutines = routines.filter(r => r.id !== routineId);
            this.routinesSubject.next([...updatedRoutines]);
            console.log('Routine removed:', response.message);
          }
        });
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