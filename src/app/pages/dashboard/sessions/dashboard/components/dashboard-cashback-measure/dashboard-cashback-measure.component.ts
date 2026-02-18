import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

declare var Chart: any;

export interface CashbackMeasureData {
  labels: string[];
  values: number[];
}

@Component({
  selector: 'app-dashboard-cashback-measure',
  imports: [],
  templateUrl: './dashboard-cashback-measure.component.html',
  styleUrl: './dashboard-cashback-measure.component.css',
})
export class DashboardCashbackMeasure implements OnInit, AfterViewInit, OnDestroy {
  private areaChart: any;

  /**
   * Dados do gráfico de evolução de cashbacks
   * TODO: Substituir por dados do backend
   * Estrutura esperada:
   * - labels: Array de strings com os meses/períodos (ex: ['Jan', 'Fev', 'Mar'])
   * - valores: Array de números com os valores em R$ de cada período
   */
  chartData: CashbackMeasureData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    values: [4200, 3800, 5100, 4600, 5800, 6200]
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
    if (this.areaChart) {
      this.areaChart.destroy();
    }
  }

  private initChart(): void {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js não está carregado. Certifique-se de incluir o script no index.html');
      return;
    }

    const primaryColor = '#dc2626';

    // Area Chart - Evolução de Cashbacks
    const areaCanvas = document.getElementById('cashbackAreaChart') as HTMLCanvasElement;
    if (areaCanvas) {
      const areaCtx = areaCanvas.getContext('2d');
      if (areaCtx) {
        const areaGradient = areaCtx.createLinearGradient(0, 0, 0, 300);
        areaGradient.addColorStop(0, 'rgba(220, 38, 38, 0.3)');
        areaGradient.addColorStop(1, 'rgba(220, 38, 38, 0)');

        this.areaChart = new Chart(areaCtx, {
          type: 'line',
          data: {
            labels: this.chartData.labels,
            datasets: [{
              label: 'Valor (R$)',
              data: this.chartData.values,
              fill: true,
              backgroundColor: areaGradient,
              borderColor: primaryColor,
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: primaryColor,
              pointBorderColor: '#fff',
              pointBorderWidth: 2
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
                cornerRadius: 8,
                callbacks: {
                  label: function (context: any) {
                    return 'R$ ' + context.raw.toLocaleString('pt-BR');
                  }
                }
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
                  color: '#737373',
                  callback: function (value: any) {
                    return 'R$ ' + value.toLocaleString('pt-BR');
                  }
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
   * @param data - Dados do gráfico com labels e valores
   */
  updateChartData(data: CashbackMeasureData): void {
    this.chartData = { ...data };
    if (this.areaChart) {
      this.areaChart.data.labels = data.labels;
      this.areaChart.data.datasets[0].data = data.values;
      this.areaChart.update();
    }
  }

  /**
   * Método para carregar dados do backend
   * Endpoint sugerido: GET /api/dashboard/cashback-measure
   * Parâmetros opcionais: ?period=6 (quantidade de meses/períodos)
   * Resposta esperada: { labels: string[], valores: number[] }
   *
   * Exemplo de implementação:
   * loadChartData(): void {
   *   this.cashbackService.getMeasureData({ period: 6 }).subscribe({
   *     next: (data: CashbackMeasureData) => {
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
