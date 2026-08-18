import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const STAR_VALUES = [1, 2, 3, 4, 5];

export function RatingStars({ value }: { value: number | null }) {
  if (!value) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="flex items-center gap-0.5" aria-label={`評価 ${value}`}>
      {STAR_VALUES.map((star) => (
        <Star
          key={star}
          className={cn(
            "size-3.5",
            star <= value
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground",
          )}
        />
      ))}
    </div>
  );
}
