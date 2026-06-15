import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { User } from '../../models';

@Component({
  selector: 'app-header',
  template: `
    <header class="app-header">
      <div class="header-left">
        <span class="page-title">{{ currentTitle }}</span>
      </div>
      <div class="header-right">
        <div class="user-dropdown">
          <span class="user-display">
            <span class="user-badge">{{ currentUser?.realName?.charAt(0) || '👤' }}</span>
            <span class="user-name">{{ currentUser?.realName }}</span>
            <span class="user-role-tag">{{ currentUser?.roleDescription }}</span>
          </span>
          <button class="logout-btn" (click)="logout()" title="退出登录">
            🚪 退出
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      height: 60px;
      background: #fff;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .header-left .page-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .header-right { display: flex; align-items: center; gap: 16px; }
    .user-dropdown {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .user-display {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .user-badge {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }
    .user-name {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
    .user-role-tag {
      background: #fef0f0;
      color: #c0392b;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
    }
    .logout-btn {
      background: #fff;
      border: 1px solid #e8e8e8;
      color: #666;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      transition: all 0.2s;
    }
    .logout-btn:hover {
      background: #c0392b;
      color: #fff;
      border-color: #c0392b;
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  currentTitle: string = '首页';

  private titleMap: Record<string, string> = {
    'home': '首页',
    'weather': '天气与日期',
    'clothing': '季节着装提示',
    'meeting': '会议总结要点',
    'meals': '食堂三餐公示',
    'training': '训练任务管理',
    'supplies': '日常用品申领',
    'manual': '队内手册',
    'media': '活动视频与照片展示',
    'duty': '值班与岗哨排班信息',
    'vehicles': '车辆与装备在位状态',
    'personnel': '队内人员信息',
    'users': '用户管理'
  };

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    const url = this.router.url.split('/')[1] || 'home';
    this.currentTitle = this.titleMap[url] || '首页';
    
    this.router.events.subscribe(() => {
      const u = this.router.url.split('/')[1] || 'home';
      this.currentTitle = this.titleMap[u] || '首页';
    });
  }

  logout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}
