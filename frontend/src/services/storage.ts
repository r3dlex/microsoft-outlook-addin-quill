/**
 * Abstraction over Office.context.roamingSettings for persisting
 * encrypted API keys, provider preferences, and UI settings.
 * Falls back to localStorage when Office.js is not available (dev mode).
 */

function hasRoamingSettings(): boolean {
  try {
    return (
      typeof Office !== 'undefined' &&
      !!Office.context?.roamingSettings
    );
  } catch {
    return false;
  }
}

/**
 * Get a value from Office roamingSettings.
 * Returns undefined if the key does not exist.
 */
export function getRoamingSetting(key: string): unknown {
  if (hasRoamingSettings()) {
    return Office.context.roamingSettings.get(key);
  }
  // Fallback: use localStorage with a prefix
  return getLocalStorage(`roaming:${key}`);
}

/**
 * Set a value in Office roamingSettings and persist it.
 * The saveAsync call ensures the value is synced to Exchange.
 */
export async function setRoamingSetting(key: string, value: unknown): Promise<void> {
  if (hasRoamingSettings()) {
    Office.context.roamingSettings.set(key, value);
    return new Promise<void>((resolve, reject) => {
      Office.context.roamingSettings.saveAsync((result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          resolve();
        } else {
          reject(new Error(result.error?.message ?? 'Failed to save roaming settings'));
        }
      });
    });
  }
  // Fallback: use localStorage
  setLocalStorage(`roaming:${key}`, value);
}

/**
 * Remove a value from Office roamingSettings and persist.
 */
export async function removeSetting(key: string): Promise<void> {
  if (hasRoamingSettings()) {
    Office.context.roamingSettings.set(key, undefined);
    return new Promise<void>((resolve, reject) => {
      Office.context.roamingSettings.saveAsync((result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          resolve();
        } else {
          reject(new Error(result.error?.message ?? 'Failed to save roaming settings'));
        }
      });
    });
  }
  // Fallback
  removeLocalStorage(`roaming:${key}`);
}

/**
 * Get a value from localStorage. Used for non-sensitive data
 * such as chat history and UI preferences.
 */
export function getLocalStorage(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

/**
 * Set a value in localStorage.
 */
export function setLocalStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or unavailable; silently ignore
  }
}

/**
 * Remove a value from localStorage.
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently ignore
  }
}
