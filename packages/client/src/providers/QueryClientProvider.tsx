import { ReactNode } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { asyncStoragePersister } from '../lib/indexedDBPersister';

// Create a QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      networkMode: `offlineFirst`,
      retry: 2,
      throwOnError: true,
    },
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      networkMode: `offlineFirst`,
      refetchOnMount: `always`,
      refetchOnReconnect: `always`,
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      throwOnError: true,
    },
  },
});

// Set up IndexedDB persistence
const indexedDBPersister = createAsyncStoragePersister({
  storage: asyncStoragePersister,
});

export const QueryClientProvider: React.FC<{ children: ReactNode }> = ({ children }) =>
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{
      persister: indexedDBPersister,
    }}
  >
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </PersistQueryClientProvider>;
