import { headers } from "next/headers";
import { db } from "@/lib/db";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

export async function getClientIp() {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return headerList.get("x-real-ip") ?? "unknown";
}

export async function isRegistrationRateLimited(ip: string) {
  const count = await db.registrationAttempt.count({
    where: { ip, createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) } },
  });
  return count >= RATE_LIMIT_MAX_ATTEMPTS;
}

export async function recordRegistrationAttempt(ip: string) {
  await db.registrationAttempt.create({ data: { ip } });
}
