import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';
import { PdfExtractorService } from '../../core/services/pdf-extractor.service';
import { LucideAngularModule, UploadCloud, FileText, CheckCircle2, Sparkles, BookOpen } from 'lucide-angular';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';

type Difficulty = 'easy' | 'medium' | 'hard';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  isExtracting = false;
  selectedFile: File | null = null;
  loadingStep = '';
  errorMessage = '';

  activeTab: 'pdf' | 'syllabus' = 'syllabus';

  // Dialog state
  showGenerateDialog = false;
  selectedDifficulty: Difficulty = 'medium';
  selectedCount = 10;
  isGenerating = false;

  readonly UploadCloud = UploadCloud;
  readonly FileText = FileText;
  readonly CheckCircle2 = CheckCircle2;
  readonly Sparkles = Sparkles;
  readonly BookOpen = BookOpen;

  readonly countOptions = [10, 15, 20, 25];
  readonly difficultyOptions: { value: Difficulty; label: string; desc: string }[] = [
    { value: 'easy',   label: 'Easy',   desc: 'Basic concepts, straightforward questions' },
    { value: 'medium', label: 'Medium', desc: 'Moderate difficulty, standard exam level' },
    { value: 'hard',   label: 'Hard',   desc: 'Advanced problems, challenging scenarios' },
  ];

  constructor(
    private pdfExtractor: PdfExtractorService,
    private examService: ExamService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.showGenerateDialog = false;
    }
  }

  startExtraction() {
    if (!this.selectedFile) return;

    this.isExtracting = true;
    this.errorMessage = '';
    this.loadingStep = 'Reading PDF with AI...';

    this.pdfExtractor.extractQuestionsFromPdf(this.selectedFile)
      .pipe(finalize(() => { if (!this.showGenerateDialog) this.isExtracting = false; }))
      .subscribe({
        next: ({ questions, title }) => {
          if (questions.length === 0) {
            this.isExtracting = false;
            this.showGenerateDialog = true;
          } else {
            this.loadingStep = 'Building exam...';
            this.examService.startExam(questions, title);
            this.router.navigate(['/exam']);
          }
        },
        error: (err: any) => {
          this.isExtracting = false;
          this.loadingStep = '';
          const errStr = typeof err === 'object' ? JSON.stringify(err) : String(err);
          const errMsg = err?.message || err?.error?.error?.message || '';
          
          if (
            errStr.includes('429') ||
            errStr.toLowerCase().includes('quota') ||
            errStr.includes('RESOURCE_EXHAUSTED') ||
            errMsg.includes('429') ||
            errMsg.toLowerCase().includes('quota')
          ) {
            this.errorMessage = 'Google API Free Tier rate limit reached. Please wait a minute and try again (Limit is usually 15 RPM).';
          } else {
            this.errorMessage = 'An error occurred while analyzing the document.';
          }
        }
      });
  }

  generateFromContent() {
    if (!this.selectedFile) return;

    this.showGenerateDialog = false;
    this.isGenerating = true;
    this.errorMessage = '';
    this.loadingStep = `Generating ${this.selectedCount} ${this.selectedDifficulty} questions from PDF...`;

    this.pdfExtractor
      .generateQuestionsFromContent(this.selectedFile, this.selectedDifficulty, this.selectedCount)
      .pipe(finalize(() => { this.isGenerating = false; this.loadingStep = ''; }))
      .subscribe({
        next: ({ questions, title }) => {
          this.examService.startExam(questions, title);
          this.router.navigate(['/exam']);
        },
        error: (err: any) => {
          this.loadingStep = '';
          const errStr = typeof err === 'object' ? JSON.stringify(err) : String(err);
          const errMsg = err?.message || err?.error?.error?.message || '';

          if (
            errStr.includes('429') ||
            errStr.toLowerCase().includes('quota') ||
            errStr.includes('RESOURCE_EXHAUSTED') ||
            errMsg.includes('429') ||
            errMsg.toLowerCase().includes('quota')
          ) {
             this.errorMessage = 'Google API Free Tier rate limit reached. Please wait a minute and try again (Limit is usually 15 RPM).';
          } else {
             this.errorMessage = 'An error occurred while generating the exam.';
          }
        }
      });
  }

  cancelGenerate() {
    this.showGenerateDialog = false;
    this.isExtracting = false;
    this.loadingStep = '';
  }

  setTab(tab: 'pdf' | 'syllabus') {
    this.activeTab = tab;
  }

  navigateToGenerate() {
    this.router.navigate(['/generate']);
  }
}
