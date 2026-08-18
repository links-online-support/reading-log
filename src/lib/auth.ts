import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

// ユーザーが存在しない場合でもbcrypt.compareを実行し、
// 応答時間の差からメールアドレスの登録有無が推測されない(タイミング攻撃対策)ようにする。
const DUMMY_PASSWORD_HASH =
  "$2a$10$CwTycUXWue0Thq9StjUM0uJ8i8mCw/6FhTt2vwYcNZ//Kx4qLj0Zi";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        });

        const isValidPassword = await bcrypt.compare(
          parsed.data.password,
          user?.password ?? DUMMY_PASSWORD_HASH,
        );
        if (!user || !isValidPassword) {
          return null;
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
});
