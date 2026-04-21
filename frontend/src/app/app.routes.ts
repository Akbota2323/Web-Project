import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'place/:id',
    loadComponent: () => import('./pages/place-detail/place-detail').then(m => m.PlaceDetailComponent)
  },
  {
    path: 'book-tour/:id',
    loadComponent: () => import('./pages/book-tour/book-tour.component').then(m => m.BookTourComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-bookings',
    loadComponent: () => import('./pages/my-bookings/my-bookings').then(m => m.MyBookingsComponent),
    canActivate: [authGuard]
  }
];