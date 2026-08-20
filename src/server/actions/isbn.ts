"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { isbnSchema } from "@/lib/isbn";
import { isDemoAccount } from "@/lib/demo";
import { checkRateLimit } from "@/lib/rate-limit";

const ISBN_LOOKUP_RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 30 };

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
  if (isDemoAccount(session.user.email)) {
    return { data: null, error: "デモアカウントでは書籍情報の取得はできません" };
  }

  const { limited } = await checkRateLimit(
    session.user.id,
    "isbn-lookup",
    ISBN_LOOKUP_RATE_LIMIT,
  );
  if (limited) {
    return { data: null, error: "検索回数が多すぎます。しばらく時間をおいて再度お試しください" };
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
