import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className=" space-y-8">
      <Skeleton className=" h-[75px] rounded-md" />
      <Skeleton className=" h-[200px] rounded-md" />
    </div>
  );
}
