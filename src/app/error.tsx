"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h2 className=" text-4xl font-bold text-destructive">
        Something Went Wrong!
      </h2>
      <Button onClick={() => reset()}>Try Again</Button>
    </div>
  );
}
