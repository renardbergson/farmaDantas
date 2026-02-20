import { Component, OnInit } from '@angular/core';
import { DashboardHeader, DashboardStatsGrid, DashboardMonthlyCashbackValues, DashboardMonthlyCashbackCount, DashboardTopCustomers, DashboardRecentCashbacks } from './components/index';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardHeader, DashboardStatsGrid, DashboardMonthlyCashbackValues, DashboardMonthlyCashbackCount, DashboardTopCustomers, DashboardRecentCashbacks],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  ngOnInit(): void {
    /**
     * Componente container do dashboard
     *
     * Este componente é apenas um container que organiza os componentes filhos.
     * Toda a lógica de carregamento de dados está nos componentes individuais:
     *
     * - DashboardStatsGrid: Carrega estatísticas gerais (ngOnInit)
     * - DashboardMonthlyCashbackValues: Carrega dados do gráfico de evolução (ngOnInit)
     * - DashboardMonthlyCashbackCount: Carrega dados do gráfico de quantidade (ngOnInit)
     * - DashboardTopCustomers: Carrega lista de top clientes (ngOnInit)
     * - DashboardRecentCashbacks: Carrega lista de cashbacks recentes (ngOnInit)
     *
     * Para integração com API, implemente os métodos load*() em cada componente filho.
     *
     * TODO: Se necessário carregar todos os dados de uma vez, criar um serviço centralizado:
     * loadAllDashboardData(): void {
     *   forkJoin({
     *     stats: this.dashboardService.getStats(),
     *     measureData: this.cashbackService.getMeasureData(),
     *     quantityData: this.cashbackService.getQuantityData(),
     *     topCustomers: this.customersService.getTopClientes(),
     *     recentCashbacks: this.cashbackService.getRecentCashbacks()
     *   }).subscribe({
     *     next: (data) => {
     *       // Distribuir dados para os componentes filhos via @Input() ou serviços
     *     },
     *     error: (error) => {
     *       console.error('Erro ao carregar dados do dashboard:', error);
     *     }
     *   });
     * }
     */
  }
}
