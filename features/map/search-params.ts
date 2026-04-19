import { type inferParserType, useQueryState } from "nuqs";
import { createParser, parseAsStringLiteral } from "nuqs/server";
import { MAP_SORT_OPTIONS } from "@/validators/map/list";

export const CHART_MODE_OPTIONS = ["both", "roma", "kana"] as const;
export type ChartMode = (typeof CHART_MODE_OPTIONS)[number];

const chartModeParser = parseAsStringLiteral(CHART_MODE_OPTIONS).withDefault("both");
export const useMapListChartModeQueryState = () => useQueryState("chartMode", chartModeParser);

const parseAsSort = createParser({
  parse(query): { value: (typeof MAP_SORT_OPTIONS)[number]; desc: boolean } | null {
    const [value = "", direction = ""] = query.split(":");
    const desc = parseAsStringLiteral(["asc", "desc"]).parse(direction) ?? "desc";

    if (!MAP_SORT_OPTIONS.includes(value as (typeof MAP_SORT_OPTIONS)[number])) return null;

    return { value: value as (typeof MAP_SORT_OPTIONS)[number], desc: desc === "desc" };
  },
  serialize({ value, desc }: { value: (typeof MAP_SORT_OPTIONS)[number]; desc: boolean }) {
    return `${value}:${desc ? "desc" : "asc"}`;
  },
});

const mapListSortParser = parseAsSort.withDefault({ value: "publishedAt", desc: true });

export const useMapListSortQueryState = () => useQueryState("sort", mapListSortParser);

export type MapListSortSearchParams = inferParserType<typeof mapListSortParser>;
