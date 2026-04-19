import z from "zod";

export const MAP_SORT_OPTIONS = [
  "publishedAt",
  "difficulty",
  "ranking-count",
  "ranking-register",
  "like-count",
  "duration",
  "like",
  "bookmark",
  "random",
] as const;
export const MAP_USER_FILTER_OPTIONS = ["liked", "created", "unlisted"] as const;
export const MAP_RANKING_STATUS_FILTER_OPTIONS = ["1st", "not-first", "registerd", "unregisterd", "perfect"] as const;
export const MAP_DIFFICULTY_RATE_FILTER_LIMIT = { min: 0, max: 12 };

/** クエリ文字列の `""` / `"null"` を未指定として扱う */
const emptyToUndefined = (v: unknown) =>
  v === "" || v === null || v === undefined ? undefined : v;

export const SelectMapListApiSchema = z.object({
  cursor: z.preprocess(emptyToUndefined, z.coerce.number().optional()),
  sortType: z.preprocess(emptyToUndefined, z.enum(MAP_SORT_OPTIONS).optional()),
  isSortDesc: z.preprocess(emptyToUndefined, z.coerce.boolean().optional()),
});
