import { AsyncStorage } from '@tanstack/react-query-persist-client';
import { openDB } from 'idb';

const DB_NAME = `query-cache`;
const STORE_NAME = `queries`;

export const asyncStoragePersister: AsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const db = await openDB(DB_NAME, 1, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME);
        }
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await db.get(STORE_NAME, key);
    return result ? JSON.stringify(result) : null;
  },
  removeItem: async (key: string): Promise<void> => {
    const db = await openDB(DB_NAME, 1, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME);
        }
      },
    });
    await db.delete(STORE_NAME, key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    const db = await openDB(DB_NAME, 1, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME);
        }
      },
    });
    await db.put(STORE_NAME, JSON.parse(value), key);
  },
};

export const saveQuery = async (key: string, value: unknown): Promise<void> => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    },
  });
  await db.put(STORE_NAME, value, key);
};

export const getQuery = async (key: string): Promise<unknown> => {
  const db = await openDB(DB_NAME, 1);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const result = await db.get(STORE_NAME, key);
  return result;
};

export const clearQueries = async (): Promise<void> => {
  const db = await openDB(DB_NAME, 1);
  await db.clear(STORE_NAME);
};
