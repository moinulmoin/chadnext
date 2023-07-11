import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className=" max-w-2xl">
      <Skeleton className="mb-5 h-28 w-28 rounded-full" />
      <div className=" space-y-8">
        <div>
          <Skeleton className="mb-2 h-4 w-10 rounded" />
          <Skeleton className="h-10 w-full rounded" />
        </div>
        <div>
          <Skeleton className="mb-2 h-4 w-10 rounded" />
          <Skeleton className="h-10 w-full rounded" />
        </div>
        <div>
          <Skeleton className="mb-2 h-4 w-10 rounded" />
          <Skeleton className="h-20 w-full rounded" />
        </div>
        <div>
          <Skeleton className="h-10 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}
