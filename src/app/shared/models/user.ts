import type { AddressResponse } from './adress.model';
import type { CreatePersonRequest } from './customer.model';

export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  NONE = 'NONE',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISMISSED = 'DISMISSED',
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

export interface UpdateUserAccessRequest {
  role: UserRole;
  status: UserStatus;
}

export interface UpdateUserAccessResponse {
  name: string;
  role: UserRole;
  status: UserStatus;
}

export type User = ListUsersResponse;
