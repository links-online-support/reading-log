import Link from "next/link";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getRecords } from "@/server/queries/records";
import { getCategories } from "@/server/queries/categories";
import { Button } from "@/components/ui/button";
import { RecordFilters } from "@/components/features/record-filters";
import { RecordTable } from "@/components/features/record-table";

type SearchParams = {
  query?: string;
  status?: string;
  categoryId?: string;
  sort?: string;
};

const searchParamsSchema = z.object({
  query: z.string().max(200).optional(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]).optional(),
  categoryId: z.string().optional(),
  sort: z.enum(["updatedAt", "title", "finishedAt", "rating"]).optional(),
});

export default async function RecordsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  const rawParams = await searchParams;
  const parsedParams = searchParamsSchema.safeParse(rawParams);
  const params = parsedParams.success ? parsedParams.data : {};

  const [records, categories] = await Promise.all([
    getRecords(session!.user.id, params),
    getCategories(session!.user.id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">記録一覧</h1>
          <p className="text-sm text-muted-foreground">
            登録した本を検索・絞り込みできます
          </p>
        </div>
        <Button render={<Link href="/records/new" />}>+ 新しい記録</Button>
      </div>

      <RecordFilters categories={categories} />
      <RecordTable records={records} />
    </div>
  );
}
