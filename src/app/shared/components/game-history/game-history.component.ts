import { Component, inject, OnInit, signal } from '@angular/core';
import { GameService } from '../../../core/services/game.service';
import { GameHistoryItemResponse } from '../../models/history.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-history',
  imports: [CommonModule],
  templateUrl: './game-history.component.html',
  styleUrl: './game-history.component.css',
})
export class GameHistoryComponent implements OnInit {
  private readonly gameService = inject(GameService);

  gameHistory = signal<GameHistoryItemResponse[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    // Load game history
    this.gameService.getGameHistory().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.gameHistory.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        if (error?.error?.message) {
          this.errorMessage.set(error.error.message);
        } else {
          this.errorMessage.set('Error loading game history. Please try again.');
        }
        this.isLoading.set(false);
      },
    });
  }

  // Get color for result
  getResultColor(result: string): string {
    if (result === 'WIN') return 'text-(--text-green-color)';
    if (result === 'LOSS') return 'text-(--text-red-color)';
    return 'text-(--text-secondary-color)';
  }
}
