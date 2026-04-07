import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { CashbackService, CustomerService, PurchaseService, PurchasesStats } from '../../../../../../shared/services';

@Component({
  selector: 'app-purchases-stats-cards',
  imports: [CommonModule],
  templateUrl: './purchase-stats-cards.html',
  styleUrl: './purchase-stats-cards.css',
})
export class PurchaseStatsCards implements OnInit {
  stats: Partial<PurchasesStats> = {
    purchasesThisMonth: 0,
    purchasesAmountThisMonth: 0,
    purchasesToday: 0,
    purchasesAmountToday: 0,
  };

  constructor(
    private customerService: CustomerService,
    private purchaseService: PurchaseService,
    private cashbackService: CashbackService,
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    forkJoin({
      customers: this.customerService.getCustomers(),
      purchases: this.purchaseService.getPurchases(),
      cashbacks: this.cashbackService.getCashbacks(),
    }).subscribe({
      next: ({ customers, purchases, cashbacks }) => {
        this.stats = this.purchaseService.getAllPurchaseStats(
          customers,
          purchases,
          cashbacks,
        );
      },
      error: (err) => {
        console.error('Erro ao tentar carregar estatísticas de compras:', err);
      }
    })
  }
}
