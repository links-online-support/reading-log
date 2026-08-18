"use client";

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { getCategoryChartColor } from "@/lib/category-colors";
import { useMounted } from "@/hooks/use-mounted";

type CategoryBreakdown = { name: string; color: string; count: number };

const chartConfig = {
  count: { label: "記録数" },
} satisfies ChartConfig;

export function CategoryBreakdownChart({
  data,
}: {
  data: CategoryBreakdown[];
}) {
  const mounted = useMounted();

  if (data.length === 0) {
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
      <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
        <XAxis type="number" allowDecimals={false} hide />
        <YAxis
          type="category"
          dataKey="name"
          width={80}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", opacity: 0.4 }}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="count" radius={4}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={getCategoryChartColor(entry.color)} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
