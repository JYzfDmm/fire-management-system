export interface User {
  id?: number;
  username: string;
  realName: string;
  role: string;
  roleDescription: string;
  permissions: string[];
  enabled?: boolean;
}

export interface LoginResponse {
  token: string;
  username: string;
  realName: string;
  role: string;
  roleDescription: string;
  permissions: string[];
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
