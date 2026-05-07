import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from './models/login-request.model';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent {
  model: LoginRequest;
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
  ) {
    this.model = {
      email: '',
      password: '',
    };
  }

  // Submit Handler
  onSubmit(): void {
    this.authService.login(this.model).subscribe({
      next: (response) => {
        // Redirect to dashboard/admin
        // Set Auth Cookie
        this.cookieService.set(
          'Authorization',
          `Bearer ${response.token}`,
          undefined,
          '/',
          undefined,
          true,
          'Strict',
        ); // Set cookie for 1 day
        this.authService.setUser({
          email: response.email,
          roles: response.roles,
        });
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Login failed. Try again.';
        this.isSubmitting = false;
      },
    });
  }
}
