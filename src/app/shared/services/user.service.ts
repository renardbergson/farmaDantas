import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserRole } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USERS_URL = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  // TODO: implementar filtro por usuário atual logado
  // TODO: se for admin, listar o próprio admin + todos os funcionários
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.USERS_URL}`);
  }
}