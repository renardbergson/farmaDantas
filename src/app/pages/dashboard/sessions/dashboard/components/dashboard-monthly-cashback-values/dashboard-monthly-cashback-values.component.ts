import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { CustomerService, CashbackService, MonthlyCashbackValueData } from '../../../../../../shared/services';
import { Chart, TooltipItem } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard-monthly-cashback-values',
  imports: [],
  templateUrl: './dashboard-monthly-cashback-values.component.html',
  styleUrl: './dashboard-monthly-cashback-values.component.css',
})
export class DashboardMonthlyCashbackValues implements AfterViewInit, OnDestroy {
  private areaChart?: Chart;

  constructor(
    private customerService: CustomerService,
    private cashbackService: CashbackService
  ) { }

  ngAfterViewInit(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        const data = this.cashbackService.getAllLastMonthsCashbackTotals(customers);
        this.initChart(data);
      },
      error: (error) => {
        console.error('Erro ao obter dados de cashbacks mensais:', error);
      }
    })
  }

  ngOnDestroy(): void {
    this.areaChart?.destroy();
  }

  private initChart(data: MonthlyCashbackValueData): void {
    const primaryColor = '#dc2626';

    // Area Chart - Valores mensais em Cashbacks
    const areaCanvas = document.getElementById('cashbackAreaChart') as HTMLCanvasElement;
    if (!areaCanvas) return;

    const areaCtx = areaCanvas.getContext('2d');
    if (!areaCtx) return;

    const areaGradient = areaCtx.createLinearGradient(0, 0, 0, 300);
    areaGradient.addColorStop(0, 'rgba(220, 38, 38, 0.3)');
    areaGradient.addColorStop(1, 'rgba(220, 38, 38, 0)');

    this.areaChart = new Chart(areaCtx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Valor (R$)',
          data: data.values,
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
              label: (context: TooltipItem<'line'>) => {
                const value = context.raw as number;
                return `${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em cashbacks`;
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
            },
            ticks: {
              color: '#737373',
              callback: (value: string | number) => {
                const numericValue = typeof value === 'number'
                  ? value
                  : Number(value);
                return numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
              }
            }
          }
        }
      }
    });
  }
}
