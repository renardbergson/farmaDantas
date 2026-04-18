import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasesStatsService, FeedbackService } from '../../../../../../shared/services';
import { PurchaseSessionStats } from '../../../../../../shared/models';
import { emptyPurchasesSessionStats } from '../../../../../../shared/constants/purchases';
import { Observable, catchError, startWith, of } from 'rxjs';

@Component({
  selector: 'app-purchases-stats-cards',
  imports: [CommonModule],
  templateUrl: './purchase-stats-cards.html',
  styleUrl: './purchase-stats-cards.css',
})
export class PurchaseStatsCards {
  readonly stats$: Observable<PurchaseSessionStats>;

  constructor(
    private purchasesStatsService: PurchasesStatsService,
    private feedback: FeedbackService,
  ) {
    this.stats$ = this.purchasesStatsService.stats$.pipe(
      catchError((err) => {
        this.feedback.apiError(err, 'Erro ao tentar carregar estatísticas de compras');
        console.error('Erro ao tentar carregar estatísticas de compras:', err);
        return of(emptyPurchasesSessionStats);
      }),
      startWith(emptyPurchasesSessionStats),
    );
  }
}
