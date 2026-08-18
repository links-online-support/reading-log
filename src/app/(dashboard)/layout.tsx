import Link from "next/link";
import { Info, LogOut } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavLinks } from "@/components/features/nav-links";
import { SiteFooter } from "@/components/features/site-footer";
import { isDemoAccount } from "@/lib/demo";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 py-4">
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/dashboard" className="mr-1 font-semibold max-sm:hidden">
              読書ログ
            </Link>
            <NavLinks />
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
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
