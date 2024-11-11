// src/app/components/auth/auth-wrapper/auth-wrapper.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-wrapper',
  templateUrl: './auth-wrapper.component.html',
  styleUrls: ['./auth-wrapper.component.scss'],
})
export class AuthWrapperComponent {
  constructor(private authService: AuthService, private router: Router) {}

  // Method to simulate login with hardcoded credentials
  loginWithHardcodedUser(): void {
    this.authService.login('skatkoor', 'Sumanth1234').subscribe(
      (response: any) => {
        if (response.token) {
          this.router.navigate(['/notes']);
        } else if (response.error) {
          // Handle error if needed
          console.error(response.error.message);
        }
      },
      (error: any) => {
        console.error('Login failed:', error);
      }
    );
  }
}
