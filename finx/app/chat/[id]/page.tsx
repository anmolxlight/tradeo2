import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Chat, type ChatMessage } from "@/components/shared/chat";

export default async function ChatThreadPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  const sb = supabaseAdmin();

  // Ensure the thread belongs to the user
  const { data: thread } = await sb.from("threads").select("id, user_id, title").eq("id", params.id).single();
  if (!thread || (userId && thread.user_id !== userId)) {
    return <div className="p-6 text-sm text-red-600">Thread not found.</div>;
  }

  const { data: msgs } = await sb
    .from("messages")
    .select("role, content, created_at")
    .eq("thread_id", params.id)
    .order("created_at", { ascending: true });

  const seedMessages: ChatMessage[] = (msgs || []).map(m => ({ role: m.role as any, content: m.content || "" }));

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Conversation</h1>
      <Chat threadId={params.id} seedMessages={seedMessages} />
    </div>
  );
}