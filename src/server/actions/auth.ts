"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validations/auth";
import {
  getClientIp,
  isRegistrationRateLimited,
  recordRegistrationAttempt,
} from "@/lib/registration-guard";

type ActionState = { error: string | null };

export async function registerAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // ボット対策のハニーポット。実際の利用者には見えないフィールドで、
  // 値が入っていれば機械的な入力とみなして拒否する。
  if (formData.get("website")) {
    return { error: "登録に失敗しました" };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const ip = await getClientIp();
  if (await isRegistrationRateLimited(ip)) {
    return { error: "登録試行が多すぎます。しばらく時間をおいて再度お試しください" };
  }
  await recordRegistrationAttempt(ip);

  const existingUser = await db.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existingUser) {
    return { error: "このメールアドレスは既に登録されています" };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  try {
    await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "このメールアドレスは既に登録されています" };
    }
    throw error;
  }

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: "/dashboard",
  });

  return { error: null };
}

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "メールアドレスまたはパスワードが正しくありません" };
    }
    throw error;
  }
}
