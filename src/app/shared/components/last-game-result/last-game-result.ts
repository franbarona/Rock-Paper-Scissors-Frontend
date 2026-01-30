import { Component, Input } from '@angular/core';
import { GameResponse, Result } from '../../models/game.model';
import { CommonModule } from '@angular/common';
import { MoveDisplayComponent } from '../move-display/move-display.component';
import { ResultColorPipe } from "../../pipes/result-color.pipe";

@Component({
  selector: 'app-last-game-result',
  imports: [CommonModule, MoveDisplayComponent, ResultColorPipe],
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
}
