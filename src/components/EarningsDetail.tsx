import { EarningsEvent } from "@/data/mockEarnings";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Clock, TrendingUp, TrendingDown, Zap, Target } from "lucide-react";

interface EarningsDetailProps {
  event: EarningsEvent;
  onAnalyze: () => void;
}

const EarningsDetail = ({ event, onAnalyze }: EarningsDetailProps) => {
  const chartData = event.historicalReactions.map((r) => ({
    quarter: r.quarter.replace("20", "'"),
    dayMove: r.dayMove,
    surprise: r.surprise,
  })).reverse();

  const avgMove = event.historicalReactions.reduce((s, r) => s + Math.abs(r.dayMove), 0) / event.historicalReactions.length;
  const beatRate = event.historicalReactions.filter((r) => r.surprise > 0).length;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold font-mono text-primary terminal-glow">
              ${event.ticker}
            </h2>
            <span className="text-xs px-2 py-0.5 bg-secondary rounded text-muted-foreground uppercase">
              {event.quarter}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{event.company}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-terminal-amber text-sm">
            <Clock className="h-3.5 w-3.5" />
            {event.date} · {event.time}
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "EPS Est.", value: `$${event.epsEstimate}`, icon: Target },
          { label: "Rev Est.", value: event.revenueEstimate, icon: TrendingUp },
          { label: "Avg |Move|", value: `${avgMove.toFixed(1)}%`, icon: Zap },
          { label: "Beat Rate", value: `${beatRate}/4`, icon: TrendingUp },
        ].map((stat) => (
          <div key={stat.label} className="bg-secondary rounded-md p-3">
            <div className="flex items-center gap-1 text-muted-foreground text-[10px] uppercase tracking-wider mb-1">
              <stat.icon className="h-3 w-3" />
              {stat.label}
            </div>
            <div className="text-sm font-mono font-semibold text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          1-Day Post-Earnings Move
        </h3>
        <div className="bg-secondary rounded-md p-4">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="quarter"
                tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
                axisLine={{ stroke: "hsl(220, 15%, 15%)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 18%, 7%)",
                  border: "1px solid hsl(220, 15%, 15%)",
                  borderRadius: "4px",
                  fontFamily: "JetBrains Mono",
                  fontSize: 12,
                }}
                formatter={(value: number) => [`${value > 0 ? "+" : ""}${value}%`, "1D Move"]}
              />
              <ReferenceLine y={0} stroke="hsl(220, 15%, 20%)" />
              <Bar dataKey="dayMove" radius={[3, 3, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.dayMove >= 0 ? "hsl(142, 70%, 45%)" : "hsl(0, 72%, 51%)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Table */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          Historical Reactions
        </h3>
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-secondary text-muted-foreground">
                <th className="text-left px-3 py-2 font-medium">Quarter</th>
                <th className="text-right px-3 py-2 font-medium">EPS Act.</th>
                <th className="text-right px-3 py-2 font-medium">EPS Est.</th>
                <th className="text-right px-3 py-2 font-medium">Surprise</th>
                <th className="text-right px-3 py-2 font-medium">1D Move</th>
                <th className="text-right px-3 py-2 font-medium">1W Move</th>
              </tr>
            </thead>
            <tbody>
              {event.historicalReactions.map((r) => (
                <tr key={r.quarter} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-3 py-2 font-mono text-foreground">{r.quarter}</td>
                  <td className="text-right px-3 py-2 font-mono">${r.epsActual.toFixed(2)}</td>
                  <td className="text-right px-3 py-2 font-mono text-muted-foreground">${r.epsEstimate.toFixed(2)}</td>
                  <td className={`text-right px-3 py-2 font-mono ${r.surprise >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                    {r.surprise >= 0 ? "+" : ""}{r.surprise.toFixed(1)}%
                  </td>
                  <td className={`text-right px-3 py-2 font-mono font-semibold ${r.dayMove >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                    {r.dayMove >= 0 ? "+" : ""}{r.dayMove.toFixed(1)}%
                  </td>
                  <td className={`text-right px-3 py-2 font-mono ${r.weekMove >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                    {r.weekMove >= 0 ? "+" : ""}{r.weekMove.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={onAnalyze}
        className="w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2"
      >
        <Zap className="h-4 w-4" />
        Run AI Transcript Analysis
      </button>
    </div>
  );
};

export default EarningsDetail;
