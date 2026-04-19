"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MAP_SORT_OPTIONS } from "@/validators/map/list";
import { type ChartMode, useMapListChartModeQueryState, useMapListSortQueryState } from "./search-params";

const SORT_LABELS: Record<(typeof MAP_SORT_OPTIONS)[number], string> = {
  publishedAt: "公開日",
  difficulty: "難易度",
  "ranking-count": "ランキング数",
  "ranking-register": "ランキング登録日",
  "like-count": "いいね数",
  duration: "曲の長さ",
  like: "いいね",
  bookmark: "ブックマーク",
  random: "ランダム",
};

const CHART_MODE_LABELS: Record<ChartMode, string> = {
  both: "Both",
  roma: "Roma",
  kana: "Kana",
};

export function MapListSort() {
  const [sort, setSort] = useMapListSortQueryState();
  const [chartMode, setChartMode] = useMapListChartModeQueryState();

  return (
    <div className="flex items-center gap-4">
      <RadioGroup value={chartMode} onValueChange={(v) => setChartMode(v as ChartMode)} className="flex gap-3">
        {(["both", "roma", "kana"] as const).map((mode) => (
          <div key={mode} className="flex items-center gap-1.5">
            <RadioGroupItem value={mode} id={`chart-${mode}`} />
            <Label htmlFor={`chart-${mode}`}>{CHART_MODE_LABELS[mode]}</Label>
          </div>
        ))}
      </RadioGroup>
      <Select
        value={sort.value}
        onValueChange={(value) => setSort({ ...sort, value: value as (typeof MAP_SORT_OPTIONS)[number] })}
      >
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MAP_SORT_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {SORT_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={sort.desc ? "desc" : "asc"}
        onValueChange={(value) => setSort({ ...sort, desc: value === "desc" })}
      >
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">降順</SelectItem>
          <SelectItem value="asc">昇順</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
