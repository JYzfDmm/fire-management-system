import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MeetingSummary } from '../../models';

@Component({
  selector: 'app-meeting',
  template: `
    <div class="page-container">
      <h2 class="page-title">📋 每周二会议总结要点</h2>
      <div class="content-card" *ngIf="meeting">
        <div class="meeting-header">
          <h3>{{ meeting.title }}</h3>
          <div class="meeting-meta">
            <span>📅 {{ meeting.date }}</span>
            <span>🎤 主持：{{ meeting.host }}</span>
            <span>👥 参会：{{ meeting.participants }}</span>
          </div>
        </div>
        <div class="meeting-points">
          <div class="point-card" *ngFor="let p of meeting.points; let i = index">
            <div class="point-number">{{ i + 1 }}</div>
            <div class="point-content">
              <h4>{{ p.title }}</h4>
              <p>{{ p.content }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="placeholder-tip">（此页面待后续完善，可增加会议记录管理功能）</div>
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
      max-width: 800px;
    }
    .meeting-header {
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .meeting-header h3 {
      margin: 0 0 12px;
      color: #e67e22;
      font-size: 20px;
    }
    .meeting-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      color: #888;
      font-size: 14px;
    }
    .meeting-points { display: flex; flex-direction: column; gap: 16px; }
    .point-card {
      display: flex;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(to right, #fff8f0, #fff);
      border-left: 4px solid #e67e22;
      border-radius: 8px;
    }
    .point-number {
      width: 36px;
      height: 36px;
      background: #e67e22;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      flex-shrink: 0;
    }
    .point-content h4 {
      margin: 0 0 8px;
      color: #333;
      font-size: 16px;
    }
    .point-content p {
      margin: 0;
      color: #555;
      line-height: 1.8;
      font-size: 14px;
    }
    .placeholder-tip {
      margin-top: 16px;
      color: #999;
      font-size: 13px;
    }
  `]
})
export class MeetingComponent implements OnInit {
  meeting: MeetingSummary | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getMeetingSummary().subscribe(data => this.meeting = data);
  }
}
