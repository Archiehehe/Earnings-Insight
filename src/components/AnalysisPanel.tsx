import { useState, useEffect } from "react";
import { Loader2, AlertTriangle, TrendingUp, Signal, MessageSquare } from "lucide-react";

interface AnalysisPanelProps {
  ticker: string;
  quarter: string;
}

interface PillarData {
  delta: string;
  stateOfPlay: string;
  signaling: string;
  qaTruth: string;
  qaTranscript?: string;
}

const pillars = [
  { key: "delta" as const, label: "The Delta", subtitle: "What Changed", icon: AlertTriangle, color: "text-terminal-amber" },
  { key: "stateOfPlay" as const, label: "State of Play", subtitle: "Current Progress", icon: TrendingUp, color: "text-terminal-green" },
  { key: "signaling" as const, label: "Signaling", subtitle: "Future Vision", icon: Signal, color: "text-terminal-blue" },
  { key: "qaTruth" as const, label: "The Truth", subtitle: "Q&A Analysis", icon: MessageSquare, color: "text-terminal-cyan" },
];

const AnalysisPanel = ({ ticker, quarter }: AnalysisPanelProps) => {
  const [analysis, setAnalysis] = useState<PillarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePillar, setActivePillar] = useState(0);
  const [streamedText, setStreamedText] = useState("");

  // Auto-run analysis when ticker/quarter changes
  useEffect(() => {
    setAnalysis(null);
    setError(null);
    setStreamedText("");
    setActivePillar(0);
    runAnalysis();
  }, [ticker, quarter]);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setStreamedText("");

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-earnings`;
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ ticker, quarter }),
      });

      if (resp.status === 429) { setError("Rate limit exceeded. Please try again in a moment."); return; }
      if (resp.status === 402) { setError("AI usage limit reached. Please add credits."); return; }
      if (!resp.ok) { setError("Failed to analyze. Please try again."); return; }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setStreamedText(fullText);
            }
          } catch { /* partial JSON */ }
        }
      }

      try {
        const parsed = JSON.parse(fullText);
        setAnalysis(parsed);
      } catch {
        setAnalysis({
          delta: extractSection(fullText, "Delta", "State"),
          stateOfPlay: extractSection(fullText, "State of Play", "Signal"),
          signaling: extractSection(fullText, "Signal", "Truth"),
          qaTruth: extractSection(fullText, "Truth", "Q&A Transcript"),
          qaTranscript: extractSection(fullText, "Q&A Transcript", "---END---"),
        });
      }
    } catch (e) {
      console.error("Analysis error:", e);
      setError("Failed to connect to analysis engine.");
    } finally {
      setLoading(false);
    }
  };

  const extractSection = (text: string, start: string, end: string): string => {
    const startIdx = text.toLowerCase().indexOf(start.toLowerCase());
    const endIdx = end === "---END---" ? text.length : text.toLowerCase().indexOf(end.toLowerCase());
    if (startIdx === -1) return text.substring(0, 500);
    const section = text.substring(startIdx, endIdx === -1 ? undefined : endIdx);
    const lines = section.split("\n");
    return lines.slice(1).join("\n").trim() || section;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-foreground">Analyzing {ticker} {quarter}...</span>
        </div>
        {streamedText && (
          <div className="bg-secondary rounded-md p-4 text-xs font-mono text-muted-foreground whitespace-pre-wrap max-h-64 overflow-y-auto">
            {streamedText}
            <span className="inline-block w-2 h-4 bg-primary animate-pulse-green ml-0.5" />
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertTriangle className="h-8 w-8 text-terminal-amber mb-3" />
        <p className="text-sm text-foreground mb-2">Analysis Error</p>
        <p className="text-xs text-muted-foreground mb-4">{error}</p>
        <button
          onClick={runAnalysis}
          className="px-4 py-2 rounded-md bg-secondary text-foreground text-sm hover:bg-muted transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analysis) return null;

  const currentPillar = pillars[activePillar];
  const Icon = currentPillar.icon;

  return (
    <div className="space-y-5 animate-slide-up">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        AI Transcript Analysis — 4-Pillar Framework
      </h3>

      {/* Pillar Tabs */}
      <div className="flex gap-1 bg-secondary rounded-md p-1">
        {pillars.map((p, i) => {
          const PIcon = p.icon;
          return (
            <button
              key={p.key}
              onClick={() => setActivePillar(i)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded text-xs font-medium transition-all ${
                i === activePillar
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <PIcon className={`h-3.5 w-3.5 ${i === activePillar ? p.color : ""}`} />
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Pillar Content */}
      <div className="bg-secondary rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon className={`h-5 w-5 ${currentPillar.color}`} />
          <div>
            <h3 className="text-sm font-semibold text-foreground">{currentPillar.label}</h3>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {currentPillar.subtitle}
            </p>
          </div>
        </div>
        <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">
          {analysis[currentPillar.key]}
        </div>
      </div>

      {/* Q&A Transcript */}
      <div className="bg-secondary rounded-lg p-6 border border-border">
        <h4 className="text-xs uppercase tracking-wider text-terminal-cyan font-semibold mb-3">
          Q&A Transcript (Excerpt)
        </h4>
        <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">
          {analysis.qaTranscript?.trim() || "Transcript unavailable for this quarter."}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;
