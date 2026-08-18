import Link from "next/link";
import { Info, LayoutDashboard, ListChecks, LogOut } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { isDemoAccount } from "@/lib/demo";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 py-4">
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link href="/dashboard" className="font-semibold max-sm:hidden">
              reading-log
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <LayoutDashboard className="size-4" />
              <span className="max-sm:hidden">ダッシュボード</span>
            </Link>
            <Link
              href="/records"
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <ListChecks className="size-4" />
              <span className="max-sm:hidden">記録一覧</span>
            </Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground max-sm:hidden">
              {session?.user?.name}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                <LogOut className="size-4" />
                <span className="max-sm:hidden">ログアウト</span>
              </Button>
            </form>
          </div>
        </div>
      </header>
      {isDemoAccount(session?.user?.email) && (
        <div className="border-b bg-muted/50">
          <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
            <Info className="size-4 shrink-0" />
            デモアカウントは閲覧専用です。データの作成・編集・削除はできません。
          </div>
        </div>
      )}
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
