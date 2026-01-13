import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
})
export class Sidebar implements OnInit {
  advisorName = 'Dr. Academic Advisor';
  advisorEmail = 'advisor@cuet.ac.bd';
  
  constructor(private router: Router) {}

  ngOnInit() {
    // Get advisor info from localStorage
    const advisorData = localStorage.getItem('advisor');
    if (advisorData) {
      const advisor = JSON.parse(advisorData);
      this.advisorName = advisor.name || 'Dr. Academic Advisor';
      this.advisorEmail = advisor.email || 'advisor@cuet.ac.bd';
    }
  }

  logout() {
    localStorage.removeItem('advisor');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
