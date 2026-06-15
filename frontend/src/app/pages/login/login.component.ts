import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <div class="logo">🚒</div>
          <h1>消防队综合管理系统</h1>
          <p>Fire Department Management System</p>
        </div>
        
        <form class="login-form" (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label>账号</label>
            <input 
              type="text" 
              [(ngModel)]="username" 
              name="username" 
              required
              placeholder="请输入账号"
              autocomplete="off">
          </div>
          
          <div class="form-group">
            <label>密码</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password" 
              required
              placeholder="请输入密码">
          </div>
          
          <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
          
          <button type="submit" class="login-btn" [disabled]="loading">
            {{ loading ? '登录中...' : '登 录' }}
          </button>
        </form>
        
        <div class="login-tips">
          <p><strong>测试账号：</strong></p>
          <div class="account-grid">
            <div><span>普通队员:</span> PT001 / pt</div>
            <div><span>中队长:</span> ZD001 / zdz</div>
            <div><span>大队长:</span> DD001 / ddz</div>
            <div><span>后勤:</span> HQ001 / hq</div>
            <div><span>食堂管理员:</span> ST001 / st</div>
            <div><span>系统管理员:</span> SYS001 / sys</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 50%, #922b21 100%);
      padding: 20px;
    }
    .login-box {
      background: #fff;
      border-radius: 16px;
      padding: 48px 40px;
      width: 100%;
      max-width: 460px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .login-header {
      text-align: center;
      margin-bottom: 36px;
    }
    .logo {
      font-size: 56px;
      margin-bottom: 12px;
    }
    .login-header h1 {
      font-size: 24px;
      color: #c0392b;
      margin-bottom: 6px;
      font-weight: 700;
    }
    .login-header p {
      color: #999;
      font-size: 13px;
    }
    .login-form {
      margin-bottom: 28px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-size: 14px;
      font-weight: 500;
    }
    .form-group input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e8e8e8;
      border-radius: 8px;
      font-size: 15px;
      transition: all 0.3s;
      outline: none;
    }
    .form-group input:focus {
      border-color: #e74c3c;
      box-shadow: 0 0 0 3px rgba(231,76,60,0.1);
    }
    .error-message {
      background: #fdecea;
      color: #c0392b;
      padding: 10px 14px;
      border-radius: 6px;
      margin-bottom: 16px;
      font-size: 14px;
    }
    .login-btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 4px;
      transition: all 0.3s;
    }
    .login-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(231,76,60,0.4);
    }
    .login-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .login-tips {
      background: #fafafa;
      border-radius: 8px;
      padding: 16px;
      border: 1px solid #eee;
    }
    .login-tips > p {
      color: #666;
      font-size: 13px;
      margin-bottom: 10px;
    }
    .account-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }
    .account-grid > div {
      font-size: 12px;
      color: #555;
    }
    .account-grid span {
      color: #999;
    }
  `]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = '请输入账号和密码';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.apiService.login(this.username.trim(), this.password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMessage = '账号或密码错误';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
