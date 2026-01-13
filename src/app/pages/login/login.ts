import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { LoginCredentials } from '../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  isUsingMockData = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.isUsingMockData = this.apiService.isUsingMockData();
  }

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges(); // Force update
    
    const credentials: LoginCredentials = {
      email: this.email,
      password: this.password
    };

    this.apiService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        this.isLoading = false; // ALWAYS reset loading
        this.cdr.detectChanges(); // Force update UI
        
        if (response && response.success) {
          // Store token and advisor info in localStorage
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          if (response.advisor) {
            localStorage.setItem('advisor', JSON.stringify(response.advisor));
          }
          this.router.navigate(['/dashboard']);
        } else {
          // Show error message from backend
          this.errorMessage = response?.message || 'Login failed. Please try again.';
        }
      },
      error: (error) => {
        console.error('Login error handler called:', error);
        this.isLoading = false; // ALWAYS reset loading
        this.cdr.detectChanges(); // Force update UI
        
        // Handle different error formats from backend
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check if backend is running.';
        } else if (error.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
      }
    });
  }
}
