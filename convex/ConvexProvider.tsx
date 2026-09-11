"use client";

import type { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

import { env } from "@/lib/env";

const convex = new ConvexReactClient(
  env.NEXT_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud",
);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
