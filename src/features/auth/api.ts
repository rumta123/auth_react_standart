import { apiRequest } from "../../lib/api";
import type {
  LoginPayload,
  LoginResponse,
  ProfileResponse,
  RegisterPayload,
  RegisterResponse,
  User,
} from "../../types/auth";

export function login(payload: LoginPayload) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function register(payload: RegisterPayload) {
  return apiRequest<RegisterResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function getProfile(token?: string | null) {
  const profile = await apiRequest<ProfileResponse>("/auth/profile", {
    token,
  });

  const normalizedUser: User = {
    user_id: profile.userId,
    email: profile.email,
    phone: null,
    first_name: null,
    middle_name: null,
    last_name: null,
    birth_date: null,
    status: true,
    role: profile.roles[0] ?? null,
  };

  return normalizedUser;
}
