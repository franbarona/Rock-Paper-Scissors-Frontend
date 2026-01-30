import { Component, inject, OnInit, signal } from '@angular/core';
import { StatisticsService } from '../../../core/services/statistics.service';
import { StatisticsResponse } from '../../models/statistics.model';
import { LoadingComponent } from "../loading/loading.component";
import { ErrorMessageComponent } from "../error-message/error-message.component";

@Component({
  selector: 'app-game-stats',
  imports: [LoadingComponent, ErrorMessageComponent],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.css',
})
export class GameStatsComponent implements OnInit {
  private readonly statisticsService = inject(StatisticsService);

  statistics = signal<StatisticsResponse | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    // Load game statistics
    this.statisticsService.getMyStatistics().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.statistics.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        if (error?.error?.message) {
          this.errorMessage.set(error.error.message);
        } else {
          this.errorMessage.set('Error loading statistics. Please try again.');
        }
        this.isLoading.set(false);
      },
    });
  }

  // Calculate win rate percentage
  getWinRate(): number {
    const stats = this.statistics();
    if (!stats || stats.totalMatches === 0) return 0;
    return Math.round((stats.totalWins / stats.totalMatches) * 100);
  }
}
