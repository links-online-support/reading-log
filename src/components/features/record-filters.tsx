"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category, RecordStatus } from "@prisma/client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_ICON, STATUS_LABEL } from "@/lib/record-status";
import { getCategorySwatchClass } from "@/lib/category-colors";
import { cn } from "@/lib/utils";

const STATUS_FILTER_ORDER: RecordStatus[] = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
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
              value === "ALL"
                ? "すべて"
                : (STATUS_LABEL[value as RecordStatus] ?? value)
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">すべて</SelectItem>
          {STATUS_FILTER_ORDER.map((status) => {
            const StatusIcon = STATUS_ICON[status];
            return (
              <SelectItem key={status} value={status}>
                <StatusIcon /> {STATUS_LABEL[status]}
              </SelectItem>
            );
          })}
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
              <span
                className={cn(
                  "size-2.5 rounded-full",
                  getCategorySwatchClass(category.color),
                )}
              />
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
