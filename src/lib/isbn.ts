import { z } from "zod";

export function normalizeIsbn(raw: string) {
  return raw.replace(/[-\s]/g, "");
}

export const isbnSchema = z
  .string()
  .transform(normalizeIsbn)
  .pipe(
    z
      .string()
      .regex(/^(\d{10}|\d{13})$/, "ISBNは10桁または13桁の数字で入力してください"),
  );
