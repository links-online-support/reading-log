import { auth } from "@/lib/auth";
import { getCategories } from "@/server/queries/categories";
import { createRecordAction } from "@/server/actions/records";
import { RecordForm } from "@/components/features/record-form";

export default async function NewRecordPage() {
  const session = await auth();
  const categories = await getCategories(session!.user.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">新しい記録を追加</h1>
        <p className="text-sm text-muted-foreground">
          読んだ本や学習した内容を記録しましょう
        </p>
      </div>
      <RecordForm action={createRecordAction} categories={categories} />
    </div>
  );
}
