import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GameService } from './game.service';
import { GameRequest, GameResponse } from '../../shared/models/game.model';
import { GameHistoryItemResponse } from '../../shared/models/history.model';
import { ApiResponse } from '../../shared/models/api-response.model';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

// Reset TestBed to force re-initialization of service with token in storage
function resetTestBed() {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [GameService, provideHttpClient(), provideHttpClientTesting()],
  });
}

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/game`;

  beforeEach(() => {
    resetTestBed();
    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('playGame', () => {
    it('should send POST request to /play endpoint with ROCK move', () => {
      const gameRequest: GameRequest = { move: 'ROCK' };
      const mockResponse: ApiResponse<GameResponse> = {
        data: {
          id: 1,
          playerMove: 'ROCK',
          computerMove: 'SCISSORS',
          result: 'WIN',
        },
        success: true,
        message: 'Game played successfully',
      };

      service.playGame(gameRequest).subscribe((response) => {
        expect(response?.data?.result).toBe('WIN');
        expect(response?.data?.playerMove).toBe('ROCK');
        expect(response?.data?.computerMove).toBe('SCISSORS');
      });

      const req = httpMock.expectOne(`${apiUrl}/play`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(gameRequest);
      req.flush(mockResponse);
    });

    it('should return WIN result when player wins', () => {
      const gameRequest: GameRequest = { move: 'ROCK' };
      const mockResponse: ApiResponse<GameResponse> = {
        data: {
          id: 1,
          playerMove: 'ROCK',
          computerMove: 'SCISSORS',
          result: 'WIN',
        },
        success: true,
        message: 'Game played successfully',
      };

      service.playGame(gameRequest).subscribe((response) => {
        expect(response?.data?.result).toBe('WIN');
      });

      httpMock.expectOne(`${apiUrl}/play`).flush(mockResponse);
    });

    it('should return DRAW result when moves are equal', () => {
      const gameRequest: GameRequest = { move: 'ROCK' };
      const mockResponse: ApiResponse<GameResponse> = {
        data: {
          id: 2,
          playerMove: 'ROCK',
          computerMove: 'ROCK',
          result: 'DRAW',
        },
        success: true,
        message: 'Game played successfully',
      };

      service.playGame(gameRequest).subscribe((response) => {
        expect(response?.data?.result).toBe('DRAW');
      });

      httpMock.expectOne(`${apiUrl}/play`).flush(mockResponse);
    });

    it('should return LOSS result when player loses', () => {
      const gameRequest: GameRequest = { move: 'ROCK' };
      const mockResponse: ApiResponse<GameResponse> = {
        data: {
          id: 1,
          playerMove: 'ROCK',
          computerMove: 'PAPER',
          result: 'LOSS',
        },
        success: true,
        message: 'Game played successfully',
      };

      service.playGame(gameRequest).subscribe((response) => {
        expect(response?.data?.result).toBe('LOSS');
      });

      httpMock.expectOne(`${apiUrl}/play`).flush(mockResponse);
    });
  });

  describe('getGameHistory', () => {
    it('should send GET request to /history endpoint', () => {
      const mockHistoryItems: GameHistoryItemResponse[] = [
        {
          id: 1,
          playerMove: 'ROCK',
          computerMove: 'SCISSORS',
          result: 'WIN',
          playedAt: new Date().toISOString(),
        },
        {
          id: 2,
          playerMove: 'PAPER',
          computerMove: 'PAPER',
          result: 'DRAW',
          playedAt: new Date().toISOString(),
        },
      ];
      const mockResponse: ApiResponse<GameHistoryItemResponse[]> = {
        data: mockHistoryItems,
        success: true,
        message: 'History retrieved successfully',
      };

      service.getGameHistory().subscribe((response) => {
        const data = response?.data;
        expect(data).toHaveLength(2);
        expect(data && data[0]?.result).toBe('WIN');
        expect(data && data[1]?.result).toBe('DRAW');
      });

      const req = httpMock.expectOne(`${apiUrl}/history`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return empty array when no history exists', () => {
      const mockResponse: ApiResponse<GameHistoryItemResponse[]> = {
        data: [],
        success: true,
        message: 'No history found',
      };

      service.getGameHistory().subscribe((response) => {
        expect(response?.data).toHaveLength(0);
      });

      httpMock.expectOne(`${apiUrl}/history`).flush(mockResponse);
    });

    it('should parse timestamps correctly', () => {
      const mockHistoryItems: GameHistoryItemResponse[] = [
        {
          id: 1,
          playerMove: 'ROCK',
          computerMove: 'SCISSORS',
          result: 'WIN',
          playedAt: new Date().toISOString(),
        },
      ];
      const mockResponse: ApiResponse<GameHistoryItemResponse[]> = {
        data: mockHistoryItems,
        success: true,
        message: 'History retrieved successfully',
      };

      service.getGameHistory().subscribe((response) => {
        const data = response?.data;
        expect(data && data[0]?.playedAt).toBe(mockHistoryItems[0].playedAt);
      });

      httpMock.expectOne(`${apiUrl}/history`).flush(mockResponse);
    });
  });
});