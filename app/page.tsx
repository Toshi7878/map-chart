import { MapList } from "@/components/map/MapList";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 font-bold text-2xl">Maps</h1>
      <MapList />
    </main>
  );
}
