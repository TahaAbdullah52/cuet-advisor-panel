import { Component } from '@angular/core';
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
    private apiService: ApiService
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
    
    const credentials: LoginCredentials = {
      email: this.email,
      password: this.password
    };

    this.apiService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          // Store advisor info in localStorage for session management
          if (response.advisor) {
            localStorage.setItem('advisor', JSON.stringify(response.advisor));
          }
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Invalid email or password';
      }
    });
  }
}
