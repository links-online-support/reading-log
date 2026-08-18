import { describe, expect, it } from "vitest";
import { categorySchema, recordSchema } from "@/lib/validations/record";

describe("recordSchema", () => {
  const validInput = {
    title: "リーダブルコード",
    author: "Dustin Boswell",
    status: "IN_PROGRESS" as const,
    categoryId: "",
    rating: "",
    note: "",
    startedAt: "",
    finishedAt: "",
    tags: "",
  };

  it("有効な入力を受け入れる", () => {
    const result = recordSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("タイトルが空の場合はエラーになる", () => {
    const result = recordSchema.safeParse({ ...validInput, title: "" });
    expect(result.success).toBe(false);
  });

  it("不正なステータスの場合はエラーになる", () => {
    const result = recordSchema.safeParse({
      ...validInput,
      status: "UNKNOWN",
    });
    expect(result.success).toBe(false);
  });

  it("評価は1〜5の範囲外だとエラーになる", () => {
    const tooLow = recordSchema.safeParse({ ...validInput, rating: "0" });
    const tooHigh = recordSchema.safeParse({ ...validInput, rating: "6" });
    expect(tooLow.success).toBe(false);
    expect(tooHigh.success).toBe(false);
  });

  it("評価は文字列の数値を数値に変換する", () => {
    const result = recordSchema.safeParse({ ...validInput, rating: "4" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.rating).toBe(4);
    }
  });

  it("読んだページ数が総ページ数を超える場合はエラーになる", () => {
    const result = recordSchema.safeParse({
      ...validInput,
      currentPage: "300",
      totalPages: "200",
    });
    expect(result.success).toBe(false);
  });

  it("読んだページ数・総ページ数を正しく数値に変換する", () => {
    const result = recordSchema.safeParse({
      ...validInput,
      currentPage: "150",
      totalPages: "300",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.currentPage).toBe(150);
      expect(result.data.totalPages).toBe(300);
    }
  });
});

describe("categorySchema", () => {
  it("有効なカテゴリ名を受け入れる", () => {
    expect(categorySchema.safeParse({ name: "技術書" }).success).toBe(true);
  });

  it("空のカテゴリ名はエラーになる", () => {
    expect(categorySchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("50文字を超えるカテゴリ名はエラーになる", () => {
    expect(
      categorySchema.safeParse({ name: "あ".repeat(51) }).success,
    ).toBe(false);
  });
});
