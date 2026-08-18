import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecordTable } from "@/components/features/record-table";
import type { RecordWithRelations } from "@/types/record";

vi.mock("@/server/actions/records", () => ({
  deleteRecordAction: vi.fn(),
}));

function buildRecord(
  overrides: Partial<RecordWithRelations> = {},
): RecordWithRelations {
  return {
    id: "record-1",
    title: "リーダブルコード",
    author: "Dustin Boswell",
    status: "COMPLETED",
    rating: 5,
    note: null,
    startedAt: null,
    finishedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user-1",
    categoryId: "category-1",
    category: {
      id: "category-1",
      name: "技術書",
      color: "blue",
      userId: "user-1",
    },
    tags: [
      {
        recordId: "record-1",
        tagId: "tag-1",
        tag: { id: "tag-1", name: "JavaScript", userId: "user-1" },
      },
    ],
    ...overrides,
  };
}

describe("RecordTable", () => {
  it("記録が0件のとき、空メッセージを表示する", () => {
    render(<RecordTable records={[]} />);
    expect(
      screen.getByText("条件に一致する記録がありません"),
    ).toBeInTheDocument();
  });

  it("記録のタイトル・ステータス・カテゴリ・タグを表示する", () => {
    render(<RecordTable records={[buildRecord()]} />);

    expect(screen.getByText("リーダブルコード")).toBeInTheDocument();
    expect(screen.getByText("完了")).toBeInTheDocument();
    expect(screen.getByText("技術書")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });
});
