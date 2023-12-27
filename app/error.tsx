"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-full flex items-center justify-center text-center">
      <div>
        <h2>Something went wrong!</h2>
        <Button variant="default" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
