const TOKEN_KEY = "token";
const PROFILE_NAME_KEY = "profileName";

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function saveProfileName(name: string): void {
  localStorage.setItem(PROFILE_NAME_KEY, name);
}

export function getProfileName(): string | null {
  return localStorage.getItem(PROFILE_NAME_KEY);
}

export function clearAuth(): void {
  clearToken();
  localStorage.removeItem(PROFILE_NAME_KEY);
}
