import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { alias, type PgSelectQueryBuilder, type SelectedFields } from "drizzle-orm/pg-core";
import { Hono } from "hono";
import z from "zod";
import { db, schema } from "@/db/client";
import { useScrollPagination } from "@/server/utils/pagination";

const { MapDifficulties, Maps, Users } = schema;
const Creator = alias(Users, "creator");

const mapListRoute = new Hono().get(
  "/",
  zValidator("query", z.object({ cursor: z.number().optional() })),
  async (c) => {
    const { cursor } = c.req.valid("query");

    const { limit, offset, buildPageResult } = useScrollPagination({ cursor, pageSize: 30 });

    const maps = await buildBaseQuery(db.select(buildBaseSelect()).from(Maps).$dynamic()).limit(limit).offset(offset);

    return c.json(buildPageResult(maps));
  },
);

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
  }) satisfies SelectedFields;

const buildBaseQuery = <T extends PgSelectQueryBuilder>(query: T) => {
  const baseQuery = query
    .innerJoin(MapDifficulties, eq(MapDifficulties.mapId, Maps.id))
    .innerJoin(Creator, eq(Creator.id, Maps.creatorId));

  // TODO: add where clauses based on input filters

  return baseQuery;
};
