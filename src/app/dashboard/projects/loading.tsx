import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Skeleton className="h-36 rounded-lg" />
      <Skeleton className="h-36 rounded-lg" />
      <Skeleton className="h-36 rounded-lg" />
      <Skeleton className="h-36 rounded-lg" />
    </div>
  );
}
