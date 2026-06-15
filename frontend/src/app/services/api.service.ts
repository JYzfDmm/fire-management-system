import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse, LoginResponse, WeatherInfo, ClothingInfo, MeetingSummary } from '../models';
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
            permissions: res.data.permissions
          });
        }
        return res.data;
      }));
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/users/me`)
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

  logout(): void {
    this.authService.clearAuth();
  }
}
