import { Component, Input } from '@angular/core';
import { GameResponse, Result } from '../../models/game.model';
import { CommonModule } from '@angular/common';
import { MoveDisplayComponent } from '../move-display/move-display.component';

@Component({
  selector: 'app-last-game-result',
  imports: [CommonModule, MoveDisplayComponent],
  templateUrl: './last-game-result.html',
  styleUrl: './last-game-result.css',
})
export class LastGameResult {
  @Input() isLoading: boolean = false;
  @Input() lastGameResult: GameResponse | null = null;

  // Get result message
  getResultMessage(result: Result): string {
    switch (result) {
      case 'WIN':
        return 'You Won!';
      case 'LOSS':
        return 'You Lost!';
      case 'DRAW':
        return 'Draw!';
      default:
        return '';
    }
  }

  // Get result color
  getResultColor(result: Result | undefined): string {
    if (result === 'WIN') return 'text-emerald-600';
    if (result === 'LOSS') return 'text-rose-600';
    return 'text-gray-600';
  }
}
