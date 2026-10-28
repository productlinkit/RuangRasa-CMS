export interface KeyValueRepository {
  get<Value>(key: string, fallback: Value): Value;
  set<Value>(key: string, value: Value): void;
  remove(key: string): void;
}

export function createLocalStorageRepository(): KeyValueRepository {
  return {
    get(key, fallback) {
      if (typeof window === "undefined") return fallback;

      try {
        const stored = window.localStorage.getItem(key);
        return stored === null
          ? fallback
          : (JSON.parse(stored) as typeof fallback);
      } catch (error) {
        console.error(`Unable to read persisted data "${key}".`, error);
        return fallback;
      }
    },
    set(key, value) {
      if (typeof window === "undefined") return;

      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Unable to persist data "${key}".`, error);
        throw error;
      }
    },
    remove(key) {
      if (typeof window === "undefined") return;

      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error(`Unable to remove persisted data "${key}".`, error);
        throw error;
      }
    },
  };
}

export const localStorageRepository = createLocalStorageRepository();
