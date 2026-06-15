import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

interface MenuItem {
  route: string;
  icon: string;
  label: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-icon">🚒</div>
        <div class="logo-text">
          <h1>消防管理</h1>
          <span>Fire Management</span>
        </div>
      </div>
      
      <nav class="sidebar-menu">
        <div class="menu-section">
          <span class="section-title">主要功能</span>
          <a 
            *ngFor="let item of menuItems" 
            [routerLink]="item.route" 
            routerLinkActive="active"
            class="menu-item">
            <span class="menu-icon">{{ item.icon }}</span>
            <span class="menu-label">{{ item.label }}</span>
          </a>
        </div>
        
        <div class="menu-section" *ngIf="isAdmin">
          <span class="section-title">系统管理</span>
          <a routerLink="/users" routerLinkActive="active" class="menu-item">
            <span class="menu-icon">🔐</span>
            <span class="menu-label">用户管理</span>
          </a>
        </div>
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">{{ currentUser?.realName?.charAt(0) || '👤' }}</div>
          <div class="user-detail">
            <span class="user-name">{{ currentUser?.realName }}</span>
            <span class="user-role">{{ currentUser?.roleDescription }}</span>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100vh;
      background: linear-gradient(180deg, #8b0000 0%, #c0392b 100%);
      color: #fff;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
    }
    .sidebar-header {
      padding: 20px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.15);
    }
    .logo-icon {
      font-size: 36px;
    }
    .logo-text h1 {
      font-size: 18px;
      margin: 0;
      font-weight: 700;
    }
    .logo-text span {
      font-size: 11px;
      opacity: 0.7;
    }
    .sidebar-menu {
      flex: 1;
      padding: 16px 12px;
      overflow-y: auto;
    }
    .menu-section {
      margin-bottom: 20px;
    }
    .section-title {
      display: block;
      padding: 8px 12px;
      font-size: 12px;
      color: rgba(255,255,255,0.6);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s;
      font-size: 14px;
      margin-bottom: 4px;
    }
    .menu-item:hover {
      background: rgba(255,255,255,0.12);
      color: #fff;
    }
    .menu-item.active {
      background: rgba(255,255,255,0.2);
      color: #fff;
      font-weight: 500;
    }
    .menu-icon { font-size: 18px; }
    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.15);
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .user-avatar {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 600;
    }
    .user-detail {
      display: flex;
      flex-direction: column;
    }
    .user-name {
      font-size: 14px;
      font-weight: 500;
    }
    .user-role {
      font-size: 12px;
      opacity: 0.7;
    }
  `]
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;
  isAdmin: boolean = false;

  menuItems: MenuItem[] = [
    { route: '/home', icon: '🏠', label: '首页' },
    { route: '/weather', icon: '🌤️', label: '天气与日期' },
    { route: '/clothing', icon: '👕', label: '季节着装提示' },
    { route: '/meeting', icon: '📋', label: '会议总结要点' },
    { route: '/meals', icon: '🍱', label: '食堂三餐公示' },
    { route: '/training', icon: '💪', label: '训练任务管理' },
    { route: '/supplies', icon: '📦', label: '日常用品申领' },
    { route: '/manual', icon: '📖', label: '队内手册' },
    { route: '/media', icon: '🎬', label: '活动视频与照片' },
    { route: '/duty', icon: '🕐', label: '值班与岗哨排班' },
    { route: '/vehicles', icon: '🚒', label: '车辆与装备在位' },
    { route: '/personnel', icon: '👥', label: '队内人员信息' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.isAdmin = this.authService.hasRole('SYS');
  }
}
