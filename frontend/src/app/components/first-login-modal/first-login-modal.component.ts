import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ResetPasswordRequest } from '../../models';

@Component({
  selector: 'app-first-login-modal',
  template: `
    <div *ngIf="visible" class="modal-overlay">
      <div class="modal-content modal-small">
        <div class="modal-header">
          <h3>🔐 首次登录修改密码</h3>
        </div>
        <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
          <div class="modal-body">
            <div class="welcome-box">
              <p>欢迎使用消防管理系统！为了您的账号安全，请先修改初始密码。</p>
            </div>
            <div class="form-group">
              <label>新密码 <span class="required">*</span></label>
              <input type="password" formControlName="newPassword" class="form-input" [class.invalid]="isFieldInvalid('newPassword')">
              <div *ngIf="isFieldInvalid('newPassword')" class="error-text">{{ getFieldError('newPassword') }}</div>
            </div>
            <div class="form-group">
              <label>确认密码 <span class="required">*</span></label>
              <input type="password" formControlName="confirmPassword" class="form-input" [class.invalid]="isFieldInvalid('confirmPassword')">
              <div *ngIf="isFieldInvalid('confirmPassword')" class="error-text">{{ getFieldError('confirmPassword') }}</div>
            </div>
            <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" [disabled]="passwordForm.invalid || loading">
              {{ loading ? '修改中...' : '确认修改' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    }
    .modal-content {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
    }
    .modal-small {
      width: 90%;
      max-width: 480px;
    }
    .modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid #f0f0f0;
      background: linear-gradient(135deg, #e74c3c, #c0392b);
    }
    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      color: #fff;
    }
    .modal-body {
      padding: 24px;
    }
    .welcome-box {
      background: #fff3e0;
      border-left: 4px solid #e65100;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .welcome-box p {
      margin: 0;
      color: #e65100;
      font-size: 14px;
      line-height: 1.6;
    }
    .form-group {
      margin-bottom: 16px;
    }
    .form-group label {
      display: block;
      font-size: 13px;
      color: #555;
      font-weight: 500;
      margin-bottom: 6px;
    }
    .form-group .required {
      color: #e74c3c;
    }
    .form-input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      transition: all 0.2s;
      box-sizing: border-box;
    }
    .form-input:focus {
      border-color: #e74c3c;
      box-shadow: 0 0 0 3px rgba(231,76,60,0.1);
    }
    .form-input.invalid {
      border-color: #e74c3c;
    }
    .error-text {
      color: #e74c3c;
      font-size: 12px;
      margin-top: 4px;
    }
    .error-message {
      background: #fdecea;
      color: #c0392b;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 14px;
    }
    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid #f0f0f0;
    }
    .btn {
      padding: 10px 24px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-primary {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      color: #fff;
      font-weight: 600;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(231,76,60,0.4);
    }
  `]
})
export class FirstLoginModalComponent {
  @Output() passwordChanged = new EventEmitter<void>();

  visible: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  passwordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  show(): void {
    this.visible = true;
    this.errorMessage = '';
    this.passwordForm.reset();
  }

  hide(): void {
    this.visible = false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.passwordForm.get(fieldName);
    const formErrors = this.passwordForm.errors;

    if (fieldName === 'confirmPassword' && formErrors?.['passwordMismatch']) {
      return true;
    }

    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(fieldName: string): string {
    const control = this.passwordForm.get(fieldName);
    const formErrors = this.passwordForm.errors;

    if (fieldName === 'confirmPassword' && formErrors?.['passwordMismatch']) {
      return '两次输入的密码不一致';
    }

    if (!control || !control.errors) return '';

    if (control.errors['required']) return '此字段为必填项';
    if (control.errors['minlength']) return `密码最少需要 ${control.errors['minlength'].requiredLength} 个字符`;
    return '输入格式不正确';
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.passwordForm.value;
    const request: ResetPasswordRequest = {
      newPassword: formValue.newPassword,
      confirmPassword: formValue.confirmPassword
    };

    this.apiService.resetPasswordByUser(request).subscribe({
      next: () => {
        const user = this.authService.getUser();
        if (user) {
          user.firstLogin = false;
          this.authService.setUser(user);
        }
        this.passwordChanged.emit();
        this.hide();
      },
      error: (err) => {
        this.errorMessage = err.message || '密码修改失败，请重试';
      }
    }).add(() => {
      this.loading = false;
    });
  }
}
