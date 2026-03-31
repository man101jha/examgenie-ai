import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
import { QuestionStatus } from '../../core/models/exam.model';

@Component({
  selector: 'app-pre-submit',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './pre-submit.component.html',
  styleUrls: ['./pre-submit.component.css']
})
export class PreSubmitComponent {
  public examService = inject(ExamService);
  private router = inject(Router);
  
  readonly state = this.examService.state$;
  readonly ArrowLeft = ArrowLeft;

  constructor() {
    if (this.state().questions.length === 0) {
      this.router.navigate(['/upload']);
    }
  }

  get stats() {
    const s = this.state();
    let answered = 0;
    let skipped = 0;
    let marked = 0;

    Object.values(s.questionStatuses).forEach(status => {
      if (status === 'ANSWERED') answered++;
      else if (status === 'ANSWERED_MARKED_FOR_REVIEW') { answered++; marked++; }
      else if (status === 'MARKED_FOR_REVIEW') marked++;
      else if (status === 'NOT_ANSWERED' || status === 'NOT_VISITED') skipped++;
    });

    return { total: s.questions.length, answered, skipped, marked };
  }

  goBack() {
    this.router.navigate(['/exam']);
  }

  finalSubmit() {
    this.examService.submitExam();
    this.router.navigate(['/result']);
  }
}
