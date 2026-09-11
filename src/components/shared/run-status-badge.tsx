import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { Doc } from "../../../convex/_generated/dataModel";

type RunStatus = Doc<"runs">["status"];

const RUN_STATUS_STYLES: Record<
  RunStatus,
  { variant: "secondary" | "outline" | "destructive"; className?: string }
> = {
  queued: { variant: "secondary" },
  running: {
    variant: "outline",
    className: "animate-pulse border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  succeeded: {
    variant: "outline",
    className:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  failed: { variant: "destructive" },
};

export function RunStatusBadge({ status }: { status: RunStatus }) {
  const style = RUN_STATUS_STYLES[status];

  return (
    <Badge variant={style.variant} className={cn(style.className)}>
      {status}
    </Badge>
  );
}
