"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useMounted } from "@/hooks/use-mounted";

type MonthlyActivity = { month: string; registered: number; completed: number };

const chartConfig = {
  registered: { label: "登録数", color: "#a1a1aa" },
  completed: { label: "完了数", color: "#16a34a" },
} satisfies ChartConfig;

function formatMonthLabel(month: string) {
  const [year, monthNum] = month.split("-");
  return `${year.slice(2)}/${Number(monthNum)}`;
}

export function MonthlyActivityChart({ data }: { data: MonthlyActivity[] }) {
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

  const chartData = data.map((item) => ({
    ...item,
    label: formatMonthLabel(item.month),
  }));

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <BarChart data={chartData} margin={{ left: -20 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", opacity: 0.4 }}
          content={<ChartTooltipContent />}
        />
        <Bar dataKey="registered" fill="var(--color-registered)" radius={4} />
        <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
}
