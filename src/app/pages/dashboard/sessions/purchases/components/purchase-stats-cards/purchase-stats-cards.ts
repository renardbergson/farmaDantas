import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseService, FeedbackService } from '../../../../../../shared/services';
import { PurchaseSessionStats } from '../../../../../../shared/models';
import { Observable, catchError, startWith, of } from 'rxjs';

const emptyStats: PurchaseSessionStats = {
  purchasesThisMonth: 0,
  purchasesAmountThisMonth: 0,
  purchasesToday: 0,
  purchasesAmountToday: 0,
};
@Component({
  selector: 'app-purchases-stats-cards',
  imports: [CommonModule],
  templateUrl: './purchase-stats-cards.html',
  styleUrl: './purchase-stats-cards.css',
})
export class PurchaseStatsCards {
  readonly stats$: Observable<PurchaseSessionStats>;

  constructor(
    private purchaseService: PurchaseService,
    private feedback: FeedbackService
  ) {
    this.stats$ = this.purchaseService.stats$.pipe(
      catchError((err) => {
        this.feedback.apiError(err, 'Erro ao tentar carregar estatísticas de compras');
        console.error('Erro ao tentar carregar estatísticas de compras:', err);
        return of(emptyStats);
      }),
      startWith(emptyStats) // fallback
    );
  }
}
