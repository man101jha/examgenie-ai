import { Routes } from '@angular/router';
import { UploadComponent } from './features/upload/upload.component';
import { ExamComponent } from './features/exam/exam.component';
import { PreSubmitComponent } from './features/pre-submit/pre-submit.component';
import { ResultComponent } from './features/result/result.component';
import { SolutionComponent } from './features/solution/solution.component';

export const routes: Routes = [
  { path: '', redirectTo: '/upload', pathMatch: 'full' },
  { path: 'upload', component: UploadComponent },
  { path: 'exam', component: ExamComponent },
  { path: 'pre-submit', component: PreSubmitComponent },
  { path: 'result', component: ResultComponent },
  { path: 'solution', component: SolutionComponent }
];

