"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { type Api, client } from "@/lib/client";

export function MapList() {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } = useInfiniteQuery({
    queryKey: ["maps"],
    queryFn: async ({ pageParam = 0 }: { pageParam?: number }) => {
      const res = await client.api.maps.$get({ query: { cursor: pageParam } });
      return res.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
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
      <ul className="flex flex-col gap-2">
        {maps.map((map) => (
          <MapCard key={map.id} map={map} />
        ))}
      </ul>
      <div ref={ref} className="flex h-8 items-center justify-center">
        {isFetchingNextPage && <p className="text-muted-foreground text-sm">Loading more...</p>}
        {!hasNextPage && maps.length > 0 && <p className="text-muted-foreground text-sm">No more maps.</p>}
      </div>
    </div>
  );
}

function MapCard({ map }: { map: InferResponseType<Api["maps"]["$get"]>["items"][number] }) {
  return (
    <li className="flex items-start gap-4 rounded-lg border p-4">
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{map.info.title}</p>
        <p className="text-muted-foreground text-sm">{map.info.artistName}</p>
        <div className="flex gap-2 text-muted-foreground text-xs">
          <span>Like: {map.like.count}</span>
          <span>Ranking: {map.ranking.count}</span>
        </div>
      </div>
    </li>
  );
}
