import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse, UserRole } from '../models';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_URL = `${environment.apiBaseUrl}/api/auth/login`;
  private readonly TOKEN_KEY = 'access_token';
  private readonly ROLE_KEY = 'user_role';

  constructor(private http: HttpClient) { }

  isAuthenticated(): boolean {
    return !!this.getToken(); // transforma em boolean
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.AUTH_URL, payload).pipe(
      map((response) => {
        this.setSession(response);
        return response;
      })
    )
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.ROLE_KEY);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): UserRole | null {
    return sessionStorage.getItem(this.ROLE_KEY) as UserRole;
  }

  private setSession(response: LoginResponse): void {
    sessionStorage.setItem(this.TOKEN_KEY, response.accessToken);
    sessionStorage.setItem(this.ROLE_KEY, response.role);
  }
}
