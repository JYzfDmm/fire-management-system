import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  template: `
    <div class="page-container">
      <h2 class="page-title"><span class="title-icon">🔐</span> 用户管理</h2>
      <div class="content-card">
        <div class="placeholder-content">
          <div class="placeholder-icon">⚙️</div>
          <h3>用户管理与权限配置 - 建设中</h3>
          <p>此模块功能正在开发中，后续将完善详细内容。</p>
          <div class="feature-preview">
            <h4>预计包含功能：</h4>
            <ul>
              <li>用户账号管理</li>
              <li>角色权限配置</li>
              <li>用户状态管理</li>
              <li>操作日志记录</li>
              <li>密码重置</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .page-title {
      font-size: 22px;
      color: #333;
      margin-bottom: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .title-icon { font-size: 26px; }
    .content-card {
      background: #fff;
      border-radius: 12px;
      padding: 48px 32px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      max-width: 700px;
    }
    .placeholder-content { text-align: center; }
    .placeholder-icon { font-size: 80px; margin-bottom: 20px; }
    .placeholder-content h3 { color: #c0392b; margin-bottom: 12px; font-size: 22px; }
    .placeholder-content > p { color: #888; font-size: 15px; margin-bottom: 28px; }
    .feature-preview { background: #fafafa; padding: 24px; border-radius: 8px; text-align: left; }
    .feature-preview h4 { margin: 0 0 14px; color: #333; font-size: 15px; }
    .feature-preview ul { margin: 0; padding-left: 24px; }
    .feature-preview li { color: #666; line-height: 2; font-size: 14px; }
  `]
})
export class UsersComponent {}
