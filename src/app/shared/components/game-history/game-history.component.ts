import { Component, inject, OnInit, signal } from '@angular/core';
import { GameService } from '../../../core/services/game.service';
import { GameHistoryItemResponse } from '../../models/history.model';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../loading/loading.component";
import { ErrorMessageComponent } from "../error-message/error-message.component";
import { ResultColorPipe } from "../../pipes/result-color.pipe";

@Component({
  selector: 'app-game-history',
  imports: [CommonModule, LoadingComponent, ErrorMessageComponent, ResultColorPipe],
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
}
