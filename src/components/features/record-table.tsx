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
import { RatingStars } from "@/components/features/rating-stars";
import {
  STATUS_BADGE_CLASS,
  STATUS_ICON,
  STATUS_LABEL,
} from "@/lib/record-status";
import { getCategoryBadgeClass } from "@/lib/category-colors";
import { cn } from "@/lib/utils";

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
          <TableHead className="text-center">ステータス</TableHead>
          <TableHead className="text-center">カテゴリ</TableHead>
          <TableHead>タグ</TableHead>
          <TableHead className="text-center">評価</TableHead>
          <TableHead className="text-center">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => {
          const StatusIcon = STATUS_ICON[record.status];
          return (
          <TableRow key={record.id}>
            <TableCell>
              <Link href={`/records/${record.id}/edit`} className="font-medium hover:underline">
                {record.title}
              </Link>
              {record.author && (
                <p className="text-xs text-muted-foreground">{record.author}</p>
              )}
            </TableCell>
            <TableCell className="text-center">
              <Badge
                className={cn(
                  "w-20 justify-center",
                  STATUS_BADGE_CLASS[record.status],
                )}
              >
                <StatusIcon />
                {STATUS_LABEL[record.status]}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              {record.category ? (
                <Badge
                  className={cn(
                    "w-24 justify-center",
                    getCategoryBadgeClass(record.category.color),
                  )}
                >
                  {record.category.name}
                </Badge>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {record.tags.map(({ tag }) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center">
                <RatingStars value={record.rating} />
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center gap-2">
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
          );
        })}
      </TableBody>
    </Table>
  );
}
