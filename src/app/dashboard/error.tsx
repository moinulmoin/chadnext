"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button, buttonVariants } from "~/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error({ error }, error.name);
  }, [error]);

  const title = error.stack?.includes("ForbiddenError")
    ? "This page is only for Admin"
    : "Oops, Something Went Wrong!";

  const button = error.stack?.includes("ForbiddenError") ? (
    <Link href="/dashboard/projects" className={buttonVariants()}>
      Go to Projects
    </Link>
  ) : (
    <Button onClick={() => reset()}>Try Again</Button>
  );

  return (
    <div className="flex h-[calc(100vh-160px)] w-full flex-col items-center gap-y-10 py-24">
      <h2 className=" text-5xl font-bold text-destructive">{title}</h2>
      {button}
    </div>
  );
}
