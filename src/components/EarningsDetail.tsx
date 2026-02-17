import { EarningsEvent } from "@/data/mockEarnings";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Clock, TrendingUp, Zap, Target } from "lucide-react";

interface EarningsDetailProps {
  event: EarningsEvent;
}

const EarningsDetail = ({ event }: EarningsDetailProps) => {
  const chartData = event.historicalReactions.map((r) => ({
    quarter: r.quarter,
    surprise: r.surprise,
  })).reverse();

  const hasHistory = event.historicalReactions.length > 0;
  const avgSurprise = hasHistory
    ? event.historicalReactions.reduce((s, r) => s + Math.abs(r.surprise), 0) / event.historicalReactions.length
    : 0;
  const beatRate = hasHistory
    ? event.historicalReactions.filter((r) => r.surprise > 0).length
    : 0;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold font-mono text-primary terminal-glow">
              ${event.ticker}
            </h2>
            <span className="text-xs px-2.5 py-1 bg-secondary rounded text-muted-foreground uppercase">
              {event.quarter}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{event.company}</p>
        </div>
        <div className="text-right">
          {event.date && (
            <div className="flex items-center gap-1.5 text-terminal-amber text-sm">
              <Clock className="h-3.5 w-3.5" />
              {event.date} · {event.time}
            </div>
          )}
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "EPS Est.", value: event.epsEstimate ? `$${event.epsEstimate.toFixed(2)}` : "N/A", icon: Target },
          { label: "Rev Est.", value: event.revenueEstimate, icon: TrendingUp },
          { label: "Avg |Surprise|", value: hasHistory ? `${avgSurprise.toFixed(1)}%` : "N/A", icon: Zap },
          { label: "Beat Rate", value: hasHistory ? `${beatRate}/${event.historicalReactions.length}` : "N/A", icon: TrendingUp },
        ].map((stat) => (
          <div key={stat.label} className="bg-secondary rounded-lg p-4">
            <div className="flex items-center gap-1 text-muted-foreground text-[10px] uppercase tracking-wider mb-2">
              <stat.icon className="h-3 w-3" />
              {stat.label}
            </div>
            <div className="text-base font-mono font-semibold text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {hasHistory && chartData.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
            EPS Surprise %
          </h3>
          <div className="bg-secondary rounded-lg p-5">
            <ResponsiveContainer width="100%" height={200}>
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
                    borderRadius: "6px",
                    fontFamily: "JetBrains Mono",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value > 0 ? "+" : ""}${value.toFixed(1)}%`, "Surprise"]}
                />
                <ReferenceLine y={0} stroke="hsl(220, 15%, 20%)" />
                <Bar dataKey="surprise" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.surprise >= 0 ? "hsl(142, 70%, 45%)" : "hsl(0, 72%, 51%)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Historical Table */}
      {hasHistory && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
            Historical Earnings
          </h3>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary text-muted-foreground">
                  <th className="text-left px-4 py-3 font-medium">Quarter</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-right px-4 py-3 font-medium">EPS Act.</th>
                  <th className="text-right px-4 py-3 font-medium">EPS Est.</th>
                  <th className="text-right px-4 py-3 font-medium">Surprise</th>
                </tr>
              </thead>
              <tbody>
                {event.historicalReactions.map((r, i) => (
                  <tr key={i} className="border-t border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-foreground">{r.quarter}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{r.date}</td>
                    <td className="text-right px-4 py-3 font-mono">
                      {r.epsActual ? `$${r.epsActual.toFixed(2)}` : "—"}
                    </td>
                    <td className="text-right px-4 py-3 font-mono text-muted-foreground">
                      {r.epsEstimate ? `$${r.epsEstimate.toFixed(2)}` : "—"}
                    </td>
                    <td className={`text-right px-4 py-3 font-mono font-semibold ${r.surprise >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                      {r.surprise !== 0 ? `${r.surprise >= 0 ? "+" : ""}${r.surprise.toFixed(1)}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!hasHistory && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No historical earnings data available for {event.ticker}.
        </div>
      )}
    </div>
  );
};

export default EarningsDetail;
