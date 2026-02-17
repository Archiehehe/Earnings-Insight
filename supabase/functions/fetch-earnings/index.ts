import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tickers } = await req.json();
    const FINNHUB_KEY = Deno.env.get("FINNHUB_API_KEY");

    if (!FINNHUB_KEY) {
      throw new Error("FINNHUB_API_KEY is not configured");
    }

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      throw new Error("tickers array is required");
    }

    const tickerList = tickers.map((t: string) => t.toUpperCase()).slice(0, 30);

    // 1. Fetch upcoming earnings calendar (next 30 days)
    const today = new Date();
    const future = new Date(today);
    future.setDate(future.getDate() + 30);
    const fromDate = today.toISOString().split("T")[0];
    const toDate = future.toISOString().split("T")[0];

    const calUrl = `https://finnhub.io/api/v1/calendar/earnings?from=${fromDate}&to=${toDate}&token=${FINNHUB_KEY}`;
    const calResp = await fetch(calUrl);
    if (!calResp.ok) {
      console.error("Finnhub calendar error:", calResp.status, await calResp.text());
      throw new Error("Failed to fetch earnings calendar");
    }
    const calData = await calResp.json();
    const allCalendar = calData.earningsCalendar || [];

    // Filter to requested tickers
    const tickerSet = new Set(tickerList);
    const matchedCalendar = allCalendar.filter((e: any) => tickerSet.has(e.symbol?.toUpperCase()));

    // 2. For each matched ticker, fetch historical earnings surprises
    const uniqueTickers = [...new Set(matchedCalendar.map((e: any) => e.symbol))] as string[];

    // Also include tickers that might not have upcoming earnings but user still wants data
    for (const t of tickerList) {
      if (!uniqueTickers.includes(t) && uniqueTickers.length < 30) {
        uniqueTickers.push(t);
      }
    }

    const histPromises = uniqueTickers.map(async (ticker: string) => {
      try {
        const url = `https://finnhub.io/api/v1/stock/earnings?symbol=${ticker}&limit=4&token=${FINNHUB_KEY}`;
        const resp = await fetch(url);
        if (!resp.ok) return { ticker, history: [] };
        const data = await resp.json();
        return { ticker, history: Array.isArray(data) ? data : [] };
      } catch {
        return { ticker, history: [] };
      }
    });

    const histResults = await Promise.all(histPromises);
    const historicalMap: Record<string, any[]> = {};
    for (const { ticker, history } of histResults) {
      historicalMap[ticker] = history;
    }

    return new Response(
      JSON.stringify({ calendar: matchedCalendar, historical: historicalMap }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("fetch-earnings error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
