import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../../../core/services/exam.service';
import { QuestionStatus } from '../../../../core/models/exam.model';

@Component({
  selector: 'app-question-palette',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-palette.component.html',
  styleUrls: ['./question-palette.component.css']
})
export class QuestionPaletteComponent {
  @Output() submitRequested = new EventEmitter<void>();
  public examService = inject(ExamService);
  readonly state = this.examService.state$;
  activeTab = 'ALL_QUESTION'; // ALL_QUESTION, INSTRUCTION

  constructor() {}

  goTo(index: number) {
    this.examService.goToQuestion(index);
  }

  getStatusClass(status: QuestionStatus | undefined): string {
    if (!status) return 'not-visited';
    switch (status) {
      case 'ANSWERED': return 'answered';
      case 'NOT_ANSWERED': return 'not-answered';
      case 'MARKED_FOR_REVIEW': return 'marked';
      case 'ANSWERED_MARKED_FOR_REVIEW': return 'answered-marked';
      case 'NOT_VISITED': default: return 'not-visited';
    }
  }
}
