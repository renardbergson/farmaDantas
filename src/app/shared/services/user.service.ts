import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserRole, UserStatus } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USERS_URL = `${environment.apiBaseUrl}/api/users`;

  constructor(private http: HttpClient) { }

  getUsers(
    filters?: { role?: UserRole; status?: UserStatus }
  ): Observable<User[]> {
    let params = new HttpParams();

    if (filters?.role) {
      params = params.set('role', filters.role);
    }

    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    return this.http.get<User[]>(`${this.USERS_URL}`, { params });
  }
}