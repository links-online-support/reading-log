"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useMounted } from "@/hooks/use-mounted";

type MonthlyCompletion = { month: string; count: number };

const chartConfig = {
  count: { label: "読了数", color: "#16a34a" },
} satisfies ChartConfig;

function formatMonthLabel(month: string) {
  const [year, monthNum] = month.split("-");
  return `${year.slice(2)}/${Number(monthNum)}`;
}

export function MonthlyCompletionsChart({
  data,
}: {
  data: MonthlyCompletion[];
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
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
