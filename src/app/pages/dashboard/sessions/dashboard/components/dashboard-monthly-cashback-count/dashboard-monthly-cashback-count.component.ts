import { Component, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Chart, TooltipItem } from 'chart.js/auto';
import { DashboardStatsService, FeedbackService } from '../../../../../../shared/services';
import { MONTH_LABELS_PT } from '../../../../../../shared/constants/month-labels';

interface MonthlyCashbackCountData {
  labels: string[];
  quantities: number[];
}

@Component({
  selector: 'app-dashboard-monthly-cashback-count',
  imports: [],
  templateUrl: './dashboard-monthly-cashback-count.component.html',
  styleUrl: './dashboard-monthly-cashback-count.component.css',
})
export class DashboardMonthlyCashbackCount implements AfterViewInit, OnDestroy {
  private barChart?: Chart<'bar', number[], string>;
  private statsSubscription?: Subscription;
  hasData = false;

  constructor(
    private statsService: DashboardStatsService,
    private cdr: ChangeDetectorRef,
    private feedbackService: FeedbackService
  ) { }

  ngAfterViewInit(): void {
    this.statsSubscription = this.statsService.stats$.subscribe({
      next: (stats) => {
        const points = stats.cashbacks.lastSixMonths ?? [];
        this.hasData = points.some(point => point.count > 0);

        this.barChart?.destroy(); // mata instância antiga, se existir

        if (!this.hasData) return;

        const data: MonthlyCashbackCountData = {
          labels: points.map(point => MONTH_LABELS_PT[point.label] ?? point.label),
          quantities: points.map(point => point.count),
        };

        this.cdr.detectChanges(); // garante que o canvas já foi renderizado antes de chamar initChart()
        queueMicrotask(() => this.initChart(data));
      },
      error: (error) => {
        this.feedbackService.apiError(error, 'Erro ao obter contagens mensais em cashback');
        console.error('Erro ao obter contagens mensais em cashback:', error);
      }
    })
  }

  ngOnDestroy(): void {
    this.statsSubscription?.unsubscribe();
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
