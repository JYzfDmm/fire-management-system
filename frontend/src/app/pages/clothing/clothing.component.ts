import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ClothingInfo } from '../../models';

@Component({
  selector: 'app-clothing',
  template: `
    <div class="page-container">
      <h2 class="page-title">👕 季节着装提示</h2>
      <div class="content-card" *ngIf="clothing">
        <div class="season-header">
          <div class="season-badge">{{ clothing.season }}</div>
          <div class="season-suggestion">{{ clothing.suggestion }}</div>
        </div>
        <div class="clothing-section">
          <div class="clothing-row">
            <span class="row-icon">🎖️</span>
            <div class="row-content">
              <h4>执勤着装</h4>
              <p>{{ clothing.uniform }}</p>
            </div>
          </div>
          <div class="clothing-row">
            <span class="row-icon">🏃</span>
            <div class="row-content">
              <h4>训练着装</h4>
              <p>{{ clothing.training }}</p>
            </div>
          </div>
          <div class="clothing-row caution-row">
            <span class="row-icon">⚠️</span>
            <div class="row-content">
              <h4>注意事项</h4>
              <p>{{ clothing.caution }}</p>
            </div>
          </div>
        </div>
        <div class="tips-section">
          <h4>💡 温馨提示</h4>
          <ul>
            <li *ngFor="let tip of clothing.tips">{{ tip }}</li>
          </ul>
        </div>
      </div>
      <div class="placeholder-tip">（此页面待后续完善）</div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .page-title { font-size: 22px; color: #333; margin-bottom: 20px; font-weight: 600; }
    .content-card {
      background: #fff;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      max-width: 700px;
    }
    .season-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }
    .season-badge {
      background: linear-gradient(135deg, #27ae60, #2ecc71);
      color: #fff;
      padding: 8px 24px;
      border-radius: 24px;
      font-size: 18px;
      font-weight: 600;
    }
    .season-suggestion {
      font-size: 16px;
      color: #27ae60;
      font-weight: 500;
    }
    .clothing-section { margin-bottom: 24px; }
    .clothing-row {
      display: flex;
      gap: 16px;
      padding: 16px;
      background: #fafafa;
      border-radius: 8px;
      margin-bottom: 12px;
    }
    .caution-row { background: #fef8f0; }
    .row-icon { font-size: 32px; }
    .row-content h4 {
      margin: 0 0 6px;
      color: #333;
      font-size: 15px;
    }
    .row-content p {
      margin: 0;
      color: #666;
      font-size: 14px;
      line-height: 1.6;
    }
    .tips-section {
      background: #f0faf5;
      padding: 20px;
      border-radius: 8px;
    }
    .tips-section h4 {
      margin: 0 0 12px;
      color: #27ae60;
    }
    .tips-section ul {
      margin: 0;
      padding-left: 20px;
    }
    .tips-section li {
      color: #555;
      font-size: 14px;
      line-height: 1.8;
    }
    .placeholder-tip {
      margin-top: 16px;
      color: #999;
      font-size: 13px;
    }
  `]
})
export class ClothingComponent implements OnInit {
  clothing: ClothingInfo | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getClothing().subscribe(data => this.clothing = data);
  }
}
