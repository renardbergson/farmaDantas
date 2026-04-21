import { UserRole } from "./user";

export interface LoginRequest {
  cpf: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  userId: string;
  name: string;
  role: UserRole;
}