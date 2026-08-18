import Link from "next/link";
import { Library, type LucideIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { getDashboardStats } from "@/server/queries/records";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryBreakdownChart } from "@/components/features/category-breakdown-chart";
import { MonthlyActivityChart } from "@/components/features/monthly-activity-chart";
import { RatingStars } from "@/components/features/rating-stars";
import {
  STATUS_ACCENT_CLASS,
  STATUS_ICON,
  STATUS_LABEL,
} from "@/lib/record-status";
import { getCategoryBadgeClass } from "@/lib/category-colors";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats(session!.user.id);
  const completionRate =
    stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">ダッシュボード</h1>
        <p className="text-sm text-muted-foreground">
          読書の進捗状況をひと目で確認できます
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Library} label="登録数" value={stats.total} />
        <StatCard
          icon={STATUS_ICON.NOT_STARTED}
          label="未着手"
          value={stats.notStarted}
          accentClass={STATUS_ACCENT_CLASS.NOT_STARTED}
        />
        <StatCard
          icon={STATUS_ICON.IN_PROGRESS}
          label="進行中"
          value={stats.inProgress}
          accentClass={STATUS_ACCENT_CLASS.IN_PROGRESS}
        />
        <StatCard
          icon={STATUS_ICON.COMPLETED}
          label="完了"
          value={stats.completed}
          accentClass={STATUS_ACCENT_CLASS.COMPLETED}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>完了率</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <span className="text-sm font-medium">{completionRate}%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>カテゴリ別の記録数</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryBreakdownChart data={stats.categoryBreakdown} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>月別 登録数/完了数</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyActivityChart data={stats.monthlyActivity} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>最近完了した記録</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentlyCompleted.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              まだ完了した記録がありません
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {stats.recentlyCompleted.map((record) => (
                <li
                  key={record.id}
                  className="flex items-center justify-between border-b pb-2 last:border-none"
                >
                  <div>
                    <Link
                      href={`/records/${record.id}/edit`}
                      className="block font-medium hover:underline"
                    >
                      {record.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-2">
                      {record.category && (
                        <Badge className={getCategoryBadgeClass(record.category.color)}>
                          {record.category.name}
                        </Badge>
                      )}
                      <RatingStars value={record.rating} />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={cn(
                        "flex items-center gap-1.5 text-sm",
                        STATUS_ACCENT_CLASS[record.status],
                      )}
                    >
                      <STATUS_ICON.COMPLETED className="size-4" />
                      {STATUS_LABEL[record.status]}
                    </span>
                    {record.finishedAt && (
                      <span className="text-xs text-muted-foreground">
                        {record.finishedAt.toLocaleDateString("ja-JP")}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accentClass,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  accentClass?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle
          className={cn(
            "flex items-center gap-1.5 text-sm font-normal",
            accentClass ?? "text-muted-foreground",
          )}
        >
          <Icon className="size-4" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn("text-3xl font-semibold", accentClass)}>{value}</p>
      </CardContent>
    </Card>
  );
}
