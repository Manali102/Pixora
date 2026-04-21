/**
 * QueryProvider
 * Wraps the app with TanStack Query's QueryClientProvider.
 * Centralizes query client configuration (retry, stale time, etc.).
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Query provider component
 * @param param0 children - ReactNode
 * @returns QueryClientProvider
 */
export const QueryProvider = ({ children }: QueryProviderProps) => {
  // useState ensures one QueryClient per component lifecycle (safe for SSR/strict mode)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
