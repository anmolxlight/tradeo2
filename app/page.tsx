"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SearchBar } from "@/components/shared/search-bar";
import { Results, type SearchResult } from "@/components/shared/results";
import { Sidebar } from "@/components/shared/sidebar";
import { motion } from "framer-motion";
import { SignedIn } from "@clerk/nextjs";
import { Chat } from "@/components/shared/chat";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback(async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: q }) });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data.result);
    } catch (e: any) {
      setError(e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) runSearch(q);
  }, [runSearch]);

  return (
    <div className="min-h-screen grid md:grid-cols-[18rem_1fr]">
      <Sidebar />
      <main className="flex flex-col gap-6 p-4 md:p-8 max-w-5xl w-full mx-auto">
        <div className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-4">
          <SearchBar onSearch={runSearch} loading={loading} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {result ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <Results result={result} />
            <div className="mt-6">
              <SignedIn>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Ask follow-up</h3>
                <Chat seedMessages={[{ role: "assistant", content: result.summary || "" }]} />
              </SignedIn>
            </div>
          </motion.div>
        ) : (
          <div className="text-sm text-muted-foreground">Search a stock or crypto to get started.</div>
        )}
      </main>
    </div>
  );
}