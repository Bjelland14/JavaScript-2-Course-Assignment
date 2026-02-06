const TOKEN_KEY = "token";
const API_KEY_KEY = "apiKey";

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function saveApiKey(apiKey: string): void {
  localStorage.setItem(API_KEY_KEY, apiKey);
}

export function getApiKey(): string | null {
  return localStorage.getItem(API_KEY_KEY);
}

export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_KEY);
}

export function clearAuth(): void {
  clearToken();
  clearApiKey();
}
