import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { WeatherInfo, ClothingInfo, MeetingSummary, User } from '../../models';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <h2 class="page-title">欢迎回来，{{ currentUser?.realName }}（{{ currentUser?.roleDescription }}）</h2>
      
      <div class="dashboard-grid">
        <div class="dashboard-card weather-card" (click)="goTo('weather')">
          <div class="card-header">
            <span class="card-icon">🌤️</span>
            <h3>天气与日期</h3>
          </div>
          <div class="weather-body" *ngIf="weather">
            <div class="weather-main">
              <span class="temp-icon">{{ weather.icon }}</span>
              <div class="temp-info">
                <span class="temp-value">{{ weather.temperature }}°C</span>
                <span class="temp-condition">{{ weather.condition }}</span>
              </div>
            </div>
            <div class="weather-detail">
              <p><strong>{{ weather.date }}</strong> {{ weather.weekday }}</p>
              <p>{{ weather.temperatureRange }} | {{ weather.season }}</p>
              <p>💧 {{ weather.humidity }} | 🌬️ {{ weather.wind }}</p>
            </div>
          </div>
        </div>

        <div class="dashboard-card clothing-card" (click)="goTo('clothing')">
          <div class="card-header">
            <span class="card-icon">👕</span>
            <h3>季节着装提示</h3>
          </div>
          <div class="clothing-body" *ngIf="clothing">
            <div class="season-tag">{{ clothing.season }}</div>
            <p class="suggestion">{{ clothing.suggestion }}</p>
            <div class="clothing-item">
              <span class="item-label">执勤着装：</span>
              <span>{{ clothing.uniform }}</span>
            </div>
            <div class="clothing-item">
              <span class="item-label">训练着装：</span>
              <span>{{ clothing.training }}</span>
            </div>
            <div class="clothing-item caution">
              <span class="item-label">⚠️ 注意：</span>
              <span>{{ clothing.caution }}</span>
            </div>
          </div>
        </div>

        <div class="dashboard-card meeting-card" (click)="goTo('meeting')">
          <div class="card-header">
            <span class="card-icon">📋</span>
            <h3>每周二会议要点</h3>
          </div>
          <div class="meeting-body" *ngIf="meeting">
            <p class="meeting-date">{{ meeting.date }} | 主持：{{ meeting.host }}</p>
            <div class="meeting-points">
              <div class="meeting-point" *ngFor="let p of meeting.points.slice(0,3)">
                <span class="point-title">{{ p.title }}</span>
                <p>{{ p.content | slice:0:50 }}...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container { padding: 24px; }
    .page-title {
      font-size: 20px;
      color: #333;
      margin-bottom: 24px;
      font-weight: 600;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
    }
    .dashboard-card {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      cursor: pointer;
      transition: all 0.3s;
      border-top: 4px solid;
    }
    .dashboard-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
    .weather-card { border-color: #3498db; }
    .clothing-card { border-color: #27ae60; }
    .meeting-card { border-color: #e67e22; }
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .card-icon { font-size: 28px; }
    .card-header h3 {
      font-size: 18px;
      color: #333;
      font-weight: 600;
    }
    
    .weather-main {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 16px;
    }
    .temp-icon { font-size: 56px; }
    .temp-info { display: flex; flex-direction: column; }
    .temp-value {
      font-size: 42px;
      font-weight: 700;
      color: #3498db;
    }
    .temp-condition {
      color: #666;
      font-size: 14px;
    }
    .weather-detail p {
      color: #555;
      font-size: 14px;
      line-height: 1.8;
      margin: 0;
    }
    
    .season-tag {
      display: inline-block;
      background: #27ae60;
      color: #fff;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 13px;
      margin-bottom: 14px;
    }
    .suggestion {
      color: #27ae60;
      font-weight: 500;
      margin-bottom: 14px;
    }
    .clothing-item {
      padding: 8px 0;
      font-size: 14px;
      color: #555;
      border-bottom: 1px dashed #eee;
    }
    .clothing-item:last-child { border-bottom: none; }
    .clothing-item.caution { color: #e67e22; }
    .item-label { color: #333; font-weight: 500; }
    
    .meeting-date {
      color: #888;
      font-size: 13px;
      margin-bottom: 14px;
    }
    .meeting-point {
      padding: 10px 0;
      border-bottom: 1px dashed #eee;
    }
    .meeting-point:last-child { border-bottom: none; }
    .point-title {
      display: block;
      font-weight: 600;
      color: #e67e22;
      margin-bottom: 4px;
      font-size: 14px;
    }
    .meeting-point p {
      margin: 0;
      font-size: 13px;
      color: #666;
      line-height: 1.6;
    }
  `]
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  weather: WeatherInfo | null = null;
  clothing: ClothingInfo | null = null;
  meeting: MeetingSummary | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.loadData();
  }

  loadData(): void {
    this.apiService.getWeather().subscribe(data => this.weather = data);
    this.apiService.getClothing().subscribe(data => this.clothing = data);
    this.apiService.getMeetingSummary().subscribe(data => this.meeting = data);
  }

  goTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
