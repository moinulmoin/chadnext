"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * TanStack Query is the default client data layer. Convex subscriptions
 * flow through it via the official `@convex-dev/react-query` adapter
 * (`convexQuery`), so live server data and any external API data share one
 * cache, one devtools story, and the suspense patterns React 19 users expect.
 */
export default function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Convex data is live-subscribed; nothing needs refetch windows.
            staleTime: Infinity,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
