import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score',
  imports: [],
  templateUrl: './score.component.html',
  styleUrl: './score.component.css',
})
export class ScoreComponent {
  @Input() wins: number = 0;
  @Input() losses: number = 0;
}
