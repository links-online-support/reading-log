import { db } from "@/lib/db";

export async function getCategories(userId: string) {
  return db.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}
