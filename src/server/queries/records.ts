import { db } from "@/lib/db";
import type { RecordFilters } from "@/types/record";

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
    orderBy: { updatedAt: "desc" },
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

export async function getDashboardStats(userId: string) {
  const [total, completed, inProgress, notStarted, recentlyCompleted] =
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
    ]);

  return { total, completed, inProgress, notStarted, recentlyCompleted };
}
