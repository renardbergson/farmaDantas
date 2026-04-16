import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStatsService, FeedbackService } from '../../../../../../shared/services';
import { catchError, Observable, of, startWith } from 'rxjs';
import { DashboardStatsResponse } from '../../../../../../shared/models';
import { emptyDashboardStats } from '../../../../../../shared/constants/dashboard';

@Component({
  selector: 'app-dashboard-stats-grid',
  imports: [CommonModule],
  templateUrl: './dashboard-stats-grid.component.html',
  styleUrl: './dashboard-stats-grid.component.css',
})
export class DashboardStatsGrid {
  readonly stats$: Observable<DashboardStatsResponse>;

  constructor(
    private statsService: DashboardStatsService,
    private feedbackService: FeedbackService,
  ) {
    this.stats$ = this.statsService.stats$.pipe(
      catchError((err) => {
        this.feedbackService.apiError(err, 'Erro ao carregar as estatísticas do dashboard');
        console.error('Erro ao carregar as estatísticas do dashboard:', err);
        return of(emptyDashboardStats);
      }),
      startWith(emptyDashboardStats),
    )
  }
}