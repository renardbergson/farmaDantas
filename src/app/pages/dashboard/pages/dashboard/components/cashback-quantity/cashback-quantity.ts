import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

declare var Chart: any;

export interface CashbackQuantityData {
  labels: string[];
  quantities: number[];
}

@Component({
  selector: 'app-cashback-quantity',
  imports: [],
  templateUrl: './cashback-quantity.html',
  styleUrl: './cashback-quantity.css',
})
export class CashbackQuantity implements OnInit, AfterViewInit, OnDestroy {
  private barChart: any;

  /**
   * Dados do gráfico de quantidade de cashbacks
   * TODO: Substituir por dados do backend
   * Estrutura esperada:
   * - labels: Array de strings com os meses/períodos (ex: ['Jan', 'Fev', 'Mar'])
   * - quantidades: Array de números com a quantidade de cashbacks de cada período
   */
  chartData: CashbackQuantityData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    quantities: [120, 98, 145, 132, 167, 189]
  };

  ngOnInit(): void {
    // TODO: Integração com API
    // Chamar loadChartData() quando a API estiver disponível
    // this.loadChartData();
  }

  ngAfterViewInit(): void {
    // Aguardar um pouco para garantir que o Chart.js está carregado
    setTimeout(() => {
      this.initChart();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.barChart) {
      this.barChart.destroy();
    }
  }

  private initChart(): void {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js não está carregado. Certifique-se de incluir o script no index.html');
      return;
    }

    const primaryColor = '#dc2626';

    // Bar Chart - Quantidade de Cashbacks
    const barCanvas = document.getElementById('cashbackBarChart') as HTMLCanvasElement;
    if (barCanvas) {
      const barCtx = barCanvas.getContext('2d');
      if (barCtx) {
        this.barChart = new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: this.chartData.labels,
            datasets: [{
              label: 'Quantidade',
              data: this.chartData.quantities,
              backgroundColor: primaryColor,
              borderRadius: 4,
              borderSkipped: false
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: '#fff',
                titleColor: '#1f1f1f',
                bodyColor: '#1f1f1f',
                borderColor: '#e5e5e5',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  color: '#737373'
                }
              },
              y: {
                grid: {
                  color: '#e5e5e5',
                  drawBorder: false
                },
                ticks: {
                  color: '#737373'
                }
              }
            }
          }
        });
      }
    }
  }

  /**
   * Método para atualizar dados do gráfico
   * Chamado automaticamente quando os dados vierem do backend
   * @param data - Dados do gráfico com labels e quantidades
   */
  updateChartData(data: CashbackQuantityData): void {
    this.chartData = { ...data };
    if (this.barChart) {
      this.barChart.data.labels = data.labels;
      this.barChart.data.datasets[0].data = data.quantities;
      this.barChart.update();
    }
  }

  /**
   * Método para carregar dados do backend
   * Endpoint sugerido: GET /api/dashboard/cashback-quantity
   * Parâmetros opcionais: ?period=6 (quantidade de meses/períodos)
   * Resposta esperada: { labels: string[], quantidades: number[] }
   *
   * Exemplo de implementação:
   * loadChartData(): void {
   *   this.cashbackService.getQuantityData({ period: 6 }).subscribe({
   *     next: (data: CashbackQuantityData) => {
   *       this.updateChartData(data);
   *     },
   *     error: (error) => {
   *       console.error('Erro ao carregar dados do gráfico:', error);
   *       // Manter dados mockados em caso de erro
   *     }
   *   });
   * }
   */
  // loadChartData(): void {
  //   // Implementar chamada HTTP aqui
  // }
}
