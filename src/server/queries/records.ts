import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { RecordFilters } from "@/types/record";

function resolveOrderBy(
  sort: RecordFilters["sort"],
): Prisma.RecordOrderByWithRelationInput {
  switch (sort) {
    case "title":
      return { title: "asc" };
    case "finishedAt":
      return { finishedAt: { sort: "desc", nulls: "last" } };
    case "rating":
      return { rating: { sort: "desc", nulls: "last" } };
    default:
      return { updatedAt: "desc" };
  }
}

export async function getRecords(userId: string, filters: RecordFilters = {}) {
  return db.record.findMany({
    where: {
      userId,
      status: filters.status,
      categoryId: filters.categoryId,
      title: filters.query
        ? { contains: filters.query, mode: "insensitive" }
        : undefined,
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: resolveOrderBy(filters.sort),
  });
}

export async function getRecordById(userId: string, recordId: string) {
  return db.record.findFirst({
    where: { id: recordId, userId },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });
}

function getCategoryBreakdown(
  records: { category: { name: string; color: string } | null }[],
) {
  const counts = new Map<string, { name: string; color: string; count: number }>();

  for (const { category } of records) {
    const name = category?.name ?? "未分類";
    const color = category?.color ?? "gray";
    const existing = counts.get(name);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(name, { name, color, count: 1 });
    }
  }

  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
}

function getMonthlyCompletions(records: { finishedAt: Date | null }[]) {
  const counts = new Map<string, number>();

  for (const { finishedAt } of records) {
    if (!finishedAt) continue;
    const month = `${finishedAt.getFullYear()}-${String(finishedAt.getMonth() + 1).padStart(2, "0")}`;
    counts.set(month, (counts.get(month) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export async function getDashboardStats(userId: string) {
  const [total, completed, inProgress, notStarted, recentlyCompleted, allRecords] =
    await Promise.all([
      db.record.count({ where: { userId } }),
      db.record.count({ where: { userId, status: "COMPLETED" } }),
      db.record.count({ where: { userId, status: "IN_PROGRESS" } }),
      db.record.count({ where: { userId, status: "NOT_STARTED" } }),
      db.record.findMany({
        where: { userId, status: "COMPLETED" },
        orderBy: { finishedAt: "desc" },
        take: 5,
        include: { category: true },
      }),
      db.record.findMany({
        where: { userId },
        select: {
          finishedAt: true,
          category: { select: { name: true, color: true } },
        },
      }),
    ]);

  return {
    total,
    completed,
    inProgress,
    notStarted,
    recentlyCompleted,
    categoryBreakdown: getCategoryBreakdown(allRecords),
    monthlyCompletions: getMonthlyCompletions(allRecords),
  };
}
