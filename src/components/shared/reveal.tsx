"use client";

import type { ReactNode } from "react";

import { useReveal } from "@/hooks/use-reveal";

/** Client wrapper so server sections can scroll-reveal a block. */
export function Reveal({
  children,
  className,
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useReveal<HTMLDivElement>(delayMs);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
