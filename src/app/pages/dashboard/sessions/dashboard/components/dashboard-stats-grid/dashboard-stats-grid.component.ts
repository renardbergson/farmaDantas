import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService, PurchaseService, PurchasesStats } from '../../../../../../shared/services';

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
    newCustomersChange: 0,
    purchasesThisMonth: 0,
    purchasesAmountThisMonth: 0,
    purchasesChange: 0,
    activeCashbacks: 0,
    activeCashbacksAmount: 0,
    activeCashbacksChange: 0,
    returnRateThisMonth: 0,
    returningCustomersChange: 0
  };

  constructor(
    private customerService: CustomerService,
    private purchaseService: PurchaseService
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  getActiveCashbackClass(value: number): string {
    if (value === 0) return 'trend-neutral';
    return value > 0 ? 'trend-positive' : 'trend-negative';
  }

  getActiveCashbackText(delta: number, singular: string, plural: string): string {
    if (delta === 0) return 'igual ao mês anterior';
    const n = Math.abs(delta); // retorna o valor absoluto de um número: remove o sinal, negativo ou positivo
    const text = `${delta > 0 ? '+' : '-'} ${n} ${n === 1 ? singular : plural}`;
    return text;
  }

  loadStats(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.stats = this.purchaseService.getAllPurchaseStats(customers);
      },
      error: (err) => {
        console.error('Erro ao tentar carregar a visão geral de estatísticas do dashboard:', err);
      }
    })
  }
}
