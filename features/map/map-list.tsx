"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { KpmLineChart } from "@/components/ui/kpm-line-chart";
import { type Api, client } from "@/lib/client";
import { type ChartMode, useMapListChartModeQueryState, useMapListSortQueryState } from "./search-params";

export function MapList() {
  const { ref, inView } = useInView();
  const [sort] = useMapListSortQueryState();
  const [chartMode] = useMapListChartModeQueryState();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } = useInfiniteQuery({
    queryKey: ["maps", sort],
    queryFn: async ({ pageParam }: { pageParam?: number }) => {
      const res = await client.api.maps.$get({
        query: {
          cursor: String(pageParam ?? 0),
          sortType: sort.value,
          isSortDesc: String(sort.desc),
        },
      });
      return res.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error loading maps.</p>;

  const maps = data.pages.flatMap((page) => page.items);

  return (
    <div>
      <ul className="grid grid-cols-2 gap-2">
        {maps.map((map) => (
          <MapCard key={map.id} map={map} chartMode={chartMode} />
        ))}
      </ul>
      <div ref={ref} className="flex h-8 items-center justify-center">
        {isFetchingNextPage && <p className="text-muted-foreground text-sm">Loading more...</p>}
        {!hasNextPage && maps.length > 0 && <p className="text-muted-foreground text-sm">No more maps.</p>}
      </div>
    </div>
  );
}

function MapCard({
  map,
  chartMode,
}: {
  map: InferResponseType<Api["maps"]["$get"]>["items"][number];
  chartMode: ChartMode;
}) {
  return (
    <li className="flex gap-3 rounded-lg border p-2">
      <div className="w-28 shrink-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={`https://img.youtube.com/vi/${map.media.videoId}/mqdefault.jpg`}
            alt={map.info.title}
            className="size-full rounded object-cover"
          />
        </AspectRatio>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate font-semibold text-sm">{map.info.title}</p>
        <p className="truncate text-muted-foreground text-xs">{map.info.artistName}</p>
        <div className="flex gap-2 text-muted-foreground text-xs">
          <span>Like: {map.like.count}</span>
          <span>Ranking: {map.ranking.count}</span>
        </div>
        <KpmLineChart mapJson={map.mapJson} mode={chartMode} />
      </div>
    </li>
  );
}
