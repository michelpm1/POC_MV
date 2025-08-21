"use client";

import { useEffect, useState } from "react";

type Item = { id: number; name: string };

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/poc");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setItems(data.items ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen p-8 font-sans">
      <h1 className="text-2xl font-semibold">Next.js POC</h1>
      <p className="text-sm mt-2 text-gray-600">Simple page fetching from a local API route.</p>

      {loading && <p className="mt-6">Loading…</p>}
      {error && <p className="mt-6 text-red-600">{error}</p>}

      {!loading && !error && (
        <ul className="mt-6 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="rounded border px-3 py-2">
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
