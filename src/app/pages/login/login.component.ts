import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
      <div class="nes-container with-title is-centered is-dark">
        <p class="title">Pixel Login</p>
        
        <div style="margin-bottom: 2rem;">
          <img [src]="avatarUrl" alt="Avatar" class="nes-avatar is-rounded is-large" style="width: 120px; height: 120px; image-rendering: pixelated;">
        </div>

        <div class="nes-field" style="margin-bottom: 2rem; width: 300px;">
          <label for="name_field">Nickname</label>
          <input type="text" id="name_field" class="nes-input" [(ngModel)]="username" (input)="updateAvatar()" placeholder="輸入名字...">
        </div>

        <button type="button" class="nes-btn is-primary" (click)="start()" [disabled]="!username">
          START GAME
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  username = '';
  avatarUrl = 'https://api.dicebear.com/9.x/pixel-art/svg?seed=guest';

  constructor(private router: Router) { }

  updateAvatar() {
    const seed = this.username || 'guest';
    this.avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;
  }

  start() {
    if (this.username) {
      // Store in localStorage or Service state to pass to next page
      localStorage.setItem('currentUser', JSON.stringify({ name: this.username, avatar: this.avatarUrl }));
      this.router.navigate(['/questionnaire']);
    }
  }
}
