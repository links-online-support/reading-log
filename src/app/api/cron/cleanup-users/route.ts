import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { DEMO_ACCOUNT_EMAIL } from "@/lib/demo";

const USER_RETENTION_MS = 3 * 24 * 60 * 60 * 1000;
const REGISTRATION_ATTEMPT_RETENTION_MS = 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { count: deletedUsers } = await db.user.deleteMany({
    where: {
      email: { not: DEMO_ACCOUNT_EMAIL },
      createdAt: { lt: new Date(Date.now() - USER_RETENTION_MS) },
    },
  });

  const { count: deletedAttempts } = await db.registrationAttempt.deleteMany({
    where: {
      createdAt: { lt: new Date(Date.now() - REGISTRATION_ATTEMPT_RETENTION_MS) },
    },
  });

  return NextResponse.json({ deletedUsers, deletedAttempts });
}
