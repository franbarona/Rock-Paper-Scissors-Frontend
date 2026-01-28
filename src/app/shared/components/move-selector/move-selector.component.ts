import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Move } from '../../models/game.model';

@Component({
  selector: 'app-move-selector',
  imports: [],
  templateUrl: './move-selector.component.html',
  styleUrl: './move-selector.component.css',
})
export class MoveSelectorComponent {
  @Input() isLoading: boolean = false;
  @Output() action = new EventEmitter<Move>();

  handleClick(move: Move): void {
    if (!this.isLoading) {
      this.action.emit(move);
    }
  }
}
