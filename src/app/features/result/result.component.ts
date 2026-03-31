import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';
import { LucideAngularModule, ArrowLeft, ChevronDown } from 'lucide-angular';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
  public examService = inject(ExamService);
  private router = inject(Router);
  
  readonly state = this.examService.state$;
  readonly ArrowLeft = ArrowLeft;
  readonly ChevronDown = ChevronDown;

  constructor() {
    if (this.state().questions.length === 0) {
      this.router.navigate(['/upload']);
    }
  }

  get stats() {
    const s = this.state();
    const actCorrect = s.correctAnswers;
    const actIncorrect = s.incorrectAnswers;
    const actSkipped = s.skippedAnswers;

    let correctMarks = 0;
    let negativeMarks = 0;
    
    s.questions.forEach(q => {
      const ans = s.userAnswers[q.id];
      if (ans) {
        if (ans === q.correctOptionId) {
          correctMarks += q.marks;
        } else {
          negativeMarks += q.negativeMarks;
        }
      }
    });

    const totalMarks = s.totalMarksTaken;
    const totalAttempted = actCorrect + actIncorrect;
    const accuracy = totalAttempted > 0 ? Math.round((actCorrect / totalAttempted) * 100) : 0;
    const percentage = totalMarks > 0 ? Math.round((s.score / totalMarks) * 100) : 0;

    return {
      score: s.score,
      totalMarks,
      accuracy,
      percentage,
      correctMarks,
      negativeMarks,
      incorrectMarks: actIncorrect * 3, // Assuming each question was 3 marks for missed
      skippedMarks: 0
    };
  }

  getRingDashArray(value: number, max: number): string {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    // ensure value is positive for ratio
    const ratio = max > 0 ? Math.min(Math.abs(value) / max, 1) : 0;
    const dash = circumference * ratio;
    const gap = circumference - dash;
    return `${dash} ${gap}`;
  }

  viewSolution() {
    this.router.navigate(['/solution']);
  }

  goBack() {
    this.router.navigate(['/upload']);
  }
}
