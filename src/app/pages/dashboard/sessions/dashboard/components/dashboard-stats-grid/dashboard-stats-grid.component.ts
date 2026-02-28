import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../../../../shared/services/customer.service';
import { PurchasesStats } from '../../../../../../shared/models';

@Component({
  selector: 'app-dashboard-stats-grid',
  imports: [CommonModule],
  templateUrl: './dashboard-stats-grid.component.html',
  styleUrl: './dashboard-stats-grid.component.css',
})
export class DashboardStatsGrid implements OnInit {
  stats: Partial<PurchasesStats> = {
    totalCustomers: 0,
    newCustomersToday: 0,
    newCustomersRateChange: 0,
    purchasesThisMonth: 0,
    purchasesAmountThisMonth: 0,
    purchasesRateChange: 0,
    activeCashbacks: 0,
    activeCashbacksAmount: 0,
    activeCashbacksRateChange: 0,
    returnRateThisMonth: 0,
    returnRateChange: 0
  };

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  getTrendClass(value: number): string {
    return value >= 0 ? 'trend-positive' : 'trend-negative';
  }

  loadStats(): void {
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
