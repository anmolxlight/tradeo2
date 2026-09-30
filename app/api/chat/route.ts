import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { pplxChatCompletion } from "@/lib/perplexity";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { threadId, messages } = await req.json();
    if (!Array.isArray(messages)) return new Response("Invalid messages", { status: 400 });

    const reply = await pplxChatCompletion(messages, false);

    const responseMessages = [...messages, { role: "assistant", content: reply }];

    let outThreadId = threadId as string | undefined;
    const { userId } = auth();
    if (userId) {
      try {
        const sb = supabaseAdmin();
        if (!outThreadId) {
          const { data, error } = await sb.from("threads").insert({ user_id: userId, title: messages[0]?.content?.slice(0, 60) || "Conversation" }).select("id").single();
          if (error) throw error;
          outThreadId = data.id;
        }
        // Persist the last user message and the assistant reply
        const lastUser = messages[messages.length - 1];
        if (lastUser?.role === "user") {
          await sb.from("messages").insert({ thread_id: outThreadId, role: "user", content: lastUser.content });
        }
        await sb.from("messages").insert({ thread_id: outThreadId, role: "assistant", content: reply });
      } catch (_) { /* ignore persistence errors */ }
    }

    return Response.json({ threadId: outThreadId, messages: responseMessages });
  } catch (e: any) {
    return new Response(e.message || "Failed", { status: 500 });
  }
}