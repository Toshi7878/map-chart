"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { client } from "@/lib/client";

type MapItem = Awaited<ReturnType<typeof fetchMapList>>["items"][number];

const fetchMapList = async ({ pageParam = 0 }: { pageParam?: number }) => {
  const res = await client.api.maps.$get({ query: { cursor: pageParam === 0 ? undefined : String(pageParam) } });
  if (!res.ok) throw new Error("Failed to fetch maps");
  return res.json();
};

export function MapList() {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } = useInfiniteQuery({
    queryKey: ["maps"],
    queryFn: fetchMapList,
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
      <div ref={ref} className="h-8 flex items-center justify-center">
        {isFetchingNextPage && <p className="text-sm text-muted-foreground">Loading more...</p>}
        {!hasNextPage && maps.length > 0 && <p className="text-sm text-muted-foreground">No more maps.</p>}
      </div>
    </div>
  );
}

function MapCard({ map }: { map: MapItem }) {
  return (
    <li className="border rounded-lg p-4 flex gap-4 items-start">
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{map.info.title}</p>
        <p className="text-sm text-muted-foreground">{map.info.artistName}</p>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span>Like: {map.like.count}</span>
          <span>Ranking: {map.ranking.count}</span>
        </div>
      </div>
    </li>
  );
}
