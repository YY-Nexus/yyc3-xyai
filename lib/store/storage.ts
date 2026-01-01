import { WebStorage } from 'redux-persist';

interface StorageError extends Error {
  code?: 'QUOTA_EXCEEDED' | 'ACCESS_DENIED' | 'UNKNOWN';
  key?: string;
}

const createNoopStorage = (): WebStorage => ({
  getItem: (_key: string) => Promise.resolve(null),
  setItem: (_key: string, value: string) => Promise.resolve(value),
  removeItem: (_key: string) => Promise.resolve(),
});

const createSSRCompatibleStorage = (): WebStorage => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return {
      getItem: (key: string): Promise<string | null> => {
        try {
          const value = window.localStorage.getItem(key);
          return Promise.resolve(value);
        } catch (error) {
          const storageError: StorageError = error instanceof Error ? error : new Error(String(error));
          storageError.code = 'ACCESS_DENIED';
          storageError.key = key;
          console.warn('Error reading from localStorage:', storageError);
          return Promise.resolve(null);
        }
      },
      setItem: (key: string, value: string): Promise<string> => {
        try {
          window.localStorage.setItem(key, value);
          return Promise.resolve(value);
        } catch (error) {
          const storageError: StorageError = error instanceof Error ? error : new Error(String(error));
          storageError.code = 'QUOTA_EXCEEDED';
          storageError.key = key;
          console.warn('Error writing to localStorage:', storageError);
          return Promise.resolve(value);
        }
      },
      removeItem: (key: string): Promise<void> => {
        try {
          window.localStorage.removeItem(key);
          return Promise.resolve();
        } catch (error) {
          const storageError: StorageError = error instanceof Error ? error : new Error(String(error));
          storageError.code = 'ACCESS_DENIED';
          storageError.key = key;
          console.warn('Error removing from localStorage:', storageError);
          return Promise.resolve();
        }
      },
    };
  }
  return createNoopStorage();
};

export const storage = createSSRCompatibleStorage();

export type { StorageError };
