"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { categorySchema } from "@/lib/validations/record";
import { DEMO_ACCOUNT_MESSAGE, isDemoAccount } from "@/lib/demo";

type ActionResult = { data: { id: string } | null; error: string | null };

export async function createCategoryAction(
  formData: FormData,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { data: null, error: "ログインが必要です" };
  }
  if (isDemoAccount(session.user.email)) {
    return { data: null, error: DEMO_ACCOUNT_MESSAGE };
  }

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    color: formData.get("color") || undefined,
  });
  if (!parsed.success) {
    return { data: null, error: parsed.error.issues[0].message };
  }

  const category = await db.category.upsert({
    where: {
      userId_name: { userId: session.user.id, name: parsed.data.name },
    },
    update: { color: parsed.data.color },
    create: {
      userId: session.user.id,
      name: parsed.data.name,
      color: parsed.data.color,
    },
  });

  revalidatePath("/records");
  return { data: { id: category.id }, error: null };
}
