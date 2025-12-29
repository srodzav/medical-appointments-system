import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './dashboard/layout/layout.component';
import { HomeComponent } from './dashboard/home/home.component';
import { ListComponent } from './dashboard/appointments/list/list.component';
import { CreateComponent } from './dashboard/appointments/create/create.component';

export const routes: Routes = [
  // Public routes
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected routes (Dashboard)
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'citas', component: ListComponent },
      { path: 'citas/nueva', component: CreateComponent },
    ],
  },

  // Redirect unknown routes to home
  { path: '**', redirectTo: '' },
];
