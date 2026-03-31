import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../../../core/services/exam.service';
import { LucideAngularModule, Flag, Star, Trash2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-question-viewer',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './question-viewer.component.html',
  styleUrls: ['./question-viewer.component.css']
})
export class QuestionViewerComponent {
  public examService = inject(ExamService);
  
  readonly state = this.examService.state$;
  readonly Flag = Flag;
  readonly Star = Star;
  readonly Trash2 = Trash2;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly ArrowRight = ArrowRight;

  constructor() {}

  get currentQuestion() {
    return this.examService.getCurrentQuestion();
  }

  get selectedOption() {
    return this.state().userAnswers[this.currentQuestion?.id || ''];
  }

  get isMarkedForReview() {
    const status = this.state().questionStatuses[this.currentQuestion?.id || ''];
    return status === 'MARKED_FOR_REVIEW' || status === 'ANSWERED_MARKED_FOR_REVIEW';
  }

  selectOption(optionId: string) {
    if (this.currentQuestion) {
      this.examService.answerQuestion(this.currentQuestion.id, optionId);
    }
  }

  clearResponse() {
    if (this.currentQuestion) {
      this.examService.clearAnswer(this.currentQuestion.id);
    }
  }

  onTextInput(value: string) {
    if (this.currentQuestion) {
      if (value.trim()) {
        this.examService.answerQuestion(this.currentQuestion.id, value.trim());
      } else {
        this.examService.clearAnswer(this.currentQuestion.id);
      }
    }
  }

  toggleMarkForReview() {
    if (this.currentQuestion) {
      this.examService.toggleMarkForReview(this.currentQuestion.id);
    }
  }

  prev() {
    this.examService.prevQuestion();
  }

  next() {
    this.examService.nextQuestion();
  }
}
