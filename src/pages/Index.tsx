import { useState, useMemo } from "react";
import CommandBar from "@/components/CommandBar";
import EarningsCalendar from "@/components/EarningsCalendar";
import EarningsDetail from "@/components/EarningsDetail";
import AnalysisPanel from "@/components/AnalysisPanel";
import PortfolioUpload from "@/components/PortfolioUpload";
import StatusBar from "@/components/StatusBar";
import LandingHero from "@/components/LandingHero";
import { EarningsEvent } from "@/data/mockEarnings";
import { Stock } from "@/data/sp500";
import { useEarningsData } from "@/hooks/useEarningsData";
import { Activity, Loader2 } from "lucide-react";

const Index = () => {
  const [selectedEvent, setSelectedEvent] = useState<EarningsEvent | null>(null);
  const [portfolioStocks, setPortfolioStocks] = useState<Stock[]>([]);
  const [hasUploaded, setHasUploaded] = useState(false);

  const tickers = useMemo(() => portfolioStocks.map((s) => s.ticker), [portfolioStocks]);
  const { events, loading, error } = useEarningsData(tickers);

  const handleSelectStock = (stock: Stock) => {
    const event = events.find((e) => e.ticker === stock.ticker);
    if (event) {
      setSelectedEvent(event);
    }
  };

  const handleSelectEvent = (event: EarningsEvent) => {
    setSelectedEvent(event);
  };

  const handlePortfolioLoaded = (stocks: Stock[]) => {
    setPortfolioStocks(stocks);
    setHasUploaded(true);
  };

  // Landing page — no portfolio uploaded yet
  if (!hasUploaded) {
    return (
      <div className="h-screen flex flex-col bg-background scanline">
        <header className="h-12 border-b border-border bg-card flex items-center px-4 gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-mono font-bold text-sm text-foreground tracking-tight">
              EARNINGS<span className="text-primary">INTEL</span>PRO
            </span>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-8">
          <LandingHero onPortfolioLoaded={handlePortfolioLoaded} />
        </main>
        <StatusBar />
      </div>
    );
  }

  // Dashboard — portfolio uploaded
  return (
    <div className="h-screen flex flex-col bg-background scanline">
      {/* Top Bar */}
      <header className="h-12 border-b border-border bg-card flex items-center px-4 gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="font-mono font-bold text-sm text-foreground tracking-tight">
            EARNINGS<span className="text-primary">INTEL</span>PRO
          </span>
        </div>
        <div className="flex-1 flex justify-center">
          <CommandBar onSelectStock={handleSelectStock} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono uppercase">
            {portfolioStocks.length} Tickers Loaded
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Calendar */}
        <aside className="w-80 border-r border-border bg-card overflow-y-auto p-5 shrink-0 space-y-5">
          <PortfolioUpload
            onPortfolioLoaded={handlePortfolioLoaded}
            compact
          />
          {loading ? (
            <div className="flex items-center gap-2 py-8 justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Loading earnings…</span>
            </div>
          ) : error ? (
            <div className="text-xs text-destructive text-center py-4">{error}</div>
          ) : (
            <EarningsCalendar
              events={events}
              onSelectEvent={handleSelectEvent}
              selectedTicker={selectedEvent?.ticker}
            />
          )}
          {portfolioStocks.length > 0 && (
            <div className="border-t border-border pt-5">
              <h3 className="text-xs uppercase tracking-wider text-terminal-cyan mb-3 font-semibold">
                Your Portfolio
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {portfolioStocks.map((s) => (
                  <button
                    key={s.ticker}
                    onClick={() => handleSelectStock(s)}
                    className="px-2.5 py-1.5 text-xs font-mono bg-secondary rounded hover:bg-muted text-primary transition-colors"
                  >
                    {s.ticker}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Center - Detail + Analysis */}
        <main className="flex-1 overflow-y-auto p-8">
          {selectedEvent ? (
            <div className="max-w-4xl mx-auto space-y-8">
              <EarningsDetail event={selectedEvent} />
              <div className="border-t border-border pt-8">
                <AnalysisPanel ticker={selectedEvent.ticker} quarter={selectedEvent.quarter} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
              <h2 className="text-xl font-bold font-mono text-foreground mb-3">
                Select a Stock
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use the command bar (⌘K) to search for a ticker, or select from the
                earnings calendar on the left.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
};

export default Index;
