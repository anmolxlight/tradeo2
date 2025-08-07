import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { userId } = auth();
  if (!userId) return Response.json({ items: [] });
  try {
    const sb = supabaseAdmin();
    const { data } = await sb.from("searches").select("id, query, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(20);
    return Response.json({ items: data ?? [] });
  } catch {
    return Response.json({ items: [] });
  }
}