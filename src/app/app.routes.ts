import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { QuestionnaireComponent } from './pages/questionnaire/questionnaire.component';
import { CompletedComponent } from './pages/completed/completed.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, title: '登入 - Pixel Questionnaire' },
    { path: 'questionnaire', component: QuestionnaireComponent, title: '問卷 - Pixel Questionnaire' },
    { path: 'completed', component: CompletedComponent, title: '完成 - Pixel Questionnaire' }
];
