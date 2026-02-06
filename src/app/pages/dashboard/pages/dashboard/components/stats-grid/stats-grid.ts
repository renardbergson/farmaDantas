import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DashboardStats {
  totalClientes: number;
  novosClientesHoje: number;
  trendClientes: number;
  comprasMes: number;
  vendasMes: number;
  trendCompras: number;
  cashbacksAtivos: number;
  cashbacksDisponiveis: number;
  trendCashbacks: number;
  taxaRetorno: number;
  trendRetorno: number;
}

@Component({
  selector: 'app-stats-grid',
  imports: [CommonModule],
  templateUrl: './stats-grid.html',
  styleUrl: './stats-grid.css',
})
export class StatsGrid implements OnInit {
  stats: DashboardStats = {
    totalClientes: 2547,
    novosClientesHoje: 12,
    trendClientes: 12,
    comprasMes: 1234,
    vendasMes: 45890.00,
    trendCompras: 8,
    cashbacksAtivos: 856,
    cashbacksDisponiveis: 4280.00,
    trendCashbacks: 5,
    taxaRetorno: 73,
    trendRetorno: 3
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
