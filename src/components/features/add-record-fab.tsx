import Link from "next/link";
import { Plus } from "lucide-react";

export function AddRecordFab() {
  return (
    <Link
      href="/records/new"
      aria-label="新しい記録を追加"
      className="fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 sm:hidden"
    >
      <Plus className="size-6" />
    </Link>
  );
}
