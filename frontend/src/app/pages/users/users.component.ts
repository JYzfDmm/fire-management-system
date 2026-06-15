import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User, OptionItem, UserCreateRequest, UserUpdateRequest } from '../../models';
import { debounceTime, map, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-users',
  template: `
    <div class="page-container">
      <div class="page-header">
      <h2 class="page-title"><span class="title-icon">🔐</span> 用户管理</h2>
      <button class="btn btn-primary" (click)="openAddModal()">
        <span>➕</span> 新增用户
      </button>
    </div>

    <div class="filter-bar">
      <div class="filter-item">
        <input type="text" placeholder="搜索姓名/工号" [(ngModel)]="searchKeyword" (keyup.enter)="search()" class="form-input">
        <button class="btn btn-secondary" (click)="search()">搜索</button>
      </div>
      <div class="filter-item">
        <select [(ngModel)]="filterRole" (change)="loadUsers()" class="form-select">
          <option value="">全部角色</option>
          <option *ngFor="let r of roleOptions" [value]="r.value">{{ r.label }}</option>
        </select>
      </div>
      <div class="filter-item">
        <select [(ngModel)]="filterStatus" (change)="loadUsers()" class="form-select">
          <option value="">全部状态</option>
          <option *ngFor="let s of statusOptions" [value]="s.value">{{ s.label }}</option>
        </select>
      </div>
      <div class="filter-item">
        <select [(ngModel)]="filterDepartment" (change)="loadUsers()" class="form-select">
          <option value="">全部部门</option>
          <option *ngFor="let d of departments" [value]="d">{{ d }}</option>
        </select>
      </div>
      <div class="filter-item">
        <button class="btn btn-outline" (click)="resetFilters()">重置</button>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
          <th>工号</th>
          <th>姓名</th>
          <th>角色</th>
          <th>所属中队/部门</th>
          <th>手机号</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
        <tbody>
          <tr *ngFor="let user of users">
            <td>{{ user.username }}</td>
            <td>{{ user.realName }}</td>
            <td><span class="role-badge" [class]="user.role">{{ user.roleDescription }}</span></td>
            <td>{{ user.department }}</td>
            <td>{{ user.phone }}</td>
            <td><span class="status-badge" [class]="user.status">{{ user.statusDescription }}</span></td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm btn-outline" (click)="openEditModal(user)" [disabled]="user.role === 'SYS' && !isCurrentUserSys">编辑</button>
                <button class="btn btn-sm btn-outline" (click)="openResetPasswordModal(user)" [disabled]="user.role === 'SYS' && !isCurrentUserSys">重置密码</button>
                <button class="btn btn-sm btn-danger" (click)="openDeleteModal(user)" [disabled]="user.role === 'SYS' || isCurrentUser(user)">删除</button>
              </div>
            </td>
          </tr>
          <tr *ngIf="users.length === 0">
            <td colspan="7" class="empty-state">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <div class="pagination-info">
        共 {{ totalElements }} 条记录，第 {{ currentPage + 1 }} / {{ totalPages }} 页
      </div>
      <div class="pagination-controls">
        <select [(ngModel)]="pageSize" (change)="changePageSize()" class="form-select-sm">
          <option [value]="10">10条/页</option>
          <option [value]="20">20条/页</option>
          <option [value]="50">50条/页</option>
          <option [value]="100">100条/页</option>
        </select>
        <button class="btn btn-sm" (click)="goToPage(0)" [disabled]="currentPage === 0">首页</button>
        <button class="btn btn-sm" (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 0">上一页</button>
        <span class="page-numbers">
          <button *ngFor="let p of visiblePages" class="btn btn-sm" [class.active]="p === currentPage" (click)="goToPage(p)">{{ p + 1 }}</button>
        </span>
        <button class="btn btn-sm" (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages - 1">下一页</button>
        <button class="btn btn-sm" (click)="goToPage(totalPages - 1)" [disabled]="currentPage >= totalPages - 1">末页</button>
      </div>
    </div>
    </div>

    <!-- 新增/编辑用户弹窗 -->
    <div *ngIf="showUserModal" class="modal-overlay" (click)="closeUserModal()">
      <div class="modal-content modal-large" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ isEdit ? '编辑用户' : '新增用户' }}</h3>
          <button class="modal-close" (click)="closeUserModal()">×</button>
        </div>
        <form [formGroup]="userForm" (ngSubmit)="submitUserForm()">
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>工号 <span class="required">*</span></label>
                <input type="text" formControlName="username" class="form-input" [class.invalid]="isFieldInvalid('username')" [disabled]="isEdit">
                <div *ngIf="isFieldInvalid('username')" class="error-text">{{ getFieldError('username') }}</div>
              </div>
              <div class="form-group" *ngIf="!isEdit">
                <label>密码 <span class="required">*</span></label>
                <input type="password" formControlName="password" class="form-input" [class.invalid]="isFieldInvalid('password')">
                <div *ngIf="isFieldInvalid('password')" class="error-text">{{ getFieldError('password') }}</div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>姓名 <span class="required">*</span></label>
                <input type="text" formControlName="realName" class="form-input" [class.invalid]="isFieldInvalid('realName')">
                <div *ngIf="isFieldInvalid('realName')" class="error-text">{{ getFieldError('realName') }}</div>
              </div>
              <div class="form-group">
                <label>角色 <span class="required">*</span></label>
                <select formControlName="role" class="form-select" [class.invalid]="isFieldInvalid('role')">
                  <option value="">请选择角色</option>
                  <option *ngFor="let r of roleOptions" [value]="r.value">{{ r.label }}</option>
                </select>
                <div *ngIf="isFieldInvalid('role')" class="error-text">{{ getFieldError('role') }}</div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>所属中队/部门 <span class="required">*</span></label>
                <input type="text" formControlName="department" class="form-input" [class.invalid]="isFieldInvalid('department')">
                <div *ngIf="isFieldInvalid('department')" class="error-text">{{ getFieldError('department') }}</div>
              </div>
              <div class="form-group">
                <label>手机号 <span class="required">*</span></label>
                <input type="text" formControlName="phone" class="form-input" [class.invalid]="isFieldInvalid('phone')">
                <div *ngIf="isFieldInvalid('phone')" class="error-text">{{ getFieldError('phone') }}</div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>状态 <span class="required">*</span></label>
                <select formControlName="status" class="form-select" [class.invalid]="isFieldInvalid('status')">
                  <option value="">请选择状态</option>
                  <option *ngFor="let s of statusOptions" [value]="s.value">{{ s.label }}</option>
                </select>
                <div *ngIf="isFieldInvalid('status')" class="error-text">{{ getFieldError('status') }}</div>
              </div>
              <div class="form-group">
                <label>性别</label>
                <select formControlName="gender" class="form-select">
                  <option value="">请选择性别</option>
                  <option value="MALE">男</option>
                  <option value="FEMALE">女</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>入职日期 <span class="required">*</span></label>
                <input type="date" formControlName="joinDate" class="form-input" [class.invalid]="isFieldInvalid('joinDate')">
                <div *ngIf="isFieldInvalid('joinDate')" class="error-text">{{ getFieldError('joinDate') }}</div>
              </div>
              <div class="form-group">
                <label>紧急联系人</label>
                <input type="text" formControlName="emergencyContact" class="form-input">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>紧急联系电话</label>
                <input type="text" formControlName="emergencyPhone" class="form-input">
              </div>
              <div class="form-group">
                <label></label>
                <div></div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group form-full">
                <label>备注</label>
                <textarea formControlName="remark" rows="3" class="form-textarea"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" (click)="closeUserModal()">取消</button>
            <button type="submit" class="btn btn-primary" [disabled]="userForm.invalid || loading">{{ loading ? '保存中...' : '保存' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <div *ngIf="showConfirmModal" class="modal-overlay" (click)="closeConfirmModal()">
      <div class="modal-content modal-small" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ confirmTitle }}</h3>
          <button class="modal-close" (click)="closeConfirmModal()">×</button>
        </div>
        <div class="modal-body">
          <p>{{ confirmMessage }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="closeConfirmModal()">取消</button>
          <button class="btn btn-danger" [class.btn-primary]="confirmType !== 'delete'" (click)="confirmAction()">{{ confirmType === 'delete' ? '确认删除' : '确认' }}</button>
        </div>
      </div>
    </div>

    <!-- 系统管理员二次确认弹窗 -->
    <div *ngIf="showSysConfirmModal" class="modal-overlay" (click)="closeSysConfirmModal()">
      <div class="modal-content modal-small" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>⚠️ 重要提示</h3>
          <button class="modal-close" (click)="closeSysConfirmModal()">×</button>
        </div>
        <div class="modal-body">
          <p>您正在创建/编辑系统管理员账号，这是最高权限角色，请确认操作。</p>
          <div class="warning-box">
            <p>系统管理员拥有系统全部权限，请谨慎操作！</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="closeSysConfirmModal()">取消</button>
          <button class="btn btn-primary" (click)="confirmSysAction()">确认继续</button>
        </div>
      </div>
    </div>

    <!-- 提示消息 -->
    <div *ngIf="toastMessage" class="toast" [class.success]="toastType === 'success'" [class.error]="toastType === 'error'">
      {{ toastMessage }}
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .page-title {
      font-size: 22px;
      color: #333;
      margin: 0;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .title-icon { font-size: 26px; }
    .filter-bar {
      background: #fff;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      margin-bottom: 16px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }
    .filter-item {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .table-container {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    .data-table th,
    .data-table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
    }
    .data-table th {
      background: #fafafa;
      font-weight: 600;
      color: #555;
      font-size: 13px;
    }
    .data-table tbody tr:hover {
      background: #f9f9f9;
    }
    .role-badge,
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    .role-badge.SYS { background: #ffebee; color: #c62828; }
    .role-badge.DD { background: #fff3e0; color: #e65100; }
    .role-badge.ZD { background: #e8f5e9; color: #2e7d32; }
    .role-badge.PT { background: #e3f2fd; color: #1565c0; }
    .role-badge.HQ { background: #f3e5f5; color: #6a1b9a; }
    .role-badge.ST { background: #fffde7; color: #f57f17; }
    .status-badge.ON_JOB { background: #e8f5e9; color: #2e7d32; }
    .status-badge.ON_LEAVE { background: #fff3e0; color: #e65100; }
    .status-badge.RESIGNED { background: #ffebee; color: #c62828; }
    .action-buttons {
      display: flex;
      gap: 8px;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
    }
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #fff;
      margin-top: 16px;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .pagination-info {
      color: #666;
      font-size: 13px;
    }
    .pagination-controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .page-numbers {
      display: flex;
      gap: 4px;
    }
    .page-numbers .btn.active {
      background: #c0392b;
      color: #fff;
    }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-primary {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      color: #fff;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(231,76,60,0.4);
    }
    .btn-secondary {
      background: #666;
      color: #fff;
    }
    .btn-outline {
      background: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }
    .btn-outline:hover:not(:disabled) {
      background: #e8e8e8;
    }
    .btn-danger {
      background: #e74c3c;
      color: #fff;
    }
    .btn-danger:hover:not(:disabled) {
      background: #c0392b;
    }
    .btn-sm {
      padding: 4px 12px;
      font-size: 12px;
    }
    .form-input,
    .form-select,
    .form-textarea {
      padding: 8px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      transition: all 0.2s;
      width: 100%;
      box-sizing: border-box;
    }
    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      border-color: #e74c3c;
      box-shadow: 0 0 0 3px rgba(231,76,60,0.1);
    }
    .form-input.invalid,
    .form-select.invalid {
      border-color: #e74c3c;
    }
    .form-select-sm {
      padding: 4px 8px;
      font-size: 12px;
    }
    .form-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group label {
      font-size: 13px;
      color: #555;
      font-weight: 500;
    }
    .form-group .required {
      color: #e74c3c;
    }
    .error-text {
      color: #e74c3c;
      font-size: 12px;
    }
    .form-full {
      flex: 2;
    }
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background: #fff;
      border-radius: 12px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-large {
      width: 90%;
      max-width: 800px;
    }
    .modal-small {
      width: 90%;
      max-width: 450px;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #f0f0f0;
    }
    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }
    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #999;
    }
    .modal-body {
      padding: 24px;
    }
    .modal-body p {
      margin: 0 0 16px 0;
      color: #666;
      line-height: 1.6;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #f0f0f0;
    }
    .warning-box {
      background: #fff3e0;
      border-left: 4px solid #e65100;
      padding: 12px 16px;
      border-radius: 4px;
      margin-top: 16px 0;
    }
    .warning-box p {
      margin: 0;
      color: #e65100;
      font-weight: 500;
    }
    .toast {
      position: fixed;
      top: 24px;
      right: 24px;
      padding: 12px 24px;
      border-radius: 8px;
      color: #fff;
      z-index: 2000;
      animation: slideIn 0.3s ease;
    }
    .toast.success {
      background: #2e7d32;
    }
    .toast.error {
      background: #c62828;
    }
    @keyframes slideIn {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  roleOptions: OptionItem[] = [];
  statusOptions: OptionItem[] = [];
  departments: string[] = [];

  searchKeyword: string = '';
  filterRole: string = '';
  filterStatus: string = '';
  filterDepartment: string = '';

  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];

  showUserModal: boolean = false;
  showConfirmModal: boolean = false;
  showSysConfirmModal: boolean = false;
  isEdit: boolean = false;
  editingUser: User | null = null;
  userForm!: FormGroup;
  loading: boolean = false;

  confirmTitle: string = '';
  confirmMessage: string = '';
  confirmType: string = '';
  confirmActionCallback: (() => void) | null = null;

  toastMessage: string = '';
  toastType: string = 'success';
  sysConfirmCallback: (() => void) | null = null;

  private currentUserId: number | undefined;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUser()?.id;
    this.initForm();
    this.loadOptions();
    this.loadUsers();
  }

  get isCurrentUserSys(): boolean {
    return this.authService.hasRole('SYS');
  }

  initForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      realName: ['', [Validators.required, Validators.maxLength(50)]],
      role: ['', [Validators.required]],
      department: ['', [Validators.required, Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)],
      status: ['', [Validators.required]],
      gender: [''],
      joinDate: ['', [Validators.required]],
      emergencyContact: [''],
      emergencyPhone: [''],
      remark: ['']
    });
  }

  loadOptions(): void {
    this.apiService.getRoles().subscribe(data => this.roleOptions = data);
    this.apiService.getStatuses().subscribe(data => this.statusOptions = data);
    this.apiService.getDepartments().subscribe(data => this.departments = data);
  }

  loadUsers(): void {
    this.apiService.getUsersPage(
      this.searchKeyword,
      this.filterRole || undefined,
      this.filterStatus || undefined,
      this.filterDepartment || undefined,
      this.currentPage,
      this.pageSize
    ).subscribe(data => {
      this.users = data.content;
      this.totalElements = data.totalElements;
      this.totalPages = data.totalPages;
      this.currentPage = data.pageNumber;
      this.updateVisiblePages();
    });
  }

  updateVisiblePages(): void {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, this.currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    this.visiblePages = pages;
  }

  search(): void {
    this.currentPage = 0;
    this.loadUsers();
  }

  resetFilters(): void {
    this.searchKeyword = '';
    this.filterRole = '';
    this.filterStatus = '';
    this.filterDepartment = '';
    this.currentPage = 0;
    this.loadUsers();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  changePageSize(): void {
    this.currentPage = 0;
    this.loadUsers();
  }

  isCurrentUser(user: User): boolean {
    return user.id === this.currentUserId;
  }

  openAddModal(): void {
    this.isEdit = false;
    this.editingUser = null;
    this.initForm();
    this.userForm.get('username')?.setAsyncValidators(this.usernameExistsValidator());
    this.userForm.get('phone')?.setAsyncValidators(this.phoneExistsValidator());
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.showUserModal = true;
  }

  openEditModal(user: User): void {
    this.isEdit = true;
    this.editingUser = user;
    this.initForm();
    this.userForm.patchValue({
      username: user.username,
      realName: user.realName,
      role: user.role,
      department: user.department,
      phone: user.phone,
      status: user.status,
      gender: user.gender || '',
      joinDate: user.joinDate,
      emergencyContact: user.emergencyContact || '',
      emergencyPhone: user.emergencyPhone || '',
      remark: user.remark || ''
    });
    this.userForm.get('username')?.clearAsyncValidators();
    this.userForm.get('phone')?.setAsyncValidators(this.phoneExistsValidator(user.id));
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.editingUser = null;
  }

  submitUserForm(): void {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.value;

    if (formValue.role === 'SYS') {
      this.sysConfirmCallback = () => this.doSubmitUserForm();
      this.showSysConfirmModal = true;
      return;
    }

    this.doSubmitUserForm();
  }

  private doSubmitUserForm(): void {
    this.loading = true;
    const formValue = this.userForm.value;

    if (this.isEdit && this.editingUser) {
      const updateData: UserUpdateRequest = {
        realName: formValue.realName,
        role: formValue.role,
        department: formValue.department,
        phone: formValue.phone,
        status: formValue.status,
        gender: formValue.gender || undefined,
        emergencyContact: formValue.emergencyContact || undefined,
        emergencyPhone: formValue.emergencyPhone || undefined,
        joinDate: formValue.joinDate,
        remark: formValue.remark || undefined
      };

      this.apiService.updateUser(this.editingUser.id!, updateData).subscribe({
        next: () => {
          this.showToast('更新成功', 'success');
          this.closeUserModal();
          this.loadUsers();
          this.loadOptions();
        },
        error: (err) => {
          this.showToast(err.message || '更新失败', 'error');
        }
      }).add(() => {
        this.loading = false;
      });
    } else {
      const createData: UserCreateRequest = {
        username: formValue.username,
        password: formValue.password,
        realName: formValue.realName,
        role: formValue.role,
        department: formValue.department,
        phone: formValue.phone,
        status: formValue.status,
        gender: formValue.gender || undefined,
        emergencyContact: formValue.emergencyContact || undefined,
        emergencyPhone: formValue.emergencyPhone || undefined,
        joinDate: formValue.joinDate,
        remark: formValue.remark || undefined
      };

      this.apiService.createUser(createData).subscribe({
        next: () => {
          this.showToast('创建成功', 'success');
          this.closeUserModal();
          this.loadUsers();
          this.loadOptions();
        },
        error: (err) => {
          this.showToast(err.message || '创建失败', 'error');
        }
      }).add(() => {
        this.loading = false;
      });
    }
  }

  openDeleteModal(user: User): void {
    this.confirmTitle = '确认删除';
    this.confirmMessage = `确定要删除用户 "${user.realName}" 吗？删除后用户状态将标记为离职，不可恢复。`;
    this.confirmType = 'delete';
    this.confirmActionCallback = () => this.doDeleteUser(user);
    this.showConfirmModal = true;
  }

  openResetPasswordModal(user: User): void {
    this.confirmTitle = '确认重置密码';
    this.confirmMessage = `确定要将用户 "${user.realName}" 的密码重置为默认密码 "123456" 吗？`;
    this.confirmType = 'reset';
    this.confirmActionCallback = () => this.doResetPassword(user);
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.confirmActionCallback = null;
  }

  confirmAction(): void {
    if (this.confirmActionCallback) {
      this.confirmActionCallback();
    }
    this.closeConfirmModal();
  }

  closeSysConfirmModal(): void {
    this.showSysConfirmModal = false;
    this.sysConfirmCallback = null;
  }

  confirmSysAction(): void {
    if (this.sysConfirmCallback) {
      this.sysConfirmCallback();
    }
    this.closeSysConfirmModal();
  }

  private doDeleteUser(user: User): void {
    this.apiService.deleteUser(user.id!).subscribe({
      next: () => {
        this.showToast('删除成功', 'success');
        this.loadUsers();
      },
      error: (err) => {
        this.showToast(err.message || '删除失败', 'error');
      }
    });
  }

  private doResetPassword(user: User): void {
    this.apiService.resetPassword(user.id!).subscribe({
      next: () => {
        this.showToast('密码已重置为 123456，请通知用户首次登录修改密码', 'success');
      },
      error: (err) => {
        this.showToast(err.message || '密码重置失败', 'error');
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.userForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return '此字段为必填项';
    if (control.errors['minlength']) return `最少需要 ${control.errors['minlength'].requiredLength} 个字符`;
    if (control.errors['maxlength']) return `最多允许 ${control.errors['maxlength'].requiredLength} 个字符`;
    if (control.errors['pattern']) return '手机号格式不正确';
    if (control.errors['usernameExists']) return '工号已存在';
    if (control.errors['phoneExists']) return '手机号已存在';
    return '输入格式不正确';
  }

  private usernameExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);
      return of(control.value).pipe(
        debounceTime(300),
        switchMap(value => this.apiService.checkUsernameExists(value)),
        map(exists => exists ? { usernameExists: true } : null)
      );
    };
  }

  private phoneExistsValidator(excludeId?: number): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);
      return of(control.value).pipe(
        debounceTime(300),
        switchMap(value => this.apiService.checkPhoneExists(value, excludeId)),
        map(exists => exists ? { phoneExists: true } : null)
      );
    };
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }
}
