import { zValidator } from "@hono/zod-validator";
import { asc, desc, eq, sql } from "drizzle-orm";
import { alias, type PgSelectQueryBuilder, type SelectedFields } from "drizzle-orm/pg-core";
import { Hono } from "hono";
import { db, schema } from "@/db/client";
import { Results } from "@/db/schema";
import { useScrollPagination } from "@/server/utils/pagination";
import { type MAP_SORT_OPTIONS, SelectMapListApiSchema } from "@/validators/map/list";

const { MapDifficulties, Maps, Users } = schema;
const Creator = alias(Users, "creator");
const MyResult = alias(Results, "my_result");

const mapListRoute = new Hono().get("/", zValidator("query", SelectMapListApiSchema), async (c) => {
  const { cursor, sortType, isSortDesc } = c.req.valid("query");

  const { limit, offset, buildPageResult } = useScrollPagination({ cursor, pageSize: 30 });

  const maps = await buildBaseQuery(db.select(buildBaseSelect()).from(Maps).$dynamic())
    .limit(limit)
    .offset(offset)
    .orderBy(...mapOrderBy(sortType, isSortDesc));

  return c.json(buildPageResult(maps));
});

export default mapListRoute;

const buildBaseSelect = () =>
  ({
    id: Maps.id,
    updatedAt: Maps.updatedAt,
    media: {
      videoId: Maps.videoId,
      previewTime: Maps.previewTime,
      thumbnailQuality: Maps.thumbnailQuality,
    },
    info: {
      title: Maps.title,
      artistName: Maps.artistName,
      source: Maps.musicSource,
      duration: Maps.duration,
      categories: Maps.category,
      visibility: Maps.visibility,
    },
    creator: {
      id: Creator.id,
      name: Creator.name,
    },
    difficulty: {
      romaKpmMedian: MapDifficulties.romaKpmMedian,
      kanaKpmMedian: MapDifficulties.kanaKpmMedian,
      romaKpmMax: MapDifficulties.romaKpmMax,
      kanaKpmMax: MapDifficulties.kanaKpmMax,
      romaTotalNotes: MapDifficulties.romaTotalNotes,
      kanaTotalNotes: MapDifficulties.kanaTotalNotes,
    },
    like: {
      count: Maps.likeCount,
    },
    ranking: {
      count: Maps.rankingCount,
    },
    mapJson: Maps.mapJson,
  }) satisfies SelectedFields;

const buildBaseQuery = <T extends PgSelectQueryBuilder>(query: T) => {
  const baseQuery = query
    .innerJoin(MapDifficulties, eq(MapDifficulties.mapId, Maps.id))
    .innerJoin(Creator, eq(Creator.id, Maps.creatorId));

  // TODO: add where clauses based on input filters

  return baseQuery;
};

function mapOrderBy(
  sortField: (typeof MAP_SORT_OPTIONS)[number] | undefined | null,
  isDesc: boolean | undefined | null = true,
) {
  const order = (isDesc ?? true) ? desc : asc;

  switch (sortField) {
    case "random":
      return [sql`RANDOM()`];
    case "difficulty":
      return [order(MapDifficulties.romaKpmMedian)];
    case "ranking-count":
      return [order(Maps.rankingCount), order(Maps.id)];
    case "ranking-register":
      return [order(MyResult.updatedAt), order(Maps.id)];
    case "like-count":
      return [order(Maps.likeCount), order(Maps.id)];
    case "duration":
      return [order(Maps.duration)];
    default:
      return [order(sql`COALESCE(${Maps.publishedAt}, ${Maps.createdAt})`), order(Maps.id)];
  }
}
