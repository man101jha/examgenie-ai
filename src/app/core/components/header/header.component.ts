import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, LogOut, User, LogIn } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <header class="main-header">
      <div class="header-content">
        <div class="brand" routerLink="/upload">
          <div class="logo-icon">EG</div>
          <div class="brand-text">
            <span class="name">ExamGenie</span>
            <span class="tag">AI Generator</span>
          </div>
        </div>

        <nav class="nav-actions">
          <ng-container *ngIf="authService.user$ | async as user; else guestMode">
            <div class="user-profile">
              <div class="avatar">
                 <lucide-icon [name]="User" size="18"></lucide-icon>
              </div>
              <div class="user-info">
                <span class="user-name">{{ user.displayName || 'User' }}</span>
                <span class="user-email">{{ user.email }}</span>
              </div>
            </div>
            <button class="btn-logout" (click)="logout()" title="Sign Out">
              <lucide-icon [name]="LogOut" size="18"></lucide-icon>
              <span>Logout</span>
            </button>
          </ng-container>

          <ng-template #guestMode>
            <button class="btn-login" routerLink="/login">
              <lucide-icon [name]="LogIn" size="18"></lucide-icon>
              <span>Sign In</span>
            </button>
          </ng-template>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .main-header {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(226, 232, 240, 0.8);
      padding: 0.75rem 1.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
      animation: slideDown 0.4s ease-out;
    }

    @keyframes slideDown {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      font-weight: 700;
      font-size: 1rem;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-text .name {
      font-weight: 800;
      color: #1e293b;
      font-size: 1.125rem;
      line-height: 1.2;
    }

    .brand-text .tag {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding-right: 1.5rem;
      border-right: 1px solid #e2e8f0;
    }

    .avatar {
      width: 32px;
      height: 32px;
      background: #f1f5f9;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
    }

    .user-email {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .btn-logout, .btn-login {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      color: #64748b;
      font-weight: 600;
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }

    .btn-logout:hover {
      background: #fef2f2;
      color: #ef4444;
    }

    .btn-login {
      background: #2563eb;
      color: white;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }

    .btn-login:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    @media (max-width: 640px) {
      .main-header { padding: 0.5rem 0.75rem; }
      .brand { gap: 0.5rem; }
      .logo-icon { width: 32px; height: 32px; font-size: 0.9rem; }
      .brand-text .name { font-size: 1rem; }
      .brand-text .tag { font-size: 0.65rem; }
      .user-info { display: none; }
      .user-profile { padding-right: 0; border-right: none; }
      .btn-logout span, .btn-login span { display: none; }
      .btn-logout, .btn-login { padding: 0.5rem; }
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);

  readonly LogOut = LogOut;
  readonly User = User;
  readonly LogIn = LogIn;

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/upload']);
  }
}
