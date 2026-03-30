export type RoleName = "user" | "admin" | "manager";

export interface User {
  user_id: number;
  email: string;
  phone: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  birth_date: string | null;
  status: boolean | null;
  role: RoleName | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  phone?: string;
  status?: boolean;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  birth_date?: string;
  role?: RoleName;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ProfileResponse {
  userId: number;
  email: string;
  roles: RoleName[];
}
