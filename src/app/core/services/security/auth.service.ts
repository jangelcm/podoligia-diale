import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment/enviornment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}` + '/api/u';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<any> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, data);
  }

  register(data: RegisterRequest) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  refresh(token: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${this.apiUrl}/refresh`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  saveToken(token: string) {
    localStorage.setItem('accessToken', token); // token = accessToken
  }

  saveRefreshToken(token: string) {
    localStorage.setItem('refreshToken', token);
  }

  processAuthResponse(res: TokenResponse) {
    this.saveToken(res.accessToken);
    this.saveRefreshToken(res.refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
