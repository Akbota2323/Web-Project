import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

interface AuthResponse {
  access: string;
  refresh: string;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = 'http://127.0.0.1:8000/api'; // если другой порт — поменяй

  isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private hasToken(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('access');
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('access');
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login/`, { username, password }).pipe(
      tap(res => {
        if (this.isBrowser()) {
          localStorage.setItem('access', res.access);
          localStorage.setItem('refresh', res.refresh);
          if (res.username) {
            localStorage.setItem('username', res.username);
          }
        }
        this.isLoggedIn$.next(true);
      })
    );
  }

  logout(): void {
    const refresh = this.isBrowser() ? localStorage.getItem('refresh') : null;

    this.http.post(`${this.API}/logout/`, { refresh }).subscribe();

    if (this.isBrowser()) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('username');
    }

    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  getUsername(): string {
    if (!this.isBrowser()) return 'Guest';
    return localStorage.getItem('username') || 'Guest';
  }
}
