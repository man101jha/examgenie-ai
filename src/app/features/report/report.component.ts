import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../result/result.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, NgApexchartsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  public examService = inject(ExamService);
  private router = inject(Router);

  readonly state = this.examService.state$;
  readonly ArrowLeft = ArrowLeft;

  timelineOptions!: ChartOptions;
  formattedTotalTime = '0.00 min';

  constructor() {
    if (this.state().questions.length === 0) {
      this.router.navigate(['/upload']);
    } else {
      this.initDashboard();
    }
  }

  get stats() {
    const s = this.state();
    return {
      score: s.score,
      totalQuestions: s.questions.length,
      correct: s.correctAnswers,
      incorrect: s.incorrectAnswers,
      skipped: s.skippedAnswers
    };
  }

  private initDashboard() {
    const s = this.state();
    const timelineData: any[] = [];
    const timelineColors: string[] = [];

    s.questions.forEach((q, idx) => {
      const timeSecs = s.timeSpentPerQuestion[q.id] || 0;
      const ans = s.userAnswers[q.id];
      const timeMins = +(timeSecs / 60).toFixed(2);
      
      let isCorrect = false;
      let isSkipped = !ans;

      if (!isSkipped) {
        isCorrect = ans === q.correctOptionId;
      }

      timelineData.push({ x: `Q${idx + 1}`, y: timeMins });
      
      if (isCorrect) timelineColors.push('#85c189'); // Green
      else if (!isSkipped) timelineColors.push('#c89b9a'); // Reddish
      else timelineColors.push('#ffffff'); // White/Grey
    });

    this.formattedTotalTime = (s.totalTimeSpent / 60).toFixed(2);

    this.timelineOptions = {
      series: [{ name: 'Time spent', data: timelineData }],
      chart: { type: 'bar', height: 400, background: 'transparent', toolbar: { show: false } },
      plotOptions: { bar: { distributed: true, horizontal: false, columnWidth: '45%' } },
      colors: timelineColors,
      dataLabels: { enabled: false },
      xaxis: { labels: { style: { colors: '#94a3b8' } } },
      yaxis: { 
        title: { text: 'Time (Minutes)', style: { color: '#94a3b8' } },
        labels: { style: { colors: '#94a3b8' } }
      },
      legend: { show: false },
      grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
      tooltip: { theme: 'dark', y: { formatter: (val) => val + ' min' } },
      stroke: { show: false }, fill: { opacity: 1 }
    };
  }

  goBack() {
    this.router.navigate(['/result']);
  }
}
