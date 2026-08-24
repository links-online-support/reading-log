import { headers } from "next/headers";
import { db } from "@/lib/db";

export async function getClientIp() {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return headerList.get("x-real-ip") ?? "unknown";
}

type RateLimitOptions = {
  windowMs: number;
  max: number;
};

// keyとkindの組み合わせで直近windowMs以内のヒット数を数え、上限を超えていなければ
// 今回のヒットを記録する。カウントと記録の間に別リクエストが割り込む競合は
// あり得るが、上限を多少超える程度に留まるためポートフォリオ用途では許容する。
export async function checkRateLimit(
  key: string,
  kind: string,
  { windowMs, max }: RateLimitOptions,
) {
  const since = new Date(Date.now() - windowMs);
  const count = await db.rateLimitHit.count({
    where: { key, kind, createdAt: { gte: since } },
  });
  if (count >= max) {
    return { limited: true as const };
  }
  await db.rateLimitHit.create({ data: { key, kind } });
  return { limited: false as const };
}
