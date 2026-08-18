import { describe, expect, it } from "vitest";
import { isbnSchema, normalizeIsbn } from "@/lib/isbn";

describe("normalizeIsbn", () => {
  it("ハイフンと空白を除去する", () => {
    expect(normalizeIsbn("978-4-87311-948-5")).toBe("9784873119485");
    expect(normalizeIsbn(" 4 87311 948 6 ")).toBe("4873119486");
  });
});

describe("isbnSchema", () => {
  it("ハイフン付きの13桁ISBNを受け入れる", () => {
    const result = isbnSchema.safeParse("978-4-87311-948-5");
    expect(result.success).toBe(true);
    expect(result.data).toBe("9784873119485");
  });

  it("10桁ISBNを受け入れる", () => {
    const result = isbnSchema.safeParse("4873119486");
    expect(result.success).toBe(true);
  });

  it("桁数が不正な場合はエラーになる", () => {
    const result = isbnSchema.safeParse("12345");
    expect(result.success).toBe(false);
  });

  it("数字以外を含む場合はエラーになる", () => {
    const result = isbnSchema.safeParse("978487311948X");
    expect(result.success).toBe(false);
  });
});
