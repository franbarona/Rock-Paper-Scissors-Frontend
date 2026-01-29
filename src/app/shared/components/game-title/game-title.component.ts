import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-title',
  imports: [CommonModule],
  templateUrl: './game-title.component.html',
  styleUrl: './game-title.component.css',
})
export class GameTitleComponent {
  @Input() size: 'Big' | 'Normal' = 'Normal';

}
