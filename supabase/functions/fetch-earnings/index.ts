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
    const FMP_API_KEY = Deno.env.get("FMP_API_KEY");

    if (!FMP_API_KEY) {
      throw new Error("FMP_API_KEY is not configured");
    }

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      throw new Error("tickers array is required");
    }

    // Fetch earnings calendar from FMP
    const calendarUrl = `https://financialmodelingprep.com/api/v3/earning_calendar?apikey=${FMP_API_KEY}`;
    const calendarResp = await fetch(calendarUrl);
    
    if (!calendarResp.ok) {
      console.error("FMP calendar error:", calendarResp.status);
      throw new Error("Failed to fetch earnings calendar");
    }

    const allEarnings = await calendarResp.json();

    // Filter to requested tickers
    const tickerSet = new Set(tickers.map((t: string) => t.toUpperCase()));
    const filtered = allEarnings.filter((e: any) => tickerSet.has(e.symbol?.toUpperCase()));

    // For each matched ticker, also fetch historical earnings (last 4 quarters)
    const uniqueTickers = [...new Set(filtered.map((e: any) => e.symbol))] as string[];
    
    const historicalPromises = uniqueTickers.slice(0, 20).map(async (ticker: string) => {
      try {
        const histUrl = `https://financialmodelingprep.com/api/v3/historical/earning_calendar/${ticker}?limit=4&apikey=${FMP_API_KEY}`;
        const histResp = await fetch(histUrl);
        if (!histResp.ok) return { ticker, history: [] };
        const history = await histResp.json();
        return { ticker, history };
      } catch {
        return { ticker, history: [] };
      }
    });

    const historicalResults = await Promise.all(historicalPromises);
    const historicalMap: Record<string, any[]> = {};
    for (const { ticker, history } of historicalResults) {
      historicalMap[ticker] = history;
    }

    return new Response(
      JSON.stringify({ earnings: filtered, historical: historicalMap }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("fetch-earnings error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
