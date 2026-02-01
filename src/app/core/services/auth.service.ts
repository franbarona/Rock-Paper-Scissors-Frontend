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

  // Signals
  private readonly tokenSignal = signal<string | null>(this.getStoredToken());
  private readonly currentUserSignal = signal<User | null>(this.getUserFromStorage());
  
  // Public read-only access
  public readonly currentUser = this.currentUserSignal.asReadonly();
  public readonly isAuthenticated = computed(() => !!this.tokenSignal());

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
    this.tokenSignal.set(response.token);
    
    const user: User = {
      id: response.id,
      username: response.username,
      email: response.email,
    };
    this.currentUserSignal.set(user);
  }

  // Get JWT token from storage
  getToken(): string | null {
    return this.tokenSignal();
  }

  // Retrieve stored token from localStorage
  private getStoredToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Clear authentication data and logout user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
  }

  // Retrieve user from storage (for persistence on page reload)
  private getUserFromStorage(): User | null {
    const token = this.getStoredToken();
    if (token) {
      return this.decodeUserFromToken(token);
    }
    return null;
  }

  // Decode JWT token to extract user data
  private decodeUserFromToken(token: string): User | null {
    try {
      // JWT format: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // Decode payload (base64)
      const payload = JSON.parse(atob(parts[1]));

      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return null; // Token expired
      }

      // Return user from JWT payload
      return {
        id: payload.sub || payload.userId,
        username: payload.username || payload.preferred_username,
        email: payload.email || payload.sub,
      };
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }
}