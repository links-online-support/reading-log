"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { isbnSchema } from "@/lib/isbn";

const openBdSummarySchema = z.object({
  title: z.string(),
  author: z.string().nullable().optional(),
});

const openBdItemSchema = z
  .object({
    summary: openBdSummarySchema,
  })
  .nullable();

type IsbnLookupResult = {
  data: { title: string; author: string | null } | null;
  error: string | null;
};

export async function lookupIsbnAction(rawIsbn: string): Promise<IsbnLookupResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { data: null, error: "ログインが必要です" };
  }

  const parsedIsbn = isbnSchema.safeParse(rawIsbn);
  if (!parsedIsbn.success) {
    return { data: null, error: parsedIsbn.error.issues[0].message };
  }

  let response: Response;
  try {
    response = await fetch(
      `https://api.openbd.jp/v1/get?isbn=${encodeURIComponent(parsedIsbn.data)}`,
    );
  } catch {
    return { data: null, error: "書誌情報の取得に失敗しました" };
  }

  if (!response.ok) {
    return { data: null, error: "書誌情報の取得に失敗しました" };
  }

  const body: unknown = await response.json();
  const parsedBody = z.array(openBdItemSchema).nonempty().safeParse(body);
  const item = parsedBody.success ? parsedBody.data[0] : null;

  if (!item) {
    return { data: null, error: "該当する書籍が見つかりませんでした" };
  }

  return {
    data: {
      title: item.summary.title,
      author: item.summary.author ?? null,
    },
    error: null,
  };
}
