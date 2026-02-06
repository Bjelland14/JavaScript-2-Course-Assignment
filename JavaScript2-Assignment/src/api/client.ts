import { API_BASE_URL } from "../app/config";
import { getApiKey, getToken } from "../utils/storage";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = getToken();
  const apiKey = getApiKey();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (apiKey) {
    headers["X-Noroff-API-Key"] = apiKey;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let message = "API error";
    try {
      const errorData = await response.json();
      message = errorData?.message ?? message;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(`${response.status}: ${message}`);
  }

  return response.json() as Promise<T>;
}
