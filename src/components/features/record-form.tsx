"use client";

import { useActionState } from "react";
import type { Category } from "@prisma/client";
import type { RecordWithRelations } from "@/types/record";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddCategoryDialog } from "@/components/features/add-category-dialog";

type ActionState = { error: string | null };
type RecordFormAction = (
  prevState: ActionState,
  formData: FormData,
) => Promise<ActionState>;

function toDateInputValue(date: Date | null | undefined) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function RecordForm({
  action,
  categories,
  record,
}: {
  action: RecordFormAction;
  categories: Category[];
  record?: RecordWithRelations;
}) {
  const [state, formAction, isPending] = useActionState(action, {
    error: null,
  });

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          name="title"
          required
          maxLength={200}
          defaultValue={record?.title}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="author">著者 / 教材名</Label>
        <Input
          id="author"
          name="author"
          maxLength={200}
          defaultValue={record?.author ?? ""}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">ステータス</Label>
          <Select name="status" defaultValue={record?.status ?? "NOT_STARTED"}>
            <SelectTrigger id="status">
              <SelectValue>
                {(value: string) =>
                  ({
                    NOT_STARTED: "未着手",
                    IN_PROGRESS: "進行中",
                    COMPLETED: "完了",
                  })[value] ?? value
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NOT_STARTED">未着手</SelectItem>
              <SelectItem value="IN_PROGRESS">進行中</SelectItem>
              <SelectItem value="COMPLETED">完了</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="rating">評価（1〜5）</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min={1}
            max={5}
            defaultValue={record?.rating ?? ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="categoryId">カテゴリ</Label>
          <AddCategoryDialog />
        </div>
        <Select name="categoryId" defaultValue={record?.categoryId ?? ""}>
          <SelectTrigger id="categoryId">
            <SelectValue placeholder="カテゴリを選択">
              {(value: string) =>
                categories.find((category) => category.id === value)?.name ??
                (value ? value : "カテゴリを選択")
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="tags">タグ（カンマ区切り）</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="React, フロントエンド"
          defaultValue={record?.tags.map((t) => t.tag.name).join(", ") ?? ""}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="startedAt">開始日</Label>
          <Input
            id="startedAt"
            name="startedAt"
            type="date"
            defaultValue={toDateInputValue(record?.startedAt)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="finishedAt">完了日</Label>
          <Input
            id="finishedAt"
            name="finishedAt"
            type="date"
            defaultValue={toDateInputValue(record?.finishedAt)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="note">学びメモ</Label>
        <Textarea
          id="note"
          name="note"
          rows={4}
          maxLength={2000}
          defaultValue={record?.note ?? ""}
        />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "保存中..." : "保存する"}
      </Button>
    </form>
  );
}
