import { Injectable, signal } from '@angular/core';
import { ExamState, Question, QuestionStatus } from '../models/exam.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private state = signal<ExamState>({
    questions: [],
    examTitle: '',
    userAnswers: {},
    questionStatuses: {},
    currentQuestionIndex: 0,
    isSubmitted: false,
    score: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    skippedAnswers: 0,
    totalMarksTaken: 0,
    timeSpentPerQuestion: {},
    totalTimeSpent: 0
  });

  readonly state$ = this.state.asReadonly();
  
  private timerInterval: any;

  constructor() { }

  startExam(questions: Question[], examTitle: string = 'Exam') {
    const statuses: { [key: string]: QuestionStatus } = {};
    questions.forEach((q, index) => {
      statuses[q.id] = index === 0 ? 'NOT_ANSWERED' : 'NOT_VISITED';
    });

    this.state.set({
      questions,
      examTitle,
      userAnswers: {},
      questionStatuses: statuses,
      currentQuestionIndex: 0,
      isSubmitted: false,
      score: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      skippedAnswers: 0,
      totalMarksTaken: Object.values(questions).reduce((sum, q) => sum + q.marks, 0),
      timeSpentPerQuestion: questions.reduce((acc, q) => ({ ...acc, [q.id]: 0 }), {}),
      totalTimeSpent: 0,
      sessionId: Date.now().toString() + Math.random().toString(36).substring(2, 11)
    });

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.state.update(s => {
        if (s.isSubmitted || s.questions.length === 0) return s;
        const currentQ = s.questions[s.currentQuestionIndex];
        return {
          ...s,
          totalTimeSpent: s.totalTimeSpent + 1,
          timeSpentPerQuestion: {
            ...s.timeSpentPerQuestion,
            [currentQ.id]: (s.timeSpentPerQuestion[currentQ.id] || 0) + 1
          }
        };
      });
    }, 1000);
  }

  updateQuestionExplanations(explanations: { [questionId: string]: string }) {
    this.state.update(s => ({
      ...s,
      questions: s.questions.map(q => ({
        ...q,
        explanation: explanations[q.id] ?? q.explanation
      }))
    }));
  }

  getCurrentQuestion(): Question | undefined {
    const s = this.state();
    return s.questions[s.currentQuestionIndex];
  }

  goToQuestion(index: number) {
    this.state.update(s => {
      if (index < 0 || index >= s.questions.length) return s;
      
      const newIndex = index;
      const targetQuestion = s.questions[newIndex];
      const currentStatus = s.questionStatuses[targetQuestion.id];
      
      const nextStatuses = { ...s.questionStatuses };
      if (currentStatus === 'NOT_VISITED') {
        nextStatuses[targetQuestion.id] = 'NOT_ANSWERED';
      }

      return {
        ...s,
        currentQuestionIndex: newIndex,
        questionStatuses: nextStatuses
      };
    });
  }

  nextQuestion() {
    this.goToQuestion(this.state().currentQuestionIndex + 1);
  }

  prevQuestion() {
    this.goToQuestion(this.state().currentQuestionIndex - 1);
  }

  answerQuestion(questionId: string, optionId: string) {
    this.state.update(s => {
      const answers = { ...s.userAnswers, [questionId]: optionId };
      const currentStatus = s.questionStatuses[questionId];
      
      const statuses = { ...s.questionStatuses };
      if (currentStatus === 'MARKED_FOR_REVIEW') {
         statuses[questionId] = 'ANSWERED_MARKED_FOR_REVIEW';
      } else {
         statuses[questionId] = 'ANSWERED';
      }

      return {
        ...s,
        userAnswers: answers,
        questionStatuses: statuses
      };
    });
  }

  clearAnswer(questionId: string) {
    this.state.update(s => {
      const answers = { ...s.userAnswers };
      delete answers[questionId];
      
      const statuses = { ...s.questionStatuses };
      if (statuses[questionId] === 'ANSWERED_MARKED_FOR_REVIEW') {
        statuses[questionId] = 'MARKED_FOR_REVIEW';
      } else {
        statuses[questionId] = 'NOT_ANSWERED';
      }

      return {
        ...s,
        userAnswers: answers,
        questionStatuses: statuses
      };
    });
  }

  toggleMarkForReview(questionId: string) {
    this.state.update(s => {
      const statuses = { ...s.questionStatuses };
      const current = statuses[questionId];
      
      if (current === 'ANSWERED') {
        statuses[questionId] = 'ANSWERED_MARKED_FOR_REVIEW';
      } else if (current === 'ANSWERED_MARKED_FOR_REVIEW') {
        statuses[questionId] = 'ANSWERED';
      } else if (current === 'NOT_ANSWERED' || current === 'NOT_VISITED') {
        statuses[questionId] = 'MARKED_FOR_REVIEW';
      } else if (current === 'MARKED_FOR_REVIEW') {
        statuses[questionId] = 'NOT_ANSWERED';
      }

      return {
        ...s,
        questionStatuses: statuses
      };
    });
  }

  submitExam() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.state.update(s => {
      let correct = 0;
      let incorrect = 0;
      let skipped = 0;
      let score = 0;

      s.questions.forEach(q => {
        const answer = s.userAnswers[q.id];
        if (!answer) {
          skipped++;
        } else if (answer === q.correctOptionId) {
          correct++;
          score += q.marks;
        } else {
          incorrect++;
          score -= q.negativeMarks;
        }
      });

      return {
        ...s,
        isSubmitted: true,
        correctAnswers: correct,
        incorrectAnswers: incorrect,
        skippedAnswers: skipped,
        score
      };
    });
  }

  loadHistoricalState(state: ExamState) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.state.set(state);
  }
}
