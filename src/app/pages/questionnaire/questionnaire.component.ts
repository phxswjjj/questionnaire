import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleSheetsService } from '../../services/google-sheets.service';
import { Question, AnswerPayload } from '../../models/types';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <header style="margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem;">
        <i class="nes-icon coin is-medium"></i>
        <h1>問卷挑戰</h1>
      </header>

      <!-- Loading State -->
      <div *ngIf="loading" class="nes-container is-rounded is-dark">
        <p>Loading API... <i class="nes-icon is-small heart"></i></p>
        <progress class="nes-progress is-primary" value="50" max="100"></progress>
      </div>

      <!-- User Info Header -->
      <div *ngIf="!loading && currentUser" class="nes-container is-dark with-title" style="margin-bottom: 2rem;">
        <p class="title">Player</p>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <img [src]="currentUser.avatar" style="width: 50px; height: 50px;" class="nes-avatar is-rounded">
          <span>{{ currentUser.name }}</span>
        </div>
      </div>

      <!-- Questions Form -->
      <div *ngIf="!loading && questions.length > 0">
        <div *ngFor="let q of questions; let i = index" class="nes-container with-title is-dark" style="margin-bottom: 2rem;">
          <p class="title">Quest {{ i + 1 }}</p>
          <div class="nes-field">
            <label>{{ q.title }}</label>
            
            <!-- Text Input -->
            <div *ngIf="q.type === 'text'">
              <input type="text" class="nes-input" [(ngModel)]="answers[q.id]" placeholder="請輸入回答...">
            </div>

            <!-- Radio Input -->
            <div *ngIf="q.type === 'radio' && q.options">
              <div *ngFor="let opt of q.options; let optIndex = index" style="margin-top: 0.5rem;">
                <label>
                  <input type="radio" class="nes-radio" [name]="'q_' + q.id" [value]="opt" [(ngModel)]="answers[q.id]">
                  <span>{{ opt }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <button type="button" class="nes-btn is-success" (click)="submit()" [disabled]="submitting">
          {{ submitting ? 'Saving...' : 'SUBMIT' }}
        </button>
      </div>

      <!-- No Questions / Error -->
      <div *ngIf="!loading && questions.length === 0" class="nes-block">
        <div class="nes-text is-error">No questions found or API error!</div>
        <br>
        <button class="nes-btn" (click)="loadQuestions()">Retry</button>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
  `]
})
export class QuestionnaireComponent implements OnInit {
  private sheetService = inject(GoogleSheetsService);
  private router = inject(Router);

  currentUser: any = null;
  questions: Question[] = [];
  answers: { [key: string]: string } = {};

  loading = true;
  submitting = false;

  ngOnInit() {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      this.router.navigate(['/login']);
      return;
    }
    this.currentUser = JSON.parse(userStr);
    this.loadQuestions();
  }

  loadQuestions() {
    this.loading = true;
    this.sheetService.getQuestions().subscribe({
      next: (data) => {
        this.questions = data;
        this.loading = false;
        // Init answers model
        this.questions.forEach(q => this.answers[q.id] = '');
      },
      error: (err) => {
        console.error('API Error:', err);
        // Fallback or show msg
        this.loading = false;
      }
    });
  }

  submit() {
    if (this.submitting) return;

    // Validate if needed
    // const allAnswered = this.questions.every(q => !!this.answers[q.id]);
    // if (!allAnswered) { alert('請完成所有題目！'); return; }

    this.submitting = true;

    // Map answer object to array
    const answerList = Object.keys(this.answers).map(key => ({
      questionId: key,
      answer: this.answers[key]
    }));

    const payload: AnswerPayload = {
      account: this.currentUser.name,
      avatar: this.currentUser.avatar,
      answers: answerList
    };

    this.sheetService.submitAnswers(payload).subscribe({
      next: (res) => {
        console.log('Submitted', res);
        this.router.navigate(['/completed']);
      },
      error: (err) => {
        console.error('Submit Error', err);
        // Even if error (like weird parsing), sometimes it succeeds in GAS. 
        // But let's assume success if it's a JSON parse error (common in direct text POST).
        // Actually we handle text/plain so hopefully it returns JSON string correctly.
        // If "Http failure during parsing for ...", it implies it wasn't valid JSON.
        // We'll redirect anyway for demo purposes if it seems largely okay, 
        // or show alert.
        alert('提交發生錯誤，請稍後再試: ' + (err.message || err));
        this.submitting = false;
      }
    });
  }
}
