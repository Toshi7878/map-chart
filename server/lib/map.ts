import { and, eq, exists } from "drizzle-orm";
import { db, schema } from "@/db/client";

const { MapBookmarkListItems, MapBookmarkLists, Maps } = schema;

export const buildHasBookmarkedMapExists = (userId: number) =>
  exists(
    db
      .select({ one: MapBookmarkListItems.mapId })
      .from(MapBookmarkListItems)
      .innerJoin(MapBookmarkLists, eq(MapBookmarkLists.id, MapBookmarkListItems.listId))
      .where(
        and(
          eq(MapBookmarkLists.userId, userId),
          eq(MapBookmarkListItems.mapId, Maps.id), // 外側クエリの maps.id に相関
        ),
      ),
  );
