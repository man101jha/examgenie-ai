import { Injectable, inject } from '@angular/core';
import { Database, ref, push, set, query, orderByChild, limitToLast, get, child } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { ExamState } from '../models/exam.model';
import { from, map, Observable, of, switchMap, firstValueFrom, filter, take } from 'rxjs';

export interface HistoryRecord {
  id?: string;
  attemptedAt: number;
  examTitle: string;
  score: number;
  totalMarks: number;
  correct: number;
  incorrect: number;
  skipped: number;
  timeSpent: number;
  state: ExamState;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private db = inject(Database);
  private authService = inject(AuthService);

  async saveAttempt(state: ExamState): Promise<void> {
    const user = await firstValueFrom(this.authService.user$.pipe(filter(u => !!u), take(1)));
    if (!user) return;

    const sessionId = state.sessionId || push(ref(this.db, `history/${user.uid}`)).key;
    const recordRef = ref(this.db, `history/${user.uid}/${sessionId}`);
    
    const record: HistoryRecord = {
      attemptedAt: Date.now(),
      examTitle: state.examTitle || 'Untitled Exam',
      score: state.score,
      totalMarks: state.totalMarksTaken,
      correct: state.correctAnswers,
      incorrect: state.incorrectAnswers,
      skipped: state.skippedAnswers,
      timeSpent: state.totalTimeSpent,
      state: state
    };

    await set(recordRef, this.sanitizeData(record));
    console.log('Attempt saved to history:', sessionId);
  }

  /**
   * Firebase does not allow 'undefined' values. 
   * This helper converts all undefined values to null or removes them.
   */
  private sanitizeData(data: any): any {
    return JSON.parse(JSON.stringify(data, (key, value) => 
      value === undefined ? null : value
    ));
  }

  getAttempts(): Observable<HistoryRecord[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) {
          console.log('History: No user found, returning empty');
          return of([]);
        }
        
        console.log('History: Fetching attempts for user:', user.uid);
        const historyRef = ref(this.db, `history/${user.uid}`);
        const historyQuery = query(
          historyRef,
          orderByChild('attemptedAt'),
          limitToLast(30)
        );

        return from(get(historyQuery)).pipe(
          map(snapshot => {
            const records: HistoryRecord[] = [];
            snapshot.forEach(childSnapshot => {
              records.push({
                id: childSnapshot.key as string,
                ...childSnapshot.val()
              });
            });
            // Reverse to show newest first
            return records.sort((a, b) => b.attemptedAt - a.attemptedAt);
          })
        );
      })
    );
  }

  async getAttemptById(id: string): Promise<HistoryRecord | null> {
    const user = this.authService.currentUser;
    if (!user) return null;

    const recordRef = ref(this.db, `history/${user.uid}/${id}`);
    const snapshot = await get(recordRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.key as string,
        ...snapshot.val()
      };
    }
    return null;
  }
}
