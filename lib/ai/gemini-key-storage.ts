'use client';

const GEMINI_KEY_STORAGE_KEY = 'kisan_direct_gemini_api_key';

export function getStoredGeminiApiKey(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(GEMINI_KEY_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredGeminiApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (!key.trim()) {
      localStorage.removeItem(GEMINI_KEY_STORAGE_KEY);
    } else {
      localStorage.setItem(GEMINI_KEY_STORAGE_KEY, key.trim());
    }
  } catch {
    // ignore
  }
}

/**
 * Returns headers with x-gemini-api-key if available
 */
export function getGeminiAuthHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const key = getStoredGeminiApiKey();
  const headers: Record<string, string> = {
    ...customHeaders,
  };
  if (key) {
    headers['x-gemini-api-key'] = key;
  }
  return headers;
}
