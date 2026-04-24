import type { AddressResponse } from './adress.model';
import type { CreatePersonRequest } from './customer.model';

export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface ListUsersResponse {
  id: string;
  name: string;
  email: string | null;
  createdAt: string;
  role: UserRole;
  stateId: number;
  cityId: number;
}

export type CreateUserRequest = CreatePersonRequest & {
  role: UserRole;
  password: string;
};

export interface CreateUserResponse {
  name: string;
  email: string | null;
  stateId: number;
  cityId: number;
  role: UserRole;
}

export type UpdateUserRequest = CreatePersonRequest & {
  password: string;
};

export interface UpdateUserResponse {
  name: string;
  phone: string;
  email: string | null;
  cpf: string;
  dateOfBirth: string | null;
  address: AddressResponse;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

export interface UpdateUserRoleResponse {
  name: string;
  role: UserRole;
}

export type User = ListUsersResponse;
