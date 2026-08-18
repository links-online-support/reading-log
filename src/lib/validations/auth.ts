import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "名前を入力してください").max(100),
  email: z.email("メールアドレスの形式が正しくありません").max(254),
  password: z.string().min(8, "パスワードは8文字以上で入力してください").max(100),
});

export const loginSchema = z.object({
  email: z.email("メールアドレスの形式が正しくありません").max(254),
  password: z.string().min(1, "パスワードを入力してください").max(100),
});
