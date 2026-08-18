import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getRecordById } from "@/server/queries/records";
import { getCategories } from "@/server/queries/categories";
import { updateRecordAction } from "@/server/actions/records";
import { RecordForm } from "@/components/features/record-form";

export default async function EditRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const [record, categories] = await Promise.all([
    getRecordById(session!.user.id, id),
    getCategories(session!.user.id),
  ]);

  if (!record) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">記録を編集</h1>
      <RecordForm
        action={updateRecordAction.bind(null, record.id)}
        categories={categories}
        record={record}
      />
    </div>
  );
}
