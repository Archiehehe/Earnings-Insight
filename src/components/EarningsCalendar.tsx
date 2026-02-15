import { mockEarnings, EarningsEvent } from "@/data/mockEarnings";
import { Calendar, Clock, TrendingUp, TrendingDown } from "lucide-react";

interface EarningsCalendarProps {
  onSelectEvent: (event: EarningsEvent) => void;
  selectedTicker?: string;
}

const EarningsCalendar = ({ onSelectEvent, selectedTicker }: EarningsCalendarProps) => {
  const grouped = mockEarnings.reduce<Record<string, EarningsEvent[]>>((acc, e) => {
    (acc[e.date] = acc[e.date] || []).push(e);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    const today = new Date();
    const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const month = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { dayName, month, daysAway: diff };
  };

  const avgReaction = (e: EarningsEvent) => {
    const avg = e.historicalReactions.reduce((s, r) => s + r.dayMove, 0) / e.historicalReactions.length;
    return avg;
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
          Upcoming Earnings
        </h2>
      </div>

      {sortedDates.map((date) => {
        const { dayName, month, daysAway } = formatDate(date);
        return (
          <div key={date} className="mb-3">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-secondary/50 rounded-sm mb-1">
              <span className="text-xs font-semibold text-foreground">{dayName}</span>
              <span className="text-xs text-muted-foreground">{month}</span>
              <span className="ml-auto text-xs text-terminal-amber">
                {daysAway === 0 ? "TODAY" : daysAway === 1 ? "TOMORROW" : `${daysAway}D`}
              </span>
            </div>
            {grouped[date].map((event) => {
              const avg = avgReaction(event);
              const isSelected = selectedTicker === event.ticker;
              return (
                <button
                  key={event.ticker}
                  onClick={() => onSelectEvent(event)}
                  className={`w-full flex items-center gap-2 px-2 py-2 text-left text-sm rounded-sm transition-all ${
                    isSelected
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted border border-transparent"
                  }`}
                >
                  <span className="font-mono font-bold text-primary w-14 text-xs">
                    {event.ticker}
                  </span>
                  <span className="flex-1 text-xs text-foreground truncate">
                    {event.company}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-mono min-w-[48px] justify-end ${
                      avg >= 0 ? "text-terminal-green" : "text-terminal-red"
                    }`}
                  >
                    {avg >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {avg >= 0 ? "+" : ""}
                    {avg.toFixed(1)}%
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default EarningsCalendar;
