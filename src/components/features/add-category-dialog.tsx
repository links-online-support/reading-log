"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCategoryAction } from "@/server/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CATEGORY_COLORS,
  CATEGORY_SWATCH_CLASS,
  DEFAULT_CATEGORY_COLOR,
  type CategoryColor,
} from "@/lib/category-colors";
import { cn } from "@/lib/utils";

export function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState<CategoryColor>(DEFAULT_CATEGORY_COLOR);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createCategoryAction(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("カテゴリを追加しました");
      formRef.current?.reset();
      setColor(DEFAULT_CATEGORY_COLOR);
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}>
        + 新しいカテゴリ
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>カテゴリを追加</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="category-name">カテゴリ名</Label>
            <Input id="category-name" name="name" required maxLength={50} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>色</Label>
            <input type="hidden" name="color" value={color} />
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-label={option}
                  onClick={() => setColor(option)}
                  className={cn(
                    "size-6 rounded-full ring-offset-2 ring-offset-background transition-all",
                    CATEGORY_SWATCH_CLASS[option],
                    color === option
                      ? "ring-2 ring-foreground"
                      : "opacity-60 hover:opacity-100",
                  )}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "追加中..." : "追加する"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
