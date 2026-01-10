import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Students } from './pages/students/students';
import { StudentDetails } from './pages/student-details/student-details';
import { Settings } from './pages/settings/settings';
import { Thesis } from './pages/thesis/thesis';
import { Layout } from './layout/layout/layout';
import { Routine } from './pages/routine/routine';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },

  {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'students', component: Students },
      { path: 'students/:id', component: StudentDetails },
      { path: 'thesis', component: Thesis },
      { path: 'routine', component: Routine },
      { path: 'settings', component: Settings }
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];
