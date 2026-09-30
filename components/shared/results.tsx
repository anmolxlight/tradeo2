"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SentimentBadge } from "@/components/shared/sentiment-badge";
import { PriceChart, type PricePoint } from "@/components/charts/price-chart";
import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export type SearchResult = {
  symbol: string;
  name?: string;
  price_series?: PricePoint[];
  news?: { title: string; url: string; source?: string; published_at?: string }[];
  social_trends?: { source: string; text: string; url?: string }[];
  fundamentals?: {
    earnings?: string;
    pe_ratio?: string | number;
    net_profit?: string | number;
    revenue?: string | number;
    market_cap?: string | number;
    volume?: string | number;
    dividends?: string | number;
    circulating_supply?: string | number;
    competitors?: string[];
  };
  sentiment?: "Bullish" | "Bearish" | "Neutral" | string;
  recommendation?: "Buy" | "Hold" | "Sell" | string;
  summary?: string;
};

export function Results({ result }: { result: SearchResult }) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{result.name || result.symbol}</span>
            {result.sentiment && <SentimentBadge sentiment={result.sentiment} />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.price_series?.length ? (
            <PriceChart data={result.price_series} label={result.symbol} />
          ) : (
            <p className="text-sm text-muted-foreground">No price data available.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>News</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.news?.length ? result.news.map((n, i) => (
              <a key={i} href={n.url} target="_blank" rel="noreferrer" className="block text-sm hover:underline">
                {n.title}
              </a>
            )) : <p className="text-sm text-muted-foreground">No recent news.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Mentions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {result.social_trends?.length ? result.social_trends.map((s, i) => (
              <div key={i} className="text-sm">
                <span className="text-muted-foreground">{s.source}: </span>
                {s.text}
              </div>
            )) : <p className="text-sm text-muted-foreground">No mentions found.</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fundamentals & Competitors</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div><span className="text-muted-foreground">PE Ratio: </span>{String(result.fundamentals?.pe_ratio ?? "-")}</div>
            <div><span className="text-muted-foreground">Net Profit: </span>{String(result.fundamentals?.net_profit ?? "-")}</div>
            <div><span className="text-muted-foreground">Revenue: </span>{String(result.fundamentals?.revenue ?? "-")}</div>
            <div><span className="text-muted-foreground">Market Cap: </span>{String(result.fundamentals?.market_cap ?? "-")}</div>
          </div>
          <div className="space-y-1">
            <div><span className="text-muted-foreground">Volume: </span>{String(result.fundamentals?.volume ?? "-")}</div>
            <div><span className="text-muted-foreground">Dividends: </span>{String(result.fundamentals?.dividends ?? "-")}</div>
            <div><span className="text-muted-foreground">Circulating Supply: </span>{String(result.fundamentals?.circulating_supply ?? "-")}</div>
            <div><span className="text-muted-foreground">Competitors: </span>{result.fundamentals?.competitors?.join(", ") || "-"}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary & Recommendation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm whitespace-pre-wrap">
            {result.summary || "No summary available."}
            <SignedOut>
              <span className="blur-sm"> .............................................................................</span>
              <Link href="/sign-in" className="ml-2 underline">Login to see more</Link>
            </SignedOut>
          </div>
          <div className="text-sm"><span className="text-muted-foreground">Signal: </span>{result.recommendation ?? "-"}</div>
        </CardContent>
      </Card>
    </div>
  );
}