import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../../../../shared/services/customer.service';
import { PurchasesStats } from '../../../../../../shared/models';

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

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.customerService.getPurchasesStats().subscribe({
      next: (stats: PurchasesStats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Erro ao tentar carregar estatísticas:', err);
      }
    })
  }
}
