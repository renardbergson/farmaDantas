import { Injectable } from '@angular/core';
import { User, UserRole } from '../models';
import { Observable, of } from 'rxjs';
import { MOCK_USERS } from '../data/users.mock';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [...MOCK_USERS];

  getEmployees(): Observable<User[]> {
    const employees = this.users.filter((u) => u.role === UserRole.EMPLOYEE);
    return of(employees);
  }
}
