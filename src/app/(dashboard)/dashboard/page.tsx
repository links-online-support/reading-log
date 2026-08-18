import { Circle, CircleCheck, CircleDashed, Library } from "lucide-react";
import { auth } from "@/lib/auth";
import { getDashboardStats } from "@/server/queries/records";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUS_LABEL: Record<string, string> = {
  NOT_STARTED: "未着手",
  IN_PROGRESS: "進行中",
  COMPLETED: "完了",
};

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
          学習の進捗状況をひと目で確認できます
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Library} label="登録数" value={stats.total} />
        <StatCard icon={CircleCheck} label="完了" value={stats.completed} />
        <StatCard icon={CircleDashed} label="進行中" value={stats.inProgress} />
        <StatCard icon={Circle} label="未着手" value={stats.notStarted} />
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
                    <p className="font-medium">{record.title}</p>
                    {record.category && (
                      <Badge variant="secondary" className="mt-1">
                        {record.category.name}
                      </Badge>
                    )}
                  </div>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CircleCheck className="size-4" />
                    {STATUS_LABEL[record.status]}
                  </span>
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
}: {
  icon: typeof Circle;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1.5 text-sm font-normal text-muted-foreground">
          <Icon className="size-4" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
