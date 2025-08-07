"use client";

import useSWR from "swr";
import Link from "next/link";
import { useAuth, SignedIn } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function Sidebar({ className }: { className?: string }) {
  const { isSignedIn } = useAuth();
  const { data: history } = useSWR(isSignedIn ? "/api/history" : null, fetcher);
  const { data: threads } = useSWR(isSignedIn ? "/api/threads" : null, fetcher);

  return (
    <aside className={cn("hidden md:flex md:w-72 flex-col border-r p-4 gap-5", className)}>
      <SignedIn>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Searches</h3>
          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
            {history?.items?.length ? history.items.map((s: any) => (
              <Link key={s.id} href={`/?q=${encodeURIComponent(s.query)}`} className="text-sm text-foreground/80 hover:underline truncate">
                {s.query}
              </Link>
            )) : <p className="text-sm text-muted-foreground">No history yet.</p>}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Saved Chats</h3>
          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
            {threads?.items?.length ? threads.items.map((t: any) => (
              <Link key={t.id} href={`/chat/${t.id}`} className="text-sm text-foreground/80 hover:underline truncate">
                {t.title || "Conversation"}
              </Link>
            )) : <p className="text-sm text-muted-foreground">No chats yet.</p>}
          </div>
        </div>
      </SignedIn>
    </aside>
  );
}