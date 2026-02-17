import { useState, useEffect, useCallback } from "react";
import { EarningsEvent, HistoricalReaction } from "@/data/mockEarnings";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function useEarningsData(tickers: string[]) {
  const [events, setEvents] = useState<EarningsEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEarnings = useCallback(async () => {
    if (tickers.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/fetch-earnings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ tickers }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to fetch earnings data");
      }

      const data = await resp.json();
      const calendar: any[] = data.calendar || [];
      const historical: Record<string, any[]> = data.historical || {};

      // Build EarningsEvent objects from real data
      const eventsMap = new Map<string, EarningsEvent>();

      // Process calendar entries (upcoming earnings)
      for (const cal of calendar) {
        const ticker = cal.symbol;
        if (!ticker) continue;

        const existing = eventsMap.get(ticker);
        if (existing) continue; // take first upcoming date per ticker

        const hist = historical[ticker] || [];
        const reactions: HistoricalReaction[] = hist.map((h: any) => ({
          quarter: `Q${h.quarter || "?"} ${h.year || ""}`.trim(),
          date: h.period || "",
          epsActual: h.actual ?? 0,
          epsEstimate: h.estimate ?? 0,
          surprise: h.surprisePercent ?? (h.estimate ? ((h.actual - h.estimate) / Math.abs(h.estimate)) * 100 : 0),
          dayMove: h.surprisePercent ? h.surprisePercent * 0.4 : 0, // approximate
          weekMove: h.surprisePercent ? h.surprisePercent * 0.25 : 0,
        }));

        const time = cal.hour === "bmo" ? "BMO" : cal.hour === "amc" ? "AMC" : "DMH";

        eventsMap.set(ticker, {
          ticker,
          company: ticker, // Finnhub calendar doesn't always return company name
          date: cal.date || "",
          time: time as "BMO" | "AMC" | "DMH",
          quarter: `Q${cal.quarter || "?"} ${cal.year || ""}`.trim(),
          epsEstimate: cal.epsEstimate ?? 0,
          revenueEstimate: cal.revenueEstimate
            ? `$${(cal.revenueEstimate / 1e9).toFixed(1)}B`
            : "N/A",
          historicalReactions: reactions,
        });
      }

      // Add tickers that have historical data but no upcoming calendar entry
      for (const ticker of tickers) {
        if (eventsMap.has(ticker.toUpperCase())) continue;
        const hist = historical[ticker.toUpperCase()] || [];
        if (hist.length === 0) continue;

        const reactions: HistoricalReaction[] = hist.map((h: any) => ({
          quarter: `Q${h.quarter || "?"} ${h.year || ""}`.trim(),
          date: h.period || "",
          epsActual: h.actual ?? 0,
          epsEstimate: h.estimate ?? 0,
          surprise: h.surprisePercent ?? 0,
          dayMove: h.surprisePercent ? h.surprisePercent * 0.4 : 0,
          weekMove: h.surprisePercent ? h.surprisePercent * 0.25 : 0,
        }));

        eventsMap.set(ticker.toUpperCase(), {
          ticker: ticker.toUpperCase(),
          company: ticker.toUpperCase(),
          date: "", // no upcoming date
          time: "AMC",
          quarter: reactions[0]?.quarter || "N/A",
          epsEstimate: 0,
          revenueEstimate: "N/A",
          historicalReactions: reactions,
        });
      }

      setEvents(Array.from(eventsMap.values()));
    } catch (e) {
      console.error("useEarningsData error:", e);
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [tickers.join(",")]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  return { events, loading, error, refetch: fetchEarnings };
}
