import { Upload, BarChart3, Brain, Zap, TrendingUp } from "lucide-react";
import PortfolioUpload from "./PortfolioUpload";
import { Stock } from "@/data/sp500";

interface LandingHeroProps {
  onPortfolioLoaded: (stocks: Stock[]) => void;
}

const features = [
  {
    icon: BarChart3,
    title: "Historical Reactions",
    desc: "See how stocks moved post-earnings: 1D/1W price reactions, surprise %, beat rates across quarters.",
  },
  {
    icon: Brain,
    title: "AI Transcript Analysis",
    desc: "4-pillar framework: Delta, State of Play, Signaling, and Q&A Truth — auto-loaded for every stock.",
  },
  {
    icon: TrendingUp,
    title: "Personalized Calendar",
    desc: "Only your tickers. Upcoming earnings with BMO/AMC timing, EPS & revenue estimates.",
  },
  {
    icon: Zap,
    title: "Institutional-Grade",
    desc: "Built for serious investors. No noise, no fluff — just earnings context that matters.",
  },
];

const LandingHero = ({ onPortfolioLoaded }: LandingHeroProps) => {
  return (
    <div className="max-w-2xl w-full space-y-12 animate-slide-up">
      {/* Headline */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-mono text-foreground leading-tight">
          Earnings context,
          <br />
          <span className="text-primary terminal-glow">not noise.</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
          Upload your portfolio and get a personalized earnings calendar with
          historical price reactions and deep AI transcript analysis — all in one place.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="mx-auto max-w-md">
        <PortfolioUpload onPortfolioLoaded={onPortfolioLoaded} />
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-5">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-card border border-border rounded-lg p-5 space-y-2"
          >
            <div className="flex items-center gap-2">
              <f.icon className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-[11px] text-terminal-dim">
        This is a sensemaking tool — not a trading signal engine and not financial advice.
      </p>
    </div>
  );
};

export default LandingHero;
