"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@prisma/client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_OPTIONS = [
  { value: "ALL", label: "すべて" },
  { value: "NOT_STARTED", label: "未着手" },
  { value: "IN_PROGRESS", label: "進行中" },
  { value: "COMPLETED", label: "完了" },
];

export function RecordFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/records?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Input
        placeholder="タイトルで検索"
        defaultValue={searchParams.get("query") ?? ""}
        onChange={(e) => updateParam("query", e.target.value)}
        className="sm:max-w-xs"
      />
      <Select
        defaultValue={searchParams.get("status") ?? "ALL"}
        onValueChange={(value) => updateParam("status", value ?? "")}
      >
        <SelectTrigger className="sm:w-40">
          <SelectValue>
            {(value: string) =>
              STATUS_OPTIONS.find((option) => option.value === value)?.label ??
              value
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={searchParams.get("categoryId") ?? "ALL"}
        onValueChange={(value) => updateParam("categoryId", value ?? "")}
      >
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder="カテゴリ">
            {(value: string) =>
              value === "ALL" || !value
                ? "すべてのカテゴリ"
                : (categories.find((category) => category.id === value)?.name ??
                  value)
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">すべてのカテゴリ</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
