import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';
import { PdfExtractorService } from '../../core/services/pdf-extractor.service';
import { EXAM_SYLLABUS_DATA, EXAM_CATEGORIES, ExamSyllabus } from '../../core/constants/syllabus-data';
import { LucideAngularModule, Sparkles, ChevronDown, ChevronUp, CheckSquare, Square, BookOpen, Target, Settings2, ArrowLeft, ArrowRight, Zap } from 'lucide-angular';
import { finalize } from 'rxjs';

type Difficulty = 'easy' | 'medium' | 'hard';
type Step = 1 | 2 | 3;

interface SelectedSubject {
  subject: string;
  selectedTopics: Set<string>;
  expanded: boolean;
}

@Component({
  selector: 'app-generate',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent {
  // Icons
  readonly Sparkles = Sparkles;
  readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;
  readonly CheckSquare = CheckSquare;
  readonly Square = Square;
  readonly BookOpen = BookOpen;
  readonly Target = Target;
  readonly Settings2 = Settings2;
  readonly ArrowLeft = ArrowLeft;
  readonly ArrowRight = ArrowRight;
  readonly Zap = Zap;

  // Data
  readonly categories = EXAM_CATEGORIES;
  readonly examData = EXAM_SYLLABUS_DATA;

  // Step management
  currentStep: Step = 1;

  // Step 1: Exam selection
  selectedExam: ExamSyllabus | null = null;

  // Step 2: Subject & Topic selection
  subjectSelections: SelectedSubject[] = [];

  // Step 3: Settings
  selectedDifficulty: Difficulty = 'medium';
  selectedCount = 10;
  customPrompt = '';

  readonly difficultyOptions: { value: Difficulty; label: string; emoji: string; desc: string }[] = [
    { value: 'easy',   label: 'Easy',   emoji: '😊', desc: 'Basic concepts, straightforward questions' },
    { value: 'medium', label: 'Medium', emoji: '🧠', desc: 'Standard exam level difficulty' },
    { value: 'hard',   label: 'Hard',   emoji: '🔥', desc: 'Advanced, analytical & challenging' },
  ];
  readonly countOptions = [5, 10, 15, 20, 25, 30];

  // Generation state
  isGenerating = false;
  isFetchingSyllabus = false;
  errorMessage = '';
  loadingStep = '';

  // Other Exam
  isOtherExamSelected = false;
  customExamName = '';

  constructor(
    private pdfExtractor: PdfExtractorService,
    private examService: ExamService,
    private router: Router
  ) {}

  // ─── Step 1 ───────────────────────────────────────────────────────────────────

  getExamsByCategory(category: string): ExamSyllabus[] {
    return this.examData.filter(e => e.category === category);
  }

  selectExam(exam: ExamSyllabus | 'other') {
    if (exam === 'other') {
      this.isOtherExamSelected = true;
      this.selectedExam = null;
      this.subjectSelections = [];
    } else {
      this.isOtherExamSelected = false;
      this.selectedExam = exam;
      // Initialize subject selections
      this.subjectSelections = exam.syllabus.map(s => ({
        subject: s.subject,
        selectedTopics: new Set<string>(),
        expanded: true
      }));
    }
  }

  fetchCustomSyllabus() {
    if (!this.customExamName.trim()) return;

    this.isFetchingSyllabus = true;
    this.errorMessage = '';
    this.loadingStep = `Analyzing ${this.customExamName} syllabus with AI...`;

    this.pdfExtractor.fetchSyllabusForExam(this.customExamName)
      .pipe(finalize(() => {
        this.isFetchingSyllabus = false;
        this.loadingStep = '';
      }))
      .subscribe({
        next: (res) => {
          const mockExam: ExamSyllabus = {
            exam: this.customExamName,
            category: 'Custom',
            syllabus: res.subjects
          };
          this.selectedExam = mockExam;
          this.subjectSelections = res.subjects.map(s => ({
            subject: s.subject,
            selectedTopics: new Set<string>(),
            expanded: true
          }));
          this.goToStep(2);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to fetch syllabus. Please try a more common exam name.';
        }
      });
  }

  // ─── Step 2 ───────────────────────────────────────────────────────────────────

  getTopicsForSubject(subject: string): string[] {
    return this.selectedExam?.syllabus.find(s => s.subject === subject)?.topicList ?? [];
  }

  toggleTopic(subjectSel: SelectedSubject, topic: string) {
    if (subjectSel.selectedTopics.has(topic)) {
      subjectSel.selectedTopics.delete(topic);
    } else {
      subjectSel.selectedTopics.add(topic);
    }
  }

  isTopicSelected(subjectSel: SelectedSubject, topic: string): boolean {
    return subjectSel.selectedTopics.has(topic);
  }

  toggleAllTopics(subjectSel: SelectedSubject) {
    const topics = this.getTopicsForSubject(subjectSel.subject);
    if (subjectSel.selectedTopics.size === topics.length) {
      subjectSel.selectedTopics.clear();
    } else {
      topics.forEach(t => subjectSel.selectedTopics.add(t));
    }
  }

  isAllSelected(subjectSel: SelectedSubject): boolean {
    const topics = this.getTopicsForSubject(subjectSel.subject);
    return topics.length > 0 && subjectSel.selectedTopics.size === topics.length;
  }

  isPartialSelected(subjectSel: SelectedSubject): boolean {
    return subjectSel.selectedTopics.size > 0 && !this.isAllSelected(subjectSel);
  }

  get totalSelectedTopics(): number {
    return this.subjectSelections.reduce((sum, s) => sum + s.selectedTopics.size, 0);
  }

  get selectedSubjectCount(): number {
    return this.subjectSelections.filter(s => s.selectedTopics.size > 0).length;
  }

  get canProceedStep2(): boolean {
    return this.totalSelectedTopics > 0;
  }

  // ─── Navigation ───────────────────────────────────────────────────────────────

  goToStep(step: Step) {
    if (step === 2 && !this.selectedExam) return;
    if (step === 3 && !this.canProceedStep2) return;
    this.currentStep = step;
  }

  goBack() {
    if (this.currentStep > 1) {
      this.currentStep = (this.currentStep - 1) as Step;
    } else {
      this.router.navigate(['/upload']);
    }
  }

  // ─── Generation ───────────────────────────────────────────────────────────────

  generate() {
    if (!this.selectedExam || !this.canProceedStep2) return;

    const selectedTopicsPayload = this.subjectSelections
      .filter(s => s.selectedTopics.size > 0)
      .map(s => ({ subject: s.subject, topics: Array.from(s.selectedTopics) }));

    this.isGenerating = true;
    this.errorMessage = '';
    this.loadingStep = `Generating ${this.selectedCount} ${this.selectedDifficulty} MCQs for ${this.selectedExam.exam}...`;

    this.pdfExtractor.generateFromSyllabus(
      this.selectedExam.exam,
      selectedTopicsPayload,
      this.selectedDifficulty,
      this.selectedCount,
      this.customPrompt || undefined
    )
    .pipe(finalize(() => { this.isGenerating = false; this.loadingStep = ''; }))
    .subscribe({
      next: ({ questions, title }) => {
        this.examService.startExam(questions, title);
        this.router.navigate(['/exam']);
      },
      error: (err: any) => {
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
          this.errorMessage = 'An error occurred while generating the exam. Please try again.';
        }
      }
    });
  }
}
