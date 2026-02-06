import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../shared/models/auth.model';
import { ApiResponse } from '../../shared/models/api-response.model';
import { environment } from '../../../environments/environment';

// Reset TestBed to force re-initialization of service with token in storage
function resetTestBed() {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
  });
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    // Clean localStorage before each test
    localStorage.clear();
    resetTestBed();
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('login', () => {
    it('should perform HTTP POST request to login endpoint', () => {
      const loginRequest: LoginRequest = { email: 'test@example.com', password: 'password123' };
      const mockResponse: ApiResponse<AuthResponse> = {
        data: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          token: 'mock-jwt-token',
        },
        success: true,
        message: 'Login successful',
      };

      service.login(loginRequest).subscribe((response) => {
        expect(response?.data?.token).toBe('mock-jwt-token');
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);
      req.flush(mockResponse);
    });

    it('should clear previous auth data on login attempt', () => {
      // Setup: User is already logged in
      const authResponse: AuthResponse = {
        id: 99,
        username: 'olduser',
        email: 'old@example.com',
        token: 'old-token',
      };
      service.saveToken(authResponse.token);
      service.setCurrentUser({
        id: 99,
        username: 'olduser',
        email: 'old@example.com',
      });
      expect(service.currentUser()?.id).toBe(99);

      // Act: Login attempt (HTTP request is made)
      const loginRequest: LoginRequest = { email: 'new@example.com', password: 'password123' };
      service.login(loginRequest).subscribe();

      // Assert: Old user data should be cleared before new login
      expect(service.currentUser()).toBeNull();
      expect(service.token()).toBeNull();

      httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush({});
    });
  });

  describe('register', () => {
    it('should perform HTTP POST request to register endpoint', () => {
      const registerRequest: RegisterRequest = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };
      const mockResponse: ApiResponse<AuthResponse> = {
        data: {
          id: 2,
          username: 'newuser',
          email: 'new@example.com',
          token: 'mock-jwt-token-new',
        },
        success: true,
        message: 'Registration successful',
      };

      service.register(registerRequest).subscribe((response) => {
        expect(response?.data?.username).toBe('newuser');
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerRequest);
      req.flush(mockResponse);
    });
  });

  describe('saveUserData', () => {
    it('should save token to localStorage and update currentUserSignal', () => {
      const authResponse: AuthResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        token: 'jwt-token-123',
      };

      service.saveToken(authResponse.token);
      service.setCurrentUser({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });

      expect(localStorage.getItem('auth_token')).toBe('jwt-token-123');
      expect(service.currentUser()).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
    });
  });

  describe('getToken', () => {
        it('should return null when no token exists', () => {
      const token = service.token();
      expect(token).toBeNull();
    });

    it('should return null after logout', () => {
      const response: AuthResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        token: 'test-token-123',
      };

      service.saveToken(response.token);
      service.setCurrentUser({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
      service.logout();

      const token = service.token();
      expect(token).toBeNull();
    });

    it('should return token after saveUserData', () => {
      const response: AuthResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        token: 'test-token-123',
      };

      service.saveToken(response.token);
      service.setCurrentUser({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
      const token = service.token();

      expect(token).toBe('test-token-123');
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('auth_token', 'token-to-remove');

      service.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should clear currentUserSignal', () => {
      const authResponse: AuthResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        token: 'jwt-token-123',
      };
      service.saveToken(authResponse.token);
      service.setCurrentUser({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
      expect(service.currentUser()).not.toBeNull();

      service.logout();

      expect(service.currentUser()).toBeNull();
    });
  });
});
