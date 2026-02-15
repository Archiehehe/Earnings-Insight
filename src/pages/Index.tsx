import { useState } from "react";
import CommandBar from "@/components/CommandBar";
import EarningsCalendar from "@/components/EarningsCalendar";
import EarningsDetail from "@/components/EarningsDetail";
import AnalysisPanel from "@/components/AnalysisPanel";
import PortfolioUpload from "@/components/PortfolioUpload";
import StatusBar from "@/components/StatusBar";
import { EarningsEvent, mockEarnings } from "@/data/mockEarnings";
import { Stock } from "@/data/sp500";
import { Activity, BarChart3 } from "lucide-react";

const Index = () => {
  const [selectedEvent, setSelectedEvent] = useState<EarningsEvent | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [portfolioStocks, setPortfolioStocks] = useState<Stock[]>([]);

  const handleSelectStock = (stock: Stock) => {
    const event = mockEarnings.find((e) => e.ticker === stock.ticker);
    if (event) {
      setSelectedEvent(event);
      setShowAnalysis(false);
    }
  };

  const handleSelectEvent = (event: EarningsEvent) => {
    setSelectedEvent(event);
    setShowAnalysis(false);
  };

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
            S&P 500 Coverage
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Calendar */}
        <aside className="w-80 border-r border-border bg-card overflow-y-auto p-4 shrink-0">
          <PortfolioUpload
            onPortfolioLoaded={(stocks) => setPortfolioStocks(stocks)}
          />
          <div className="mt-4">
            <EarningsCalendar
              onSelectEvent={handleSelectEvent}
              selectedTicker={selectedEvent?.ticker}
            />
          </div>
          {portfolioStocks.length > 0 && (
            <div className="mt-4 border-t border-border pt-4">
              <h3 className="text-xs uppercase tracking-wider text-terminal-cyan mb-2 font-semibold">
                Your Portfolio
              </h3>
              <div className="flex flex-wrap gap-1">
                {portfolioStocks.map((s) => (
                  <button
                    key={s.ticker}
                    onClick={() => handleSelectStock(s)}
                    className="px-2 py-1 text-xs font-mono bg-secondary rounded hover:bg-muted text-primary transition-colors"
                  >
                    {s.ticker}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Center - Detail */}
        <main className="flex-1 overflow-y-auto p-6">
          {selectedEvent ? (
            <div className="max-w-3xl mx-auto">
              <EarningsDetail
                event={selectedEvent}
                onAnalyze={() => setShowAnalysis(true)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <BarChart3 className="h-16 w-16 text-terminal-dim mb-6" />
              <h2 className="text-xl font-bold font-mono text-foreground mb-2">
                Select a Stock
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Use the command bar (⌘K) to search for a ticker, select from the
                earnings calendar, or upload your portfolio CSV.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Upcoming", value: mockEarnings.length, suffix: "events" },
                  { label: "Coverage", value: "S&P 500", suffix: "" },
                  { label: "AI Analysis", value: "4-Pillar", suffix: "" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card border border-border rounded-md p-4">
                    <div className="text-lg font-mono font-bold text-primary">{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                      {stat.label} {stat.suffix}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Right Panel - Analysis */}
        {selectedEvent && showAnalysis && (
          <aside className="w-96 border-l border-border bg-card overflow-y-auto p-4 shrink-0">
            <AnalysisPanel ticker={selectedEvent.ticker} quarter={selectedEvent.quarter} />
          </aside>
        )}
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
};

export default Index;
