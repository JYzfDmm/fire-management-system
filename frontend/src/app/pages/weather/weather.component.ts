import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { WeatherInfo } from '../../models';

@Component({
  selector: 'app-weather',
  template: `
    <div class="page-container">
      <h2 class="page-title">🌤️ 天气与日期</h2>
      <div class="content-card" *ngIf="weather">
        <div class="weather-display">
          <div class="weather-big-icon">{{ weather.icon }}</div>
          <div class="weather-big-info">
            <span class="big-temp">{{ weather.temperature }}°C</span>
            <span class="big-condition">{{ weather.condition }}</span>
          </div>
        </div>
        <div class="weather-meta">
          <p><strong>📅 日期：</strong>{{ weather.date }} {{ weather.weekday }}</p>
          <p><strong>🌸 季节：</strong>{{ weather.season }}</p>
          <p><strong>🌡️ 温度范围：</strong>{{ weather.temperatureRange }}</p>
          <p><strong>💧 湿度：</strong>{{ weather.humidity }}</p>
          <p><strong>🌬️ 风力：</strong>{{ weather.wind }}</p>
          <p><strong>🌱 空气质量：</strong>{{ weather.airQuality }}</p>
        </div>
      </div>
      <div class="placeholder-tip">（此页面待后续完善，可接入真实天气API）</div>
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
      max-width: 600px;
    }
    .weather-display {
      display: flex;
      align-items: center;
      gap: 32px;
      margin-bottom: 28px;
      padding-bottom: 24px;
      border-bottom: 2px solid #f0f0f0;
    }
    .weather-big-icon { font-size: 96px; }
    .weather-big-info { display: flex; flex-direction: column; }
    .big-temp { font-size: 64px; font-weight: 700; color: #3498db; }
    .big-condition { font-size: 20px; color: #666; }
    .weather-meta p {
      padding: 10px 0;
      font-size: 15px;
      color: #555;
      border-bottom: 1px dashed #eee;
      margin: 0;
    }
    .weather-meta p:last-child { border-bottom: none; }
    .placeholder-tip {
      margin-top: 16px;
      color: #999;
      font-size: 13px;
    }
  `]
})
export class WeatherComponent implements OnInit {
  weather: WeatherInfo | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getWeather().subscribe(data => this.weather = data);
  }
}
