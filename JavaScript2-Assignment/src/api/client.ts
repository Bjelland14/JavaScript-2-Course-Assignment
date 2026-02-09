import { API_BASE_URL } from "./config";
import { getToken } from "../utils/storage";

/**
 * Makes an HTTP request to the Noroff API.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { body?: unknown } = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      (data && (data.message || data.errors?.[0]?.message)) || "API error";
    throw new Error(`${res.status}: ${message}`);
  }

  return data as T;
}
