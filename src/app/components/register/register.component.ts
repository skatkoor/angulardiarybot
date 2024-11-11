// src/app/components/register/register.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.username, this.password).subscribe(
      response => {
        // Handle successful registration
        this.successMessage = 'Registration successful. You can now log in.';
        this.errorMessage = '';
        // Optionally redirect to login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error => {
        // Handle registration error
        this.errorMessage = error.error.message || 'Registration failed.';
        this.successMessage = '';
      }
    );
  }
}
