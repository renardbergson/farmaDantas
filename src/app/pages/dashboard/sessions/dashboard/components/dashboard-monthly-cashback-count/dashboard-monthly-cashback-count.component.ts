import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Chart, TooltipItem } from 'chart.js/auto';
import { CustomerService, MonthlyCashbackCountData } from '../../../../../../shared/services/customer.service';

@Component({
  selector: 'app-dashboard-monthly-cashback-count',
  imports: [],
  templateUrl: './dashboard-monthly-cashback-count.component.html',
  styleUrl: './dashboard-monthly-cashback-count.component.css',
})
export class DashboardMonthlyCashbackCount implements AfterViewInit, OnDestroy {
  private barChart?: Chart<'bar', number[], string>;

  constructor(private customerService: CustomerService) {}

  ngAfterViewInit(): void {
    this.customerService.getCashbackCountData()
      .subscribe(data =>
        this.initChart(data));
  }

  ngOnDestroy(): void {
    this.barChart?.destroy();
  }

  private initChart(data: MonthlyCashbackCountData): void {
    const primaryColor = '#dc2626';

    // Bar Chart - Quantidade mensal de Cashbacks
    const barCanvas = document.getElementById('cashbackBarChart') as HTMLCanvasElement;
    if (!barCanvas) return;

    const barCtx = barCanvas.getContext('2d');
    if (!barCtx) return;

    this.barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Quantidade',
          data: data.quantities,
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
            cornerRadius: 8,
            callbacks: {
              label: (context: TooltipItem<'bar'>) => {
                const value = context.raw as number;
                return `${value} cashbacks`;
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
              color: '#737373'
            }
          }
        }
      }
    });
  }
}
