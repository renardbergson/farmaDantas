import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, Observable, of, startWith } from 'rxjs';

import {
  DashboardStatsService,
  FeedbackService
} from '../../../../../../shared/services';
import { DashboardStatsResponse } from '../../../../../../shared/models';
import { emptyDashboardStats } from '../../../../../../shared/constants/dashboard';
import { getInitials } from '../../../../../../shared/utils/getInitials';

@Component({
  selector: 'app-dashboard-top-customers',
  imports: [CommonModule],
  templateUrl: './dashboard-top-customers.component.html',
  styleUrl: './dashboard-top-customers.component.css',
})
export class DashboardTopCustomers {
  readonly stats$: Observable<DashboardStatsResponse>;

  constructor(
    private router: Router,
    private statsService: DashboardStatsService,
    private feedbackService: FeedbackService
  ) {
    this.stats$ = this.statsService.stats$.pipe(
      catchError((err) => {
        this.feedbackService.apiError(err, 'Erro ao carregar top 5 clientes');
        console.error('Erro ao carregar top 5 clientes:', err);
        return of(emptyDashboardStats);
      }),
      startWith(emptyDashboardStats),
    )
  }

  getInitials(name: string): string {
    return getInitials(name);
  }

  viewAllCustomers(): void {
    this.router.navigate(['/user/customers']);
  }
}