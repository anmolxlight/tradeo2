"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export function SearchBar({ onSearch, loading }: { onSearch: (q: string) => void; loading?: boolean }) {
  const [query, setQuery] = useState("");

  return (
    <motion.form
      onSubmit={(e) => { e.preventDefault(); if (query.trim()) onSearch(query.trim()); }}
      className="flex w-full items-center gap-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stocks (AAPL, Apple) or crypto (BTC, Bitcoin)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</Button>
    </motion.form>
  );
}