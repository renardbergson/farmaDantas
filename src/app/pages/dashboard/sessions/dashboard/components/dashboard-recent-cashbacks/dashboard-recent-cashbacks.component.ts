import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  DashboardStatsService,
  FeedbackService
} from '../../../../../../shared/services';
import { CashbackStatus, DashboardStatsResponse } from '../../../../../../shared/models';
import { catchError, Observable, of, startWith } from 'rxjs';
import { emptyDashboardStats } from '../../../../../../shared/constants/dashboard';
import { CashbackStatusLabelPipe } from '../../../../../../shared/pipes';

@Component({
  selector: 'app-dashboard-recent-cashbacks',
  imports: [CommonModule, CashbackStatusLabelPipe],
  templateUrl: './dashboard-recent-cashbacks.component.html',
  styleUrl: './dashboard-recent-cashbacks.component.css',
})
export class DashboardRecentCashbacks {
  readonly stats$: Observable<DashboardStatsResponse>;
  CashbackStatus = CashbackStatus;

  constructor(
    private router: Router,
    private statsService: DashboardStatsService,
    private feedbackService: FeedbackService
  ) {
    this.stats$ = this.statsService.stats$.pipe(
      catchError((err) => {
        this.feedbackService.apiError(err, 'Erro ao carregar cashbacks recentes');
        console.error('Erro ao carregar cashbacks recentes:', err);
        return of(emptyDashboardStats);
      }),
      startWith(emptyDashboardStats),
    );
  }

  viewAllCashbacks(): void {
    this.router.navigate(['/user/cashbacks']);
  }

  getExpiresText(expiresInDays: number | null, status: CashbackStatus): string {
    if (expiresInDays === null) {
      if (status === CashbackStatus.USED) return 'Utilizado';
      if (status === CashbackStatus.EXPIRED) return 'Expirado';
      return 'Sem validade';
    }
    if (expiresInDays < 0) return 'Expirado';
    if (expiresInDays === 0) return 'Expira hoje';
    if (expiresInDays === 1) return 'Expira amanhã';
    return `Expira em ${expiresInDays} dias`;
  }
}
