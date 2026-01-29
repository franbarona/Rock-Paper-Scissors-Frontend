import { Component, Input } from '@angular/core';
import { Move } from '../../models/game.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-move-display',
  imports: [CommonModule],
  templateUrl: './move-display.component.html',
  styleUrl: './move-display.component.css',
})
export class MoveDisplayComponent {
  @Input() move!: Move;
  @Input() isPlayer = true;
  @Input() isAnimating = false;
}