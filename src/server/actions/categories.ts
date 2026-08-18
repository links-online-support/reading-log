"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { categorySchema } from "@/lib/validations/record";

type ActionResult = { data: { id: string } | null; error: string | null };

export async function createCategoryAction(
  formData: FormData,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { data: null, error: "ログインが必要です" };
  }

  const parsed = categorySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { data: null, error: parsed.error.issues[0].message };
  }

  const category = await db.category.upsert({
    where: {
      userId_name: { userId: session.user.id, name: parsed.data.name },
    },
    update: {},
    create: { userId: session.user.id, name: parsed.data.name },
  });

  revalidatePath("/records");
  return { data: { id: category.id }, error: null };
}
