"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteRecordAction } from "@/server/actions/records";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteRecordDialog({
  recordId,
  title,
}: {
  recordId: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteRecordAction(recordId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("記録を削除しました");
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="ghost" size="sm" />}>
        削除
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>「{title}」を削除しますか？</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          この操作は取り消せません。
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "削除中..." : "削除する"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
