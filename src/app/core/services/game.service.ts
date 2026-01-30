import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GameRequest, GameResponse } from '../../shared/models/game.model';
import { ApiResponse } from '../../shared/models/api-response.model';
import { Observable } from 'rxjs';
import { GameHistoryItemResponse } from '../../shared/models/history.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/game`;

  // Play a game
  playGame(request: GameRequest): Observable<ApiResponse<GameResponse>> {
    return this.http.post<ApiResponse<GameResponse>>(`${this.apiUrl}/play`, request);
  }

  // Get my game history
  getGameHistory(): Observable<ApiResponse<GameHistoryItemResponse[]>> {
    return this.http.get<ApiResponse<GameHistoryItemResponse[]>>(`${this.apiUrl}/history`);
  }
}
