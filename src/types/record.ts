import type { Prisma } from "@prisma/client";

export type RecordWithRelations = Prisma.RecordGetPayload<{
  include: { category: true; tags: { include: { tag: true } } };
}>;

export type RecordFilters = {
  query?: string;
  status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  categoryId?: string;
  sort?: "updatedAt" | "title" | "finishedAt" | "rating";
};
