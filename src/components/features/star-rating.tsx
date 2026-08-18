"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const STAR_VALUES = [1, 2, 3, 4, 5];

export function StarRating({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: number | null;
}) {
  const [value, setValue] = useState<number | null>(defaultValue ?? null);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue ?? value ?? 0;

  return (
    <div className="flex items-center gap-2">
      <input type="hidden" name={name} value={value ?? ""} />
      <div
        role="radiogroup"
        aria-label="満足度"
        className="flex items-center gap-0.5"
        onMouseLeave={() => setHoverValue(null)}
      >
        {STAR_VALUES.map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star}`}
            onMouseEnter={() => setHoverValue(star)}
            onClick={() => setValue((current) => (current === star ? null : star))}
            className="p-0.5 text-muted-foreground transition-colors hover:text-amber-400"
          >
            <Star
              className={cn(
                "size-6",
                star <= displayValue &&
                  "fill-amber-400 text-amber-400",
              )}
            />
          </button>
        ))}
      </div>
      {value && (
        <button
          type="button"
          onClick={() => setValue(null)}
          className="text-xs text-muted-foreground underline"
        >
          クリア
        </button>
      )}
    </div>
  );
}
