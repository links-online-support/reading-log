import { Circle, CircleCheck, CircleDashed, type LucideIcon } from "lucide-react";
import type { RecordStatus } from "@prisma/client";

export const STATUS_LABEL: Record<RecordStatus, string> = {
  NOT_STARTED: "未着手",
  IN_PROGRESS: "進行中",
  COMPLETED: "完了",
};

export const STATUS_ICON: Record<RecordStatus, LucideIcon> = {
  NOT_STARTED: Circle,
  IN_PROGRESS: CircleDashed,
  COMPLETED: CircleCheck,
};

export const STATUS_BADGE_CLASS: Record<RecordStatus, string> = {
  NOT_STARTED: "bg-muted text-muted-foreground",
  IN_PROGRESS:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  COMPLETED:
    "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
};

// ダッシュボードの統計カードなど、背景ではなくアイコン/数値の文字色だけを
// ステータスカラーで示したい箇所向け。
export const STATUS_ACCENT_CLASS: Record<RecordStatus, string> = {
  NOT_STARTED: "text-muted-foreground",
  IN_PROGRESS: "text-blue-600 dark:text-blue-400",
  COMPLETED: "text-green-600 dark:text-green-400",
};
