export const CATEGORY_COLORS = [
  "gray",
  "red",
  "orange",
  "amber",
  "green",
  "teal",
  "blue",
  "purple",
  "pink",
] as const;

export type CategoryColor = (typeof CATEGORY_COLORS)[number];

export const DEFAULT_CATEGORY_COLOR: CategoryColor = "gray";

// Tailwindはビルド時にソース中の静的なクラス名文字列しか検出できないため、
// 動的に組み立てず、色ごとのクラスをこの一覧にすべて明示的に書き出している。
export const CATEGORY_BADGE_CLASS: Record<CategoryColor, string> = {
  gray: "bg-muted text-muted-foreground",
  red: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  orange:
    "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  amber:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  green:
    "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  purple:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
};

export const CATEGORY_SWATCH_CLASS: Record<CategoryColor, string> = {
  gray: "bg-zinc-400",
  red: "bg-red-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  green: "bg-green-500",
  teal: "bg-teal-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
};

export function isCategoryColor(value: string): value is CategoryColor {
  return (CATEGORY_COLORS as readonly string[]).includes(value);
}

function resolveCategoryColor(color: string): CategoryColor {
  return isCategoryColor(color) ? color : DEFAULT_CATEGORY_COLOR;
}

export function getCategoryBadgeClass(color: string): string {
  return CATEGORY_BADGE_CLASS[resolveCategoryColor(color)];
}

export function getCategorySwatchClass(color: string): string {
  return CATEGORY_SWATCH_CLASS[resolveCategoryColor(color)];
}
