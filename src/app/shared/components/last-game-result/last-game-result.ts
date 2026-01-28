import { Component, Input } from '@angular/core';
import { GameResponse } from '../../models/game.model';

@Component({
  selector: 'app-last-game-result',
  imports: [],
  templateUrl: './last-game-result.html',
  styleUrl: './last-game-result.css',
})
export class LastGameResult {
  @Input() isLoading: boolean = false;
  @Input() lastGameResult: GameResponse | null = null;

  // Get result message
  getResultMessage(result: string): string {
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
}
