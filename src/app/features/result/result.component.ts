import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';
import { LucideAngularModule, ArrowLeft, ChevronDown, ArrowRight } from 'lucide-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexGrid
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  labels?: string[];
  colors?: string[];
  grid?: ApexGrid;
};

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, NgApexchartsModule],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
  public examService = inject(ExamService);
  private router = inject(Router);

  readonly state = this.examService.state$;
  readonly ArrowLeft = ArrowLeft;
  readonly ArrowRight = ArrowRight;
  readonly ChevronDown = ChevronDown;

  protected readonly Math = Math;

  timePieOptions!: ChartOptions;
  scoreBarOptions!: ChartOptions;

  formattedTotalTime = '0m 0s';
  timePercentages = { correct: 0, incorrect: 0, skipped: 0 };

  constructor() {
    if (this.state().questions.length === 0) {
      this.router.navigate(['/upload']);
    } else {
      this.initDashboards();
    }
  }

  get stats() {
    const s = this.state();
    const multiplier = s.questions.length > 0 && s.questions[0]?.marks ? s.questions[0].marks : 1;
    const totalMarks = s.questions.length * multiplier;
    
    // Original algorithm calculations
    const accuracy = s.correctAnswers + s.incorrectAnswers > 0 
      ? Math.round((s.correctAnswers / (s.correctAnswers + s.incorrectAnswers)) * 100) 
      : 0;
      
    const percentage = totalMarks > 0 
      ? Math.round((s.score / totalMarks) * 100) 
      : 0;

    const correctMarks = s.correctAnswers * multiplier;
    const incorrectMarks = s.incorrectAnswers * multiplier; 
    const negativeMarks = -s.incorrectAnswers; 

    return {
      score: s.score,
      totalQuestions: s.questions.length,
      correct: s.correctAnswers,
      incorrect: s.incorrectAnswers,
      skipped: s.skippedAnswers,
      totalMarks: totalMarks,
      accuracy,
      percentage,
      correctMarks,
      incorrectMarks,
      negativeMarks,
      questionMarks: multiplier
    };
  }

  // Derived dashboard initialization
  private initDashboards() {
    const s = this.state();

    let correctTime = 0;
    let incorrectTime = 0;
    let skippedTime = 0;

    s.questions.forEach((q, idx) => {
      const timeSecs = s.timeSpentPerQuestion[q.id] || 0;
      const ans = s.userAnswers[q.id];
      const timeMins = +(timeSecs / 60).toFixed(2);
      
      let isCorrect = false;
      let isSkipped = !ans;

      if (!isSkipped) {
        isCorrect = ans === q.correctOptionId;
      }

      if (isCorrect) correctTime += timeSecs;
      else if (isSkipped) skippedTime += timeSecs;
      else incorrectTime += timeSecs;
    });

    const totalSeconds = correctTime + incorrectTime + skippedTime || 1; // avoid /0
    const m = Math.floor(s.totalTimeSpent / 60);
    const sec = s.totalTimeSpent % 60;
    this.formattedTotalTime = `${m}m ${sec}s`;

    this.timePercentages = {
      correct: Math.round((correctTime / totalSeconds) * 100),
      incorrect: Math.round((incorrectTime / totalSeconds) * 100),
      skipped: Math.round((skippedTime / totalSeconds) * 100)
    };

    // 1. Time Analysis Pie Chart
    this.timePieOptions = {
      series: [correctTime, incorrectTime, skippedTime],
      chart: { type: 'pie', height: 250, background: 'transparent' },
      labels: ['Correct', 'Incorrect', 'Skipped'],
      colors: ['#85c189', '#c89b9a', '#ffffff'],
      dataLabels: { enabled: false },
      legend: { show: false },
      stroke: { show: false },
      plotOptions: {}, yaxis: {}, xaxis: {} as ApexXAxis, fill: {}, tooltip: {}
    };

    // 2. Score Analysis Bar Chart (Horizontal Stacked)
    this.scoreBarOptions = {
      series: [
        { name: 'Correct', data: [s.correctAnswers] },
        { name: 'Incorrect', data: [s.incorrectAnswers] },
        { name: 'Skipped', data: [s.skippedAnswers] }
      ],
      chart: { type: 'bar', height: 120, stacked: true, background: 'transparent', toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true, barHeight: '40%' } },
      colors: ['#85c189', '#c89b9a', '#ffffff'],
      xaxis: { 
        categories: ['Attempts'], 
        max: s.questions.length,
        tickAmount: s.questions.length,
        labels: { style: { colors: '#94a3b8' } }
      },
      yaxis: { labels: { show: false } },
      legend: { show: false },
      dataLabels: { enabled: false },
      grid: { borderColor: 'rgba(255,255,255,0.05)' },
      stroke: { show: false },
      fill: { opacity: 1 },
      tooltip: { theme: 'dark' }
    };
  }

  getRingDashArray(value: number, max: number): string {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const ratio = max > 0 ? Math.min(Math.abs(value) / max, 1) : 0;
    const dash = circumference * ratio;
    const gap = circumference - dash;
    return `${dash} ${gap}`;
  }

  viewSolution() {
    this.router.navigate(['/solution']);
  }

  navigateToReport() {
    this.router.navigate(['/report']);
  }

  goBack() {
    this.router.navigate(['/upload']);
  }
}
