import Link from "next/link";
import type { RecordWithRelations } from "@/types/record";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteRecordDialog } from "@/components/features/delete-record-dialog";

const STATUS_LABEL: Record<string, string> = {
  NOT_STARTED: "未着手",
  IN_PROGRESS: "進行中",
  COMPLETED: "完了",
};

const STATUS_VARIANT: Record<string, "outline" | "secondary" | "default"> = {
  NOT_STARTED: "outline",
  IN_PROGRESS: "secondary",
  COMPLETED: "default",
};

export function RecordTable({ records }: { records: RecordWithRelations[] }) {
  if (records.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        条件に一致する記録がありません
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>タイトル</TableHead>
          <TableHead>ステータス</TableHead>
          <TableHead>カテゴリ</TableHead>
          <TableHead>タグ</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>
              <Link href={`/records/${record.id}/edit`} className="font-medium hover:underline">
                {record.title}
              </Link>
              {record.author && (
                <p className="text-xs text-muted-foreground">{record.author}</p>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[record.status]}>
                {STATUS_LABEL[record.status]}
              </Badge>
            </TableCell>
            <TableCell>{record.category?.name ?? "-"}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {record.tags.map(({ tag }) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  render={<Link href={`/records/${record.id}/edit`} />}
                  variant="outline"
                  size="sm"
                >
                  編集
                </Button>
                <DeleteRecordDialog recordId={record.id} title={record.title} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
