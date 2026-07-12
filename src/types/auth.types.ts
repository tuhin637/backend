export interface HrUser {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  name: string;
}