import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DashboardStats {
  totalCustomers: number;
  newCustomersToday: number;
  trendCustomers: number;
  purchasesMonth: number;
  salesMonth: number;
  trendPurchases: number;
  activeCashbacks: number;
  availableCashbacks: number;
  trendCashbacks: number;
  returnRate: number;
  trendReturn: number;
}

@Component({
  selector: 'app-dashboard-stats-grid',
  imports: [CommonModule],
  templateUrl: './dashboard-stats-grid.component.html',
  styleUrl: './dashboard-stats-grid.component.css',
})
export class DashboardStatsGrid implements OnInit {
  stats: DashboardStats = {
    totalCustomers: 2547,
    newCustomersToday: 12,
    trendCustomers: 12,
    purchasesMonth: 1234,
    salesMonth: 45890.00,
    trendPurchases: 8,
    activeCashbacks: 856,
    availableCashbacks: 4280.00,
    trendCashbacks: 5,
    returnRate: 73,
    trendReturn: 3
  };

  ngOnInit(): void {
    // TODO: Integração com API
    // Chamar loadStatsData() quando a API estiver disponível
    // this.loadStatsData();
  }

  /**
   * Método para carregar dados do backend
   * Endpoint sugerido: GET /api/dashboard/stats
   * Resposta esperada: DashboardStats
   *
   * Exemplo de implementação:
   * loadStatsData(): void {
   *   this.dashboardService.getStats().subscribe({
   *     next: (stats: DashboardStats) => {
   *       this.stats = stats;
   *     },
   *     error: (error) => {
   *       console.error('Erro ao carregar estatísticas:', error);
   *       // Tratar erro (exibir mensagem, usar dados padrão, etc.)
   *     }
   *   });
   * }
   */
  // loadStatsData(): void {
  //   // Implementar chamada HTTP aqui
  // }

  /**
   * Método para atualizar os stats manualmente
   * Útil para atualizações em tempo real ou quando os dados vierem de outro componente
   * @param newStats - Novos dados de estatísticas do dashboard
   */
  updateStats(newStats: DashboardStats): void {
    this.stats = { ...newStats };
  }
}
