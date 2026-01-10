import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-gpa-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="w-full h-80 p-4">
      <canvas
        baseChart
        [type]="chartType"
        [data]="chartData"
        [options]="chartOptions">
      </canvas>
    </div>
  `
})
export class GpaChart implements OnInit, OnChanges {

  @Input() labels: string[] = [];
  @Input() values: number[] = [];
  @Input() chartLabel = 'GPA';
  @Input() chartType: ChartType = 'bar';

  chartData: ChartData = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12
          },
          color: '#1e293b'
        }
      },
      tooltip: {
        backgroundColor: '#0f1b40',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      y: {
        min: 0,
        max: 4,
        ticks: {
          stepSize: 0.5,
          font: {
            family: 'Inter, sans-serif',
            size: 11
          },
          color: '#64748b'
        },
        grid: {
          color: '#e2e8f0'
        },
        title: {
          display: true,
          text: 'CGPA',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
            weight: 'bold'
          },
          color: '#1e293b'
        }
      },
      x: {
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 11
          },
          color: '#64748b'
        },
        grid: {
          display: false
        },
        title: {
          display: true,
          text: 'Academic Batches',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
            weight: 'bold'
          },
          color: '#1e293b'
        }
      }
    }
  };

  ngOnInit() {
    this.updateChart();
  }

  ngOnChanges() {
    this.updateChart();
  }

  private updateChart() {
    if (this.labels.length === 0 || this.values.length === 0) {
      console.log('Chart data is empty:', { labels: this.labels, values: this.values });
      return;
    }

    this.chartData = {
      labels: this.labels,
      datasets: [
        {
          label: this.chartLabel,
          data: this.values,
          backgroundColor: this.chartType === 'bar' ? '#0f1b40' : 'rgba(15, 27, 64, 0.1)',
          borderColor: '#0f1b40',
          borderWidth: this.chartType === 'line' ? 3 : 1,
          borderRadius: this.chartType === 'bar' ? 4 : 0,
          tension: this.chartType === 'line' ? 0.4 : 0,
          fill: this.chartType === 'line' ? true : false,
          pointBackgroundColor: '#0f1b40',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: this.chartType === 'line' ? 6 : 0,
          pointHoverRadius: this.chartType === 'line' ? 8 : 0
        }
      ]
    };

    console.log('Chart updated with data:', this.chartData);
  }
}
