"use client";

import type { BuiltMapLine } from "lyrics-typing-engine";
import { Bar, ComposedChart, Line, XAxis, YAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartMode } from "@/features/map/search-params";

const chartConfig = {
  roma: {
    label: "Roma KPM",
    color: "var(--color-primary)",
  },
  kana: {
    label: "Kana KPM",
    color: "var(--color-muted-foreground)",
  },
  notes: {
    label: "打鍵数",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

interface KpmLineChartProps {
  mapJson: BuiltMapLine | BuiltMapLine[] | null | undefined;
  mode: ChartMode;
}

export function KpmLineChart({ mapJson, mode }: KpmLineChartProps) {

  if (!mapJson) return null;

  const lines = Array.isArray(mapJson) ? mapJson : [mapJson];
  if (lines.length === 0) return null;

  const data = lines
    .filter((line) => line.kpm.roma !== 0 || line.kpm.kana !== 0)
    .map((line, index) => ({
      index,
      roma: line.kpm.roma,
      kana: line.kpm.kana,
      notesRoma: line.notes.roma,
      notesKana: line.notes.kana,
    }));

  const notesKey = mode === "kana" ? "notesKana" : "notesRoma";

  return (
    <ChartContainer config={chartConfig} className="min-h-[60px] w-full">
        <ComposedChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <XAxis dataKey="index" label={{ value: "行", position: "insideBottomRight", offset: 0, fontSize: 10 }} tick={false} />
          <YAxis yAxisId="kpm" domain={[0, 1000]} allowDataOverflow />
          <YAxis yAxisId="notes" orientation="right" hide />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar yAxisId="notes" dataKey={notesKey} fill="var(--color-primary)" opacity={0.15} isAnimationActive={false} />
          {(mode === "both" || mode === "roma") && (
            <Line yAxisId="kpm" type="monotone" dataKey="roma" stroke="var(--color-primary)" dot={{ r: 2 }} strokeWidth={1.5} isAnimationActive={false} />
          )}
          {(mode === "both" || mode === "kana") && (
            <Line
              yAxisId="kpm"
              type="monotone"
              dataKey="kana"
              stroke="var(--color-muted-foreground)"
              dot={{ r: 2 }}
              strokeWidth={1.5}
              strokeDasharray="4 2"
              isAnimationActive={false}
            />
          )}
        </ComposedChart>
    </ChartContainer>
  );
}
