import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './settings.html'
})
export class Settings implements OnInit {

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  error = '';
  success = false;
  isLoading = false;
  isUsingMockData = false;

  // Profile info (will be loaded from localStorage or API)
  advisorInfo = {
    name: 'Dr. Academic Advisor',
    email: 'advisor@cuet.ac.bd',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    phone: '+880-31-714865',
    office: 'Room 301, CSE Building'
  };

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.isUsingMockData = this.apiService.isUsingMockData();
    this.loadAdvisorInfo();
  }

  loadAdvisorInfo() {
    // Try to load advisor info from localStorage (set during login)
    const storedAdvisor = localStorage.getItem('advisor');
    if (storedAdvisor) {
      const advisor = JSON.parse(storedAdvisor);
      this.advisorInfo = {
        ...this.advisorInfo,
        name: advisor.name || this.advisorInfo.name,
        email: advisor.email || this.advisorInfo.email,
        department: advisor.department || this.advisorInfo.department
      };
    }
  }

  updatePassword() {
    this.error = '';
    this.success = false;

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.error = 'All fields are required.';
      return;
    }

    if (this.newPassword.length < 8) {
      this.error = 'New password must be at least 8 characters long.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'New passwords do not match.';
      return;
    }

    this.isLoading = true;

    const passwordData = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      email: this.advisorInfo.email
    };

    this.apiService.updatePassword(passwordData).subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          this.isLoading = false;
          if (response.success) {
            // Clear any error and show success
            this.error = '';
            this.success = true;
            
            // Clear form
            this.currentPassword = '';
            this.newPassword = '';
            this.confirmPassword = '';
            
            this.cdr.detectChanges();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
              this.ngZone.run(() => {
                this.success = false;
                this.cdr.detectChanges();
              });
            }, 3000);
          } else {
            // Clear success and show error
            this.success = false;
            this.error = response.message || 'Failed to update password';
            this.cdr.detectChanges();
          }
        });
      },
      error: (error) => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.success = false;
          this.error = error.error?.message || error.message || 'Failed to update password';
          this.cdr.detectChanges();
        });
      }
    });
  }
}
