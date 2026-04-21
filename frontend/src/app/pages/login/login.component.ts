import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  email = '';
  password = '';
  isRegister = false;
  loading = false;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  submit(): void {
    this.errorMessage = '';
    this.loading = true;

    if (this.isRegister) {
      this.auth.register(this.username, this.email, this.password).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error ? JSON.stringify(err.error) : 'Register failed';
        }
      });
    } else {
      this.auth.login(this.username, this.password).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Invalid username or password';
        }
      });
    }
  }

  toggle(): void {
    this.isRegister = !this.isRegister;
    this.errorMessage = '';
  }
}