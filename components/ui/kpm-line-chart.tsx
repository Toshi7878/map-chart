"use client";

import type { BuiltMapLine } from "lyrics-typing-engine";
import { useState } from "react";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const chartConfig = {
  roma: {
    label: "Roma KPM",
    color: "var(--color-primary)",
  },
  kana: {
    label: "Kana KPM",
    color: "var(--color-muted-foreground)",
  },
} satisfies ChartConfig;

type DisplayMode = "both" | "roma" | "kana";

interface KpmLineChartProps {
  mapJson: BuiltMapLine | BuiltMapLine[] | null | undefined;
}

export function KpmLineChart({ mapJson }: KpmLineChartProps) {
  const [mode, setMode] = useState<DisplayMode>("both");

  if (!mapJson) return null;

  const lines = Array.isArray(mapJson) ? mapJson : [mapJson];
  if (lines.length === 0) return null;

  const data = lines
    .filter((line) => line.kpm.roma !== 0 || line.kpm.kana !== 0)
    .map((line, index) => ({
      index,
      roma: line.kpm.roma,
      kana: line.kpm.kana,
    }));

  return (
    <div className="flex flex-col gap-2">
      <RadioGroup value={mode} onValueChange={(v) => setMode(v as DisplayMode)} className="flex gap-4">
        <div className="flex items-center gap-1.5">
          <RadioGroupItem value="both" id="both" />
          <Label htmlFor="both">Both</Label>
        </div>
        <div className="flex items-center gap-1.5">
          <RadioGroupItem value="roma" id="roma" />
          <Label htmlFor="roma">Roma</Label>
        </div>
        <div className="flex items-center gap-1.5">
          <RadioGroupItem value="kana" id="kana" />
          <Label htmlFor="kana">Kana</Label>
        </div>
      </RadioGroup>
      <ChartContainer config={chartConfig} className="min-h-[60px] w-full">
        <LineChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <XAxis dataKey="index" hide />
          <YAxis domain={[0, 1000]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          {(mode === "both" || mode === "roma") && (
            <Line type="monotone" dataKey="roma" stroke="var(--color-primary)" dot={false} strokeWidth={1.5} />
          )}
          {(mode === "both" || mode === "kana") && (
            <Line
              type="monotone"
              dataKey="kana"
              stroke="var(--color-muted-foreground)"
              dot={false}
              strokeWidth={1.5}
              strokeDasharray="4 2"
            />
          )}
        </LineChart>
      </ChartContainer>
    </div>
  );
}
