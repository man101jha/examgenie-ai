import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';
import { PdfExtractorService } from '../../core/services/pdf-extractor.service';
import { Question } from '../../core/models/exam.model';
import { LucideAngularModule, ArrowLeft, ChevronDown, ChevronUp, Loader, Lightbulb } from 'lucide-angular';

@Component({
  selector: 'app-solution',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.css']
})
export class SolutionComponent {
  private examService = inject(ExamService);
  private pdfExtractor = inject(PdfExtractorService);
  private router = inject(Router);

  readonly state = this.examService.state$;
  readonly ArrowLeft = ArrowLeft;
  readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;
  readonly Loader = Loader;
  readonly Lightbulb = Lightbulb;

  expandedQuestions: Set<number> = new Set();
  loadingExplanations: Set<string> = new Set();

  constructor() {
    if (this.state().questions.length === 0) {
      this.router.navigate(['/upload']);
    }
  }

  getUserAnswer(q: Question): string {
    return this.state().userAnswers[q.id] || '';
  }

  getOptionClass(q: Question, optionId: string): string {
    const userAnswer = this.getUserAnswer(q);
    const correct = q.correctOptionId;
    if (optionId === correct) return 'correct';
    if (optionId === userAnswer && userAnswer !== correct) return 'wrong';
    return '';
  }

  toggleExpand(index: number) {
    if (this.expandedQuestions.has(index)) {
      this.expandedQuestions.delete(index);
    } else {
      this.expandedQuestions.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedQuestions.has(index);
  }

  getResult(q: Question): 'correct' | 'wrong' | 'skipped' {
    const ans = this.getUserAnswer(q);
    if (!ans) return 'skipped';
    return ans === q.correctOptionId ? 'correct' : 'wrong';
  }

  isLoadingExplanation(q: Question): boolean {
    return this.loadingExplanations.has(q.id);
  }

  fetchExplanation(q: Question) {
    if (q.explanation || this.loadingExplanations.has(q.id)) return;

    this.loadingExplanations.add(q.id);
    this.pdfExtractor.generateExplanations([q]).subscribe({
      next: (explanations) => {
        this.examService.updateQuestionExplanations(explanations);
        this.loadingExplanations.delete(q.id);
      },
      error: () => {
        this.loadingExplanations.delete(q.id);
      }
    });
  }

  goBack() {
    this.router.navigate(['/result']);
  }
}
