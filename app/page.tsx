import { MapList } from "@/features/map/map-list";
import { MapListSort } from "@/features/map/sort";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Maps</h1>
        <MapListSort />
      </div>
      <MapList />
    </main>
  );
}
