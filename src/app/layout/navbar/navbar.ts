import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  currentPageTitle = 'Dashboard';

  constructor(private router: Router) {
    // Update page title based on current route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          const url = this.router.url;
          if (url.includes('/dashboard')) return 'Dashboard';
          if (url.includes('/students') && !url.includes('/students/')) return 'Students';
          if (url.includes('/students/')) return 'Student Details';
          if (url.includes('/thesis')) return 'Thesis';
          if (url.includes('/routine')) return 'Routine';
          if (url.includes('/settings')) return 'Settings';
          return 'Dashboard';
        })
      )
      .subscribe(title => {
        this.currentPageTitle = title;
      });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
