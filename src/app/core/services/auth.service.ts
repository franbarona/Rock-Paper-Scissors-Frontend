import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../shared/models/auth.model';
import { User } from '../../shared/models/user.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly usersApiUrl = `${environment.apiUrl}/users`;
  private readonly tokenKey = 'auth_token';

  // Signals
  private readonly tokenSignal = signal<string | null>(this.getStoredToken());
  private readonly currentUserSignal = signal<User | null>(null);

  // Public read-only access
  public readonly token = this.tokenSignal.asReadonly();
  public readonly currentUser = this.currentUserSignal.asReadonly();
  public readonly isAuthenticated = computed(() => !!this.tokenSignal());

  constructor() {
    // when token changes, load current user or clear it
    effect(() => {
      if (this.tokenSignal()) {
        this.loadCurrentUser();
      } else {
        this.currentUserSignal.set(null);
      }
    });
  }

  // Login request
  login(request: LoginRequest) {
    this.logout();
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, request).pipe(
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error);
      }),
    );
  }

  // Register request
  register(request: RegisterRequest) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, request);
  }

  // Save token after successful login/register
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.tokenSignal.set(token);
  }

  // Fetch and update current user from backend
  refreshCurrentUser() {
    return this.http.get<ApiResponse<User>>(`${this.usersApiUrl}/me`).pipe(
      catchError((error) => {
        console.error('Error fetching current user:', error);
        return throwError(() => error);
      }),
    );
  }

  // Load current user on app initialization if token exists
  private loadCurrentUser(): void {
    this.refreshCurrentUser().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentUserSignal.set(response.data);
        }
      },
      error: () => {
        this.logout();
      },
    });
  }

  // Retrieve stored token from localStorage
  private getStoredToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Set current user data
  public setCurrentUser(user: User): void {
    this.currentUserSignal.set(user);
  }

  // Clear authentication data and logout user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
  }
}
