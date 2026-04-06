import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HistoryService, HistoryRecord } from '../../core/services/history.service';
import { ExamService } from '../../core/services/exam.service';
import { LucideAngularModule, Calendar, Award, Clock, ArrowRight, FileText, ChevronRight, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  private historyService = inject(HistoryService);
  private examService = inject(ExamService);
  private router = inject(Router);

  attempts = signal<HistoryRecord[]>([]);
  isLoading = signal<boolean>(true);

  readonly Calendar = Calendar;
  readonly Award = Award;
  readonly Clock = Clock;
  readonly ArrowRight = ArrowRight;
  readonly ArrowLeft = ArrowLeft;
  readonly FileText = FileText;
  readonly ChevronRight = ChevronRight;

  ngOnInit() {
    this.historyService.getAttempts().subscribe({
      next: (data) => {
        this.attempts.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching history:', err);
        this.isLoading.set(false);
      }
    });
  }

  viewAttempt(record: HistoryRecord) {
    if (!record.state) return;
    
    this.examService.loadHistoricalState(record.state);
    this.router.navigate(['/solution']);
  }

  goBack() {
    this.router.navigate(['/upload']);
  }

  startNewTest() {
    this.router.navigate(['/upload']);
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }
}
