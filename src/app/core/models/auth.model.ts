export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  role: string;
}
