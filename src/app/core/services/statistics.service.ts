import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models/api-response.model';
import { StatisticsResponse } from '../../shared/models/statistics.model';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/statistics`;

  // Get my statistics
  getMyStatistics(): Observable<ApiResponse<StatisticsResponse>> {
    return this.http.get<ApiResponse<StatisticsResponse>>(`${this.apiUrl}/my-stats`);
  }
}
