"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export function Chat({ threadId: initialThreadId, seedMessages }: { threadId?: string; seedMessages?: ChatMessage[] }) {
  const { isSignedIn } = useAuth();
  const [threadId, setThreadId] = useState<string | undefined>(initialThreadId);
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages || []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send() {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input.trim() } as ChatMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId, messages: newMessages }),
    });

    setLoading(false);
    if (!res.ok) {
      setMessages([...newMessages, { role: "assistant", content: "There was an error. Please try again." }]);
      return;
    }
    const data = await res.json();
    setThreadId(data.threadId);
    setMessages(data.messages);
  }

  return (
    <div className="flex h-full flex-col rounded-lg border">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div className="inline-block rounded-lg px-3 py-2 text-sm bg-accent">
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="border-t p-3 flex gap-2">
        <Input
          placeholder={isSignedIn ? "Ask a follow-up..." : "Sign in to save chat"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={loading}
        />
        <Button onClick={send} disabled={loading}>{loading ? "Sending..." : "Send"}</Button>
      </div>
    </div>
  );
}