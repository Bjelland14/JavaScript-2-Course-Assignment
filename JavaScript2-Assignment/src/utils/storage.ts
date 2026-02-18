const TOKEN_KEY = "token";
const PROFILE_NAME_KEY = "profileName";
const API_KEY_KEY = "apiKey";

function getStore(): Storage | null {
  // Try localStorage first
  try {
    const test = "__test__";
    localStorage.setItem(test, "1");
    localStorage.removeItem(test);
    return localStorage;
  } catch {
    // Fallback to sessionStorage
    try {
      const test = "__test__";
      sessionStorage.setItem(test, "1");
      sessionStorage.removeItem(test);
      return sessionStorage;
    } catch {
      return null;
    }
  }
}

/**
 * Checks if the browser allows any storage (localStorage or sessionStorage).
 */
export function canUseStorage(): boolean {
  return getStore() !== null;
}

function safeSet(key: string, value: string): void {
  const store = getStore();
  if (!store) return;
  try {
    store.setItem(key, value);
  } catch {
  }
}

function safeGet(key: string): string | null {
  const store = getStore();
  if (!store) return null;
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

function safeRemove(key: string): void {
  const store = getStore();
  if (!store) return;
  try {
    store.removeItem(key);
  } catch {
    
  }
}

export function saveToken(token: string): void {
  safeSet(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return safeGet(TOKEN_KEY);
}

export function saveProfileName(name: string): void {
  safeSet(PROFILE_NAME_KEY, name);
}

export function getProfileName(): string | null {
  return safeGet(PROFILE_NAME_KEY);
}

export function saveApiKey(key: string): void {
  safeSet(API_KEY_KEY, key);
}

export function getApiKey(): string | null {
  return safeGet(API_KEY_KEY);
}

export function clearAuth(): void {
  safeRemove(TOKEN_KEY);
  safeRemove(PROFILE_NAME_KEY);
  safeRemove(API_KEY_KEY);
}
