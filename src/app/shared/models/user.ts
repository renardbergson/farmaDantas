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
  status: UserStatus;
  name: string;
  email: string | null;
  createdAt: string;
  role: UserRole;
  stateId: number | null;
  cityId: number | null;
}

export type CreateUserRequest = CreatePersonRequest & {
  password: string;
};

export interface CreateUserResponse {
  name: string;
  email: string | null;
  stateId: number | null;
  cityId: number | null;
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
  address: AddressResponse | null;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

export interface UpdateUserRoleResponse {
  name: string;
  role: UserRole;
}

export type User = ListUsersResponse;
