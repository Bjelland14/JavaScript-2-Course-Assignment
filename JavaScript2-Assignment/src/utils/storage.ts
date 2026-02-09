const TOKEN_KEY = "token";
const PROFILE_NAME_KEY = "profileName";
const API_KEY_KEY = "apiKey";

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveProfileName(name: string): void {
  localStorage.setItem(PROFILE_NAME_KEY, name);
}

export function getProfileName(): string | null {
  return localStorage.getItem(PROFILE_NAME_KEY);
}

export function saveApiKey(key: string): void {
  localStorage.setItem(API_KEY_KEY, key);
}

export function getApiKey(): string | null {
  return localStorage.getItem(API_KEY_KEY);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_NAME_KEY);
  localStorage.removeItem(API_KEY_KEY);
}
