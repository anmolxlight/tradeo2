import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { pplxChatCompletion } from "@/lib/perplexity";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") return new Response("Missing query", { status: 400 });

    const system = `You are a financial research assistant. Use live web results to compile a concise, beginner-friendly analysis. Return ONLY JSON with this exact shape:
{
  "symbol": string,
  "name": string,
  "price_series": Array<{ "t": number, "p": number }>,
  "news": Array<{ "title": string, "url": string, "source"?: string, "published_at"?: string }>,
  "social_trends": Array<{ "source": string, "text": string, "url"?: string }>,
  "fundamentals": {
    "earnings"?: string,
    "pe_ratio"?: number | string,
    "net_profit"?: number | string,
    "revenue"?: number | string,
    "market_cap"?: number | string,
    "volume"?: number | string,
    "dividends"?: number | string,
    "circulating_supply"?: number | string,
    "competitors"?: string[]
  },
  "sentiment": "Bullish" | "Bearish" | "Neutral",
  "recommendation": "Buy" | "Hold" | "Sell",
  "summary": string
}`;

    const userPrompt = `Analyze: ${query}. Include recent price series (timestamps ms and prices), latest 5 news items with links, social trend snippets, fundamentals (earnings, PE, net profit, revenue, market cap, volume, dividends, circulating supply), list competitors, overall sentiment and signal.`;

    const content = await pplxChatCompletion([
      { role: "system", content: system },
      { role: "user", content: userPrompt },
    ], true);

    const result = JSON.parse(content);

    // Save history for signed-in users only
    const { userId } = auth();
    if (userId) {
      try {
        const sb = supabaseAdmin();
        await sb.from("searches").insert({ user_id: userId, query });
      } catch (_) { /* ignore */ }
    }

    return Response.json({ result });
  } catch (e: any) {
    return new Response(e.message || "Failed", { status: 500 });
  }
}