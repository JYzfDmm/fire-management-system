import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse, LoginResponse, WeatherInfo, ClothingInfo, MeetingSummary, User, PageResponse, UserCreateRequest, UserUpdateRequest, ChangePasswordRequest, ResetPasswordRequest, OptionItem } from '../models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/auth/login`, { username, password })
      .pipe(map(res => {
        if (res.code === 200) {
          this.authService.setToken(res.data.token);
          this.authService.setUser({
            username: res.data.username,
            realName: res.data.realName,
            role: res.data.role,
            roleDescription: res.data.roleDescription,
            permissions: res.data.permissions,
            firstLogin: res.data.firstLogin
          });
        }
        return res.data;
      }));
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/users/me`)
      .pipe(map(res => res.data));
  }

  getWeather(): Observable<WeatherInfo> {
    return this.http.get<ApiResponse<WeatherInfo>>(`${this.baseUrl}/dashboard/weather`)
      .pipe(map(res => res.data));
  }

  getClothing(): Observable<ClothingInfo> {
    return this.http.get<ApiResponse<ClothingInfo>>(`${this.baseUrl}/dashboard/clothing`)
      .pipe(map(res => res.data));
  }

  getMeetingSummary(): Observable<MeetingSummary> {
    return this.http.get<ApiResponse<MeetingSummary>>(`${this.baseUrl}/dashboard/meeting-summary`)
      .pipe(map(res => res.data));
  }

  getUsersPage(keyword?: string, role?: string, status?: string, department?: string, page: number = 0, size: number = 10): Observable<PageResponse<User>> {
    let params = new HttpParams();
    if (keyword) params = params.set('keyword', keyword);
    if (role) params = params.set('role', role);
    if (status) params = params.set('status', status);
    if (department) params = params.set('department', department);
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<User>>>(`${this.baseUrl}/users/page`, { params })
      .pipe(map(res => res.data));
  }

  getDepartments(): Observable<string[]> {
    return this.http.get<ApiResponse<string[]>>(`${this.baseUrl}/users/departments`)
      .pipe(map(res => res.data));
  }

  getRoles(): Observable<OptionItem[]> {
    return this.http.get<ApiResponse<OptionItem[]>>(`${this.baseUrl}/users/roles`)
      .pipe(map(res => res.data));
  }

  getStatuses(): Observable<OptionItem[]> {
    return this.http.get<ApiResponse<OptionItem[]>>(`${this.baseUrl}/users/statuses`)
      .pipe(map(res => res.data));
  }

  checkUsernameExists(username: string): Observable<boolean> {
    const params = new HttpParams().set('username', username);
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/users/check-username`, { params })
      .pipe(map(res => res.data));
  }

  checkPhoneExists(phone: string, excludeId?: number): Observable<boolean> {
    let params = new HttpParams().set('phone', phone);
    if (excludeId) params = params.set('excludeId', excludeId.toString());
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/users/check-phone`, { params })
      .pipe(map(res => res.data));
  }

  createUser(user: UserCreateRequest): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/users`, user)
      .pipe(map(res => {
        if (res.code !== 200) throw new Error(res.message);
        return res.data;
      }));
  }

  updateUser(id: number, user: UserUpdateRequest): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/users/${id}`, user)
      .pipe(map(res => {
        if (res.code !== 200) throw new Error(res.message);
        return res.data;
      }));
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/users/${id}`)
      .pipe(map(res => {
        if (res.code !== 200) throw new Error(res.message);
      }));
  }

  resetPassword(id: number): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/users/${id}/reset-password`, {})
      .pipe(map(res => {
        if (res.code !== 200) throw new Error(res.message);
      }));
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/users/change-password`, request)
      .pipe(map(res => {
        if (res.code !== 200) throw new Error(res.message);
      }));
  }

  resetPasswordByUser(request: ResetPasswordRequest): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/users/reset-password-by-user`, request)
      .pipe(map(res => {
        if (res.code !== 200) throw new Error(res.message);
      }));
  }

  logout(): void {
    this.authService.clearAuth();
  }
}
