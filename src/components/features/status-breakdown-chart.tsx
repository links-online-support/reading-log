"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useMounted } from "@/hooks/use-mounted";

type StatusBreakdown = {
  status: string;
  label: string;
  count: number;
  color: string;
};

const chartConfig = {
  count: { label: "件数" },
  未着手: { label: "未着手" },
  進行中: { label: "進行中" },
  完了: { label: "完了" },
} satisfies ChartConfig;

export function StatusBreakdownChart({ data }: { data: StatusBreakdown[] }) {
  const mounted = useMounted();
  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        表示できるデータがありません
      </p>
    );
  }

  if (!mounted) {
    return <div className="h-64 w-full animate-pulse rounded-md bg-muted" />;
  }

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="label" />} />
        <Pie
          data={data}
          dataKey="count"
          nameKey="label"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.status} fill={entry.color} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="label" />} />
      </PieChart>
    </ChartContainer>
  );
}
