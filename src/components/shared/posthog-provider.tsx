"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PostHogJsProvider } from "posthog-js/react";

import { env } from "@/lib/env";

const posthogKey = env.NEXT_PUBLIC_POSTHOG_KEY;

/**
 * Gracefully optional analytics + error tracking (zero-config rule):
 * without NEXT_PUBLIC_POSTHOG_KEY nothing initializes and children render
 * untouched. Session replay and feature flags are enabled from the PostHog
 * dashboard — no extra code (see example.env).
 */
if (posthogKey && typeof window !== "undefined" && !posthog.__loaded) {
  posthog.init(posthogKey, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    // Pageviews are captured per App Router navigation in PostHogPageView.
    capture_pageview: false,
    // Error tracking: the SDK's window.onerror / unhandledrejection
    // autocapture. LLM/server errors are covered by AI SDK telemetry.
    capture_exceptions: true,
  });
}

/** Captures one $pageview per App Router navigation (official pattern). */
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!posthog.__loaded) return;
    const search = searchParams.toString();
    const url =
      window.location.origin + pathname + (search ? `?${search}` : "");
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({ children }: { children: ReactNode }) {
  if (!posthogKey) {
    return <>{children}</>;
  }

  return (
    <PostHogJsProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PostHogJsProvider>
  );
}
