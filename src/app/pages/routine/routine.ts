import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';

import { RoutineEntry, TodaySchedule } from '../../core/routine.models';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-routine',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './routine.html'
})
export class Routine implements OnInit, OnDestroy {

  todaySchedule: TodaySchedule = { upcoming: [], completed: [] };
  allRoutines: RoutineEntry[] = [];
  showAddForm = false;
  isLoading = false;
  isAddingRoutine = false;
  currentTime = new Date();
  private subscription: Subscription = new Subscription();

  // Add routine form data
  newRoutine: RoutineEntry = {
    courseName: '',
    batchName: '',
    roomNo: '',
    dayName: 'Monday',
    startTime: '',
    endTime: '',
    type: 'Class'
  };

  dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'];
  typeOptions = ['Class', 'Lab'];
  batchOptions = ['Batch 19', 'Batch 20', 'Batch 21', 'Batch 22', 'Batch 23', 'Batch 24'];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadRoutines();
    
    // Update current time every minute
    this.subscription.add(
      interval(60000).subscribe(() => {
        this.currentTime = new Date();
        this.updateTodaySchedule();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadRoutines() {
    this.isLoading = true;
    
    this.apiService.getRoutines().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.allRoutines = response.data;
          this.updateTodaySchedule();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading routines:', error);
        this.isLoading = false;
      }
    });
  }

  updateTodaySchedule() {
    const today = this.getCurrentDayName();
    const todayRoutines = this.allRoutines.filter(r => r.dayName === today);
    
    const now = this.currentTime;
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

    this.todaySchedule = {
      upcoming: [],
      completed: [],
      current: undefined
    };

    todayRoutines.forEach(routine => {
      const startMinutes = this.timeToMinutes(routine.startTime);
      const endMinutes = this.timeToMinutes(routine.endTime);

      if (currentTimeMinutes < startMinutes) {
        this.todaySchedule.upcoming.push(routine);
      } else if (currentTimeMinutes > endMinutes) {
        this.todaySchedule.completed.push(routine);
      } else {
        this.todaySchedule.current = routine;
      }
    });

    // Sort upcoming by start time
    this.todaySchedule.upcoming.sort((a, b) => 
      this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime)
    );
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.newRoutine = {
      courseName: '',
      batchName: '',
      roomNo: '',
      dayName: 'Monday',
      startTime: '',
      endTime: '',
      type: 'Class'
    };
  }

  addRoutine() {
    if (!this.isFormValid()) {
      return;
    }

    this.isAddingRoutine = true;

    this.apiService.addRoutine(this.newRoutine).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.allRoutines.push(response.data);
          this.updateTodaySchedule();
          this.showAddForm = false;
          this.resetForm();
          console.log('Routine added successfully');
        }
        this.isAddingRoutine = false;
      },
      error: (error) => {
        console.error('Error adding routine:', error);
        this.isAddingRoutine = false;
      }
    });
  }

  removeRoutine(routine: RoutineEntry) {
    if (confirm(`Are you sure you want to remove ${routine.courseName} from your routine?`)) {
      this.apiService.removeRoutine(routine.id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.allRoutines = this.allRoutines.filter(r => r.id !== routine.id);
            this.updateTodaySchedule();
            console.log('Routine removed successfully');
          }
        },
        error: (error) => {
          console.error('Error removing routine:', error);
        }
      });
    }
  }

  // Helper methods
  getCurrentDayName(): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[this.currentTime.getDay()];
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private isFormValid(): boolean {
    return !!(
      this.newRoutine.courseName &&
      this.newRoutine.batchName &&
      this.newRoutine.roomNo &&
      this.newRoutine.startTime &&
      this.newRoutine.endTime
    );
  }

  getRoutinesByDay(day: string): RoutineEntry[] {
    return this.allRoutines
      .filter(r => r.dayName === day)
      .sort((a, b) => this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime));
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  getTimeUntilNext(routine: RoutineEntry): string {
    const now = this.currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const routineMinutes = this.timeToMinutes(routine.startTime);
    
    const diffMinutes = routineMinutes - currentMinutes;
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  }
}