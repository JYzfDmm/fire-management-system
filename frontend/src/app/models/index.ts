export interface User {
  id?: number;
  username: string;
  realName: string;
  role: string;
  roleDescription: string;
  permissions: string[];
  enabled?: boolean;
  department?: string;
  phone?: string;
  status?: string;
  statusDescription?: string;
  gender?: string;
  genderDescription?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  joinDate?: string;
  remark?: string;
  firstLogin?: boolean;
}

export interface LoginResponse {
  token: string;
  username: string;
  realName: string;
  role: string;
  roleDescription: string;
  permissions: string[];
  firstLogin: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface UserCreateRequest {
  username: string;
  password: string;
  realName: string;
  role: string;
  department: string;
  phone: string;
  status: string;
  gender?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  joinDate: string;
  remark?: string;
}

export interface UserUpdateRequest {
  realName: string;
  role: string;
  department: string;
  phone: string;
  status: string;
  gender?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  joinDate: string;
  remark?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

export interface OptionItem {
  value: string;
  label: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface WeatherInfo {
  date: string;
  weekday: string;
  season: string;
  temperature: number;
  temperatureRange: string;
  condition: string;
  icon: string;
  humidity: string;
  wind: string;
  airQuality: string;
}

export interface ClothingInfo {
  season: string;
  suggestion: string;
  uniform: string;
  training: string;
  caution: string;
  tips: string[];
}

export interface MeetingPoint {
  title: string;
  content: string;
}

export interface MeetingSummary {
  title: string;
  date: string;
  host: string;
  participants: string;
  points: MeetingPoint[];
}
