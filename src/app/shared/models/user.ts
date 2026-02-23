import { Person } from './person.model';

export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}

export interface User {
  id: string;
  role: UserRole;
  personId: string;
  person: Person;
}