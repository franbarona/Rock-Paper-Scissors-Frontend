import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { GameService } from '../../core/services/game.service';
import { GameRequest, GameResponse, Move, Result } from '../../shared/models/game.model';
import { ScoreComponent } from '../../shared/components/score/score.component';
import { MoveSelectorComponent } from '../../shared/components/move-selector/move-selector.component';
import { LastGameResult } from '../../shared/components/last-game-result/last-game-result';
import { delay } from 'rxjs';
import { ErrorMessageComponent } from "../../shared/components/error-message/error-message.component";

@Component({
  selector: 'app-game',
  imports: [CommonModule, ScoreComponent, MoveSelectorComponent, LastGameResult, ErrorMessageComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  private readonly gameService = inject(GameService);

  isLoading = signal(false);
  wins = signal(0);
  losses = signal(0);
  result = signal<Result | null>(null);
  lastGameResult = signal<GameResponse | null>(null);
  errorMessage = signal<string | null>(null);

  // Play a game
  playGame(move: Move): void {
    this.isLoading.set(true);
    this.lastGameResult.set(null);
    this.errorMessage.set(null);

    const request: GameRequest = {
      move: move,
    };

    this.gameService
      .playGame(request)
      .pipe(
        delay(2400), // Wait for animation effect
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.lastGameResult.set(response.data);
            this.result.set(response.data.result);
            // Update score
            if (this.result() === 'WIN') {
              this.wins.set(this.wins() + 1);
            } else if (this.result() === 'LOSS') {
              this.losses.set(this.losses() + 1);
            }
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          if (error?.error?.message) {
            this.errorMessage.set(error.error.message);
          } else {
            this.errorMessage.set('Error connecting to server. Please try again.');
          }
          this.isLoading.set(false);
        },
      });
  }
}
