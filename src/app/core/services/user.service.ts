import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, UpdateUserRequest } from '../../shared/models/user.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  // Get current user info
  getCurrentUser() {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`).pipe(
      catchError((error) => {
        console.error('Error fetching user:', error);
        return throwError(() => error);
      }),
    );
  }

  // Update user info
  updateUser(request: UpdateUserRequest) {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/me`, request).pipe(
      catchError((error) => {
        console.error('Error updating user:', error);
        return throwError(() => error);
      }),
    );
  }
}
