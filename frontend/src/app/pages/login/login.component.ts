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
  password2 = '';

  isRegister = false;
  loading = false;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  submit(): void {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Fill all fields';
      return;
    }

    this.loading = true;

    this.auth.login(this.username, this.password).subscribe({
      next: (user) => {
        this.loading = false;

        if (user) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = this.isRegister
            ? 'Registration failed'
            : 'Invalid username or password';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Something went wrong';
      }
    });
  }

  toggle(): void {
    this.isRegister = !this.isRegister;
    this.errorMessage = '';
  }
}