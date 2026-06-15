import { Component } from '@angular/core';

@Component({
  selector: 'app-personnel',
  template: `
    <div class="page-container">
      <h2 class="page-title"><span class="title-icon">👥</span> 队内人员信息</h2>
      <div class="content-card">
        <div class="placeholder-content">
          <div class="placeholder-icon">👨‍🚒</div>
          <h3>队内人员信息 - 建设中</h3>
          <p>此模块功能正在开发中，后续将完善详细内容。</p>
          <div class="feature-preview">
            <h4>预计包含功能：</h4>
            <ul>
              <li>人员花名册</li>
              <li>个人信息档案</li>
              <li>职级岗位信息</li>
              <li>联系方式查询</li>
              <li>人员统计分析</li>
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
export class PersonnelComponent {}
