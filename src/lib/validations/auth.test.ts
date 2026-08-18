import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

describe("registerSchema", () => {
  it("有効な入力を受け入れる", () => {
    const result = registerSchema.safeParse({
      name: "デモユーザー",
      email: "demo@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("メールアドレスの形式が不正な場合はエラーになる", () => {
    const result = registerSchema.safeParse({
      name: "デモユーザー",
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("パスワードが8文字未満の場合はエラーになる", () => {
    const result = registerSchema.safeParse({
      name: "デモユーザー",
      email: "demo@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("名前が空の場合はエラーになる", () => {
    const result = registerSchema.safeParse({
      name: "",
      email: "demo@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("有効な入力を受け入れる", () => {
    const result = loginSchema.safeParse({
      email: "demo@example.com",
      password: "anything",
    });
    expect(result.success).toBe(true);
  });

  it("パスワードが空の場合はエラーになる", () => {
    const result = loginSchema.safeParse({
      email: "demo@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
