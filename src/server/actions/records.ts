"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordSchema } from "@/lib/validations/record";
import { DEMO_ACCOUNT_MESSAGE, isDemoAccount } from "@/lib/demo";

type ActionState = { error: string | null };

function parseTagNames(raw: string | undefined) {
  if (!raw) return [];
  return [
    ...new Set(
      raw
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    ),
  ];
}

async function syncTags(userId: string, recordId: string, tagNames: string[]) {
  await db.recordTag.deleteMany({ where: { recordId } });

  for (const name of tagNames) {
    const tag = await db.tag.upsert({
      where: { userId_name: { userId, name } },
      update: {},
      create: { userId, name },
    });
    await db.recordTag.create({ data: { recordId, tagId: tag.id } });
  }
}

function extractInput(formData: FormData) {
  return recordSchema.safeParse({
    title: formData.get("title"),
    author: formData.get("author"),
    status: formData.get("status"),
    categoryId: formData.get("categoryId"),
    rating: formData.get("rating") || undefined,
    note: formData.get("note"),
    startedAt: formData.get("startedAt"),
    finishedAt: formData.get("finishedAt"),
    tags: formData.get("tags"),
  });
}

async function assertOwnedCategory(userId: string, categoryId: string) {
  if (!categoryId) return true;
  const category = await db.category.findFirst({
    where: { id: categoryId, userId },
    select: { id: true },
  });
  return !!category;
}

export async function createRecordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "ログインが必要です" };
  }
  if (isDemoAccount(session.user.email)) {
    return { error: DEMO_ACCOUNT_MESSAGE };
  }

  const parsed = extractInput(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { tags, categoryId, rating, startedAt, finishedAt, ...rest } =
    parsed.data;

  if (categoryId && !(await assertOwnedCategory(session.user.id, categoryId))) {
    return { error: "無効なカテゴリです" };
  }

  const record = await db.record.create({
    data: {
      ...rest,
      userId: session.user.id,
      categoryId: categoryId || null,
      rating: rating === "" || rating === undefined ? null : rating,
      startedAt: startedAt ? new Date(startedAt) : null,
      finishedAt: finishedAt ? new Date(finishedAt) : null,
    },
  });

  await syncTags(session.user.id, record.id, parseTagNames(tags));

  revalidatePath("/records");
  revalidatePath("/dashboard");
  redirect("/records");
}

export async function updateRecordAction(
  recordId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "ログインが必要です" };
  }
  if (isDemoAccount(session.user.email)) {
    return { error: DEMO_ACCOUNT_MESSAGE };
  }

  const existing = await db.record.findFirst({
    where: { id: recordId, userId: session.user.id },
  });
  if (!existing) {
    return { error: "記録が見つかりません" };
  }

  const parsed = extractInput(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { tags, categoryId, rating, startedAt, finishedAt, ...rest } =
    parsed.data;

  if (categoryId && !(await assertOwnedCategory(session.user.id, categoryId))) {
    return { error: "無効なカテゴリです" };
  }

  await db.record.update({
    where: { id: recordId },
    data: {
      ...rest,
      categoryId: categoryId || null,
      rating: rating === "" || rating === undefined ? null : rating,
      startedAt: startedAt ? new Date(startedAt) : null,
      finishedAt: finishedAt ? new Date(finishedAt) : null,
    },
  });

  await syncTags(session.user.id, recordId, parseTagNames(tags));

  revalidatePath("/records");
  revalidatePath("/dashboard");
  redirect("/records");
}

export async function deleteRecordAction(
  recordId: string,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "ログインが必要です" };
  }
  if (isDemoAccount(session.user.email)) {
    return { error: DEMO_ACCOUNT_MESSAGE };
  }

  await db.record.deleteMany({
    where: { id: recordId, userId: session.user.id },
  });

  revalidatePath("/records");
  revalidatePath("/dashboard");
  return { error: null };
}
