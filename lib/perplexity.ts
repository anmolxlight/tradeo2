type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const PPLX_BASE = "https://api.perplexity.ai";

export async function pplxChatCompletion(messages: ChatMessage[], json: boolean = false) {
  const res = await fetch(`${PPLX_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar-pro",
      messages,
      temperature: 0.2,
      stream: false,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Perplexity error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const content: string = data.choices?.[0]?.message?.content ?? "";
  return content;
}

export async function pplxAnswer(query: string) {
  const res = await fetch(`${PPLX_BASE}/answer`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar-pro",
      q: query,
      search_recency_filter: "month",
    }),
  });
  if (!res.ok) throw new Error(`Perplexity error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data;
}