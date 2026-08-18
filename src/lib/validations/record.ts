import { z } from "zod";

export const recordSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください").max(200),
  author: z.string().max(200).optional().or(z.literal("")),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),
  categoryId: z.string().optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5).optional().or(z.literal("")),
  note: z.string().max(2000).optional().or(z.literal("")),
  startedAt: z.string().optional().or(z.literal("")),
  finishedAt: z.string().optional().or(z.literal("")),
  tags: z.string().max(300, "タグは300文字以内で入力してください").optional().or(z.literal("")),
});

export const categorySchema = z.object({
  name: z.string().min(1, "カテゴリ名を入力してください").max(50),
});
