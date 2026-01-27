import { Injectable, inject, signal, computed } from '@angular/core';
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
  private readonly tokenKey = 'auth_token';

  private readonly currentUserSignal = signal<User | null>(null);
  public readonly currentUser = this.currentUserSignal.asReadonly();
  public readonly isAuthenticated = computed(() => !!this.getToken());

  // Get current user value
  public get currentUserValue(): User | null {
    return this.currentUserSignal();
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

  // Save token and user after successful login/register
  saveUserData(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    const user: User = {
      id: response.id,
      username: response.username,
      email: response.email,
    };

    this.currentUserSignal.set(user);
  }

  // Get JWT token from storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Clear authentication data and logout user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSignal.set(null);
  }
}
