import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse, UserRole } from '../models';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

type JwtPayload = {
  name: string;
  role: UserRole;
  exp: number;
  sub: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_URL = `${environment.apiBaseUrl}/api/auth/login`;
  private readonly TOKEN_KEY = 'access_token';
  private decodedToken: JwtPayload | null = null;

  constructor(private http: HttpClient) { }

  isAuthenticated(): boolean {
    const token = this.getDecodedToken();
    if (!token) return false;

    const now = Math.floor(Date.now() / 1000); // transforma em segundos
    return token.exp > now; // token ainda não expirou? (exp > now)
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.AUTH_URL, payload).pipe(
      map((response) => {
        this.setSession(response);
        return response;
      })
    );
  }

  private setSession(response: LoginResponse): void {
    sessionStorage.setItem(this.TOKEN_KEY, response.accessToken);
    this.decodedToken = null; // invalida cache porque o token mudou
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.decodedToken = null; // limpa o cache
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  getName(): string | null {
    return this.getDecodedToken()?.name ?? null;
  }

  getRole(): UserRole | null {
    return this.getDecodedToken()?.role ?? null;
  }

  // mantém o payload decodificado em memória 
  // para evitar decodificar toda hora
  private getDecodedToken(): JwtPayload | null {
    if (this.decodedToken) return this.decodedToken;

    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      if (!payload) return null;

      this.decodedToken = JSON.parse(atob(payload));
      return this.decodedToken;
    } catch {
      return null;
    }
  }
}
