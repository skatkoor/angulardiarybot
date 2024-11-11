// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000'; // Adjust if different
  private tokenKey = 'authToken';
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  // Hardcoded user credentials for development
  private hardcodedUser = {
    username: 'skatkoor',
    password: 'Sumanth1234',
    token: 'hardcoded-jwt-token-for-development', // Replace with a valid JWT if possible
  };

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { username, password });
  }

  login(username: string, password: string): Observable<any> {
    if (
      username === this.hardcodedUser.username &&
      password === this.hardcodedUser.password
    ) {
      // Simulate successful login
      localStorage.setItem(this.tokenKey, this.hardcodedUser.token);
      this.authStatus.next(true);
      return of({ token: this.hardcodedUser.token });
    } else {
      // Perform actual login
      return this.http
        .post<{ token: string }>(`${this.baseUrl}/login`, { username, password })
        .pipe(
          tap(response => {
            localStorage.setItem(this.tokenKey, response.token);
            this.authStatus.next(true);
          }),
          catchError(error => {
            // Handle login error
            console.error('Login error:', error);
            return of({ error: { message: 'Invalid credentials.' } });
          })
        );
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authStatus.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
