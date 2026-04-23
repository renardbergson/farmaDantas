export interface LoginRequest {
  cpf: string;
  password: string;
}

export interface LoginResponse {
  tokenType: string;
  accessToken: string;
}