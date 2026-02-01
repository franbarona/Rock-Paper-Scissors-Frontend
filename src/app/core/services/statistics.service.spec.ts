import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StatisticsService } from './statistics.service';
import { ApiResponse } from '../../shared/models/api-response.model';
import { StatisticsResponse } from '../../shared/models/statistics.model';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

// Reset TestBed to force re-initialization of service with token in storage
function resetTestBed() {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [StatisticsService, provideHttpClient(), provideHttpClientTesting()],
  });
}

describe('StatisticsService', () => {
  let service: StatisticsService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/statistics`;

  beforeEach(() => {
    resetTestBed();
    service = TestBed.inject(StatisticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('getMyStatistics', () => {
    it('should send GET request to /my-stats endpoint', () => {
      const mockStatistics: StatisticsResponse = {
        userId: 1,
        username: 'testuser',
        totalMatches: 10,
        totalWins: 6,
        totalLosses: 2,
        totalDraws: 2,
      };
      const mockResponse: ApiResponse<StatisticsResponse> = {
        data: mockStatistics,
        success: true,
        message: 'Statistics retrieved successfully',
      };

      service.getMyStatistics().subscribe((response) => {
        expect(response?.data?.userId).toBe(1);
        expect(response?.data?.username).toBe('testuser');
        expect(response?.data?.totalMatches).toBe(10);
        expect(response?.data?.totalWins).toBe(6);
        expect(response?.data?.totalLosses).toBe(2);
        expect(response?.data?.totalDraws).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/my-stats`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle zero statistics', () => {
      const mockStatistics: StatisticsResponse = {
        userId: 1,
        username: 'testuser',
        totalMatches: 0,
        totalWins: 0,
        totalLosses: 0,
        totalDraws: 0,
      };
      const mockResponse: ApiResponse<StatisticsResponse> = {
        data: mockStatistics,
        success: true,
        message: 'No statistics found',
      };

      service.getMyStatistics().subscribe((response) => {
        expect(response?.data?.totalMatches).toBe(0);
      });

      httpMock.expectOne(`${apiUrl}/my-stats`).flush(mockResponse);
    });
  });
});