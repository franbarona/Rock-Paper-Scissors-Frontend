import { Component } from '@angular/core';
import { GameStatsComponent } from '../../shared/components/game-stats/game-stats.component';
import { GameHistoryComponent } from '../../shared/components/game-history/game-history.component';

@Component({
  selector: 'app-statistics',
  imports: [GameStatsComponent, GameHistoryComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent {}
