import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';
import { QuestionViewerComponent } from './components/question-viewer/question-viewer.component';
import { QuestionPaletteComponent } from './components/question-palette/question-palette.component';
import { LucideAngularModule, X } from 'lucide-angular';
import { SubmitDialogComponent } from './components/submit-dialog/submit-dialog.component';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, QuestionViewerComponent, QuestionPaletteComponent, LucideAngularModule, SubmitDialogComponent],
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnDestroy {
  public examService = inject(ExamService);
  private router = inject(Router);
  
  readonly state = this.examService.state$;
  readonly X = X;
  showSubmitDialog = false;

  constructor() {
    if (this.state().questions.length === 0) {
       this.router.navigate(['/upload']);
    }
  }

  exitExam() {
    this.router.navigate(['/upload']);
  }

  openSubmitDialog() {
    this.showSubmitDialog = true;
  }

  onSubmitConfirmed() {
    this.showSubmitDialog = false;
    this.router.navigate(['/pre-submit']);
  }

  onSubmitCancelled() {
    this.showSubmitDialog = false;
  }

  ngOnDestroy() {
    // any cleanup
  }
}
