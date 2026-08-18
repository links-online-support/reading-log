"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
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
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h2 className="text-lg font-semibold">問題が発生しました</h2>
      <p className="text-sm text-muted-foreground">
        ページの表示中にエラーが発生しました。もう一度お試しください。
      </p>
      <Button onClick={reset}>再試行する</Button>
    </div>
  );
}
