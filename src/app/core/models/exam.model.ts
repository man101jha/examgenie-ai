export type QuestionStatus = 'NOT_VISITED' | 'NOT_ANSWERED' | 'ANSWERED' | 'MARKED_FOR_REVIEW' | 'ANSWERED_MARKED_FOR_REVIEW';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  questionNumber: number;
  text: string;
  options: Option[];
  correctOptionId: string;
  marks: number;
  negativeMarks: number;
  explanation?: string;
}

export interface ExamState {
  questions: Question[];
  examTitle: string;
  userAnswers: { [questionId: string]: string | undefined };
  questionStatuses: { [questionId: string]: QuestionStatus };
  currentQuestionIndex: number;
  isSubmitted: boolean;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers: number;
  totalMarksTaken: number;
}
