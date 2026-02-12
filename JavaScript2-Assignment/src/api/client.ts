import { API_BASE_URL } from "./config";
import { getApiKey, getToken } from "../utils/storage";

/**
 * Makes an HTTP request to the Noroff API.
 * Automatically attaches Authorization token and API key if they exist.
 *
 * @template T - Expected response type
 * @param endpoint - API endpoint starting with "/"
 * @param options - Fetch options (method, body, headers)
 * @returns Promise resolving to parsed JSON response
 * @throws Error if the request fails
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { body?: unknown } = {}
): Promise<T> {
  const token = getToken();
  const apiKey = getApiKey();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string> | undefined) ?? {}),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (apiKey) headers["X-Noroff-API-Key"] = apiKey;

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
