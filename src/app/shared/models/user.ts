import type { AddressResponse } from './adress.model';
import type { CreatePersonRequest } from './customer.model';

export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

/** Espelha {@code ListUsersResponse} da API. */
export interface ListUsersResponse {
  id: string;
  name: string;
  email: string | null;
  createdAt: string;
  role: UserRole;
  stateId: number;
  cityId: number;
}

/**
 * Corpo JSON de criação de usuário: {@code CreateUserRequest} com {@code person} desempacotado (JsonUnwrapped).
 */
export type CreateUserRequest = CreatePersonRequest & {
  role: UserRole;
  password: string;
};

/** Espelha {@code CreateUserResponse} da API. */
export interface CreateUserResponse {
  name: string;
  email: string | null;
  stateId: number;
  cityId: number;
  role: UserRole;
}

/**
 * Corpo JSON de atualização: {@code UpdateUserRequest} com {@code person} desempacotado.
 */
export type UpdateUserRequest = CreatePersonRequest & {
  password: string;
};

/** Espelha {@code UpdateUserResponse} da API. */
export interface UpdateUserResponse {
  name: string;
  phone: string;
  email: string | null;
  cpf: string;
  dateOfBirth: string | null;
  address: AddressResponse;
}

/** Espelha {@code UpdateUserRoleRequest} da API. */
export interface UpdateUserRoleRequest {
  role: UserRole;
}

/** Espelha {@code UpdateUserRoleResponse} da API. */
export interface UpdateUserRoleResponse {
  name: string;
  role: UserRole;
}

/** Linha de listagem de usuários na API (equivalente prático ao que a listagem retorna). */
export type User = ListUsersResponse;
