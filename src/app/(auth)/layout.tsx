import { ThemeToggle } from "@/components/theme-toggle";
import { SiteFooter } from "@/components/features/site-footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      {children}
      <SiteFooter />
    </div>
  );
}
