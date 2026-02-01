import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-completed',
  standalone: true,
  template: `
    <div class="container" style="text-align: center; margin-top: 10vh;">
      <i class="nes-icon trophy is-large"></i>
      <h1 class="title" style="margin: 2rem 0;">Mission Complete!</h1>
      <p>感謝您的參與！您的回應已記錄。</p>
      
      <div style="margin-top: 3rem;">
        <button class="nes-btn is-primary" (click)="goHome()">回首頁</button>
      </div>
      
      <footer style="margin-top: 5rem; color: #666;">
        <p>Pixel Art Questionnaire System</p>
      </footer>
    </div>
  `
})
export class CompletedComponent {
  private router = inject(Router);

  goHome() {
    localStorage.removeItem('currentUser'); // Optional: clear session
    this.router.navigate(['/']);
  }
}
