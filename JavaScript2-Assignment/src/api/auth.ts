import { apiRequest } from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    name: string;
    email: string;
    accessToken: string;
  };
  meta: object;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export function login(body: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", { method: "POST", body });
}

export function register(
  body: RegisterRequest
): Promise<{ data: { name: string; email: string }; meta: object }> {
  return apiRequest<{ data: { name: string; email: string }; meta: object }>(
    "/auth/register",
    { method: "POST", body }
  );
}
