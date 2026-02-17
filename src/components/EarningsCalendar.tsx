import { EarningsEvent } from "@/data/mockEarnings";
import { Calendar, Clock, TrendingUp, TrendingDown, History } from "lucide-react";

interface EarningsCalendarProps {
  events: EarningsEvent[];
  onSelectEvent: (event: EarningsEvent) => void;
  selectedTicker?: string;
}

const EarningsCalendar = ({ events, onSelectEvent, selectedTicker }: EarningsCalendarProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventsWithDates = events.filter((e) => e.date);

  const upcomingEvents = eventsWithDates.filter((e) => {
    const d = new Date(e.date + "T12:00:00");
    return d >= today;
  });

  const recentEvents = eventsWithDates.filter((e) => {
    const d = new Date(e.date + "T12:00:00");
    return d < today;
  });

  const groupByDate = (list: EarningsEvent[]) =>
    list.reduce<Record<string, EarningsEvent[]>>((acc, e) => {
      (acc[e.date] = acc[e.date] || []).push(e);
      return acc;
    }, {});

  const upcomingGrouped = groupByDate(upcomingEvents);
  const recentGrouped = groupByDate(recentEvents);

  const sortedUpcoming = Object.keys(upcomingGrouped).sort();
  const sortedRecent = Object.keys(recentGrouped).sort().reverse();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const month = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { dayName, month, daysAway: diff };
  };

  const avgSurprise = (e: EarningsEvent) => {
    if (e.historicalReactions.length === 0) return 0;
    return e.historicalReactions.reduce((s, r) => s + r.surprise, 0) / e.historicalReactions.length;
  };

  const renderEventRow = (event: EarningsEvent) => {
    const avg = avgSurprise(event);
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
        {event.historicalReactions.length > 0 && (
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
        )}
      </button>
    );
  };

  const renderDateGroup = (date: string, groupedEvents: Record<string, EarningsEvent[]>, isPast?: boolean) => {
    const { dayName, month, daysAway } = formatDate(date);
    return (
      <div key={date} className="mb-3">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-secondary/50 rounded-sm mb-1">
          <span className="text-xs font-semibold text-foreground">{dayName}</span>
          <span className="text-xs text-muted-foreground">{month}</span>
          <span className="ml-auto text-xs text-terminal-amber">
            {isPast
              ? `${Math.abs(daysAway)}D AGO`
              : daysAway <= 0
              ? "TODAY"
              : daysAway === 1
              ? "TOMORROW"
              : `${daysAway}D`}
          </span>
        </div>
        {groupedEvents[date].map(renderEventRow)}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Upcoming Earnings */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            Upcoming Earnings
          </h2>
        </div>
        {sortedUpcoming.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No upcoming earnings in the next 30 days.
          </p>
        ) : (
          sortedUpcoming.map((date) => renderDateGroup(date, upcomingGrouped))
        )}
      </div>

      {/* Recent Past Earnings */}
      {sortedRecent.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <History className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Earnings (Past 30D)
            </h2>
          </div>
          {sortedRecent.map((date) => renderDateGroup(date, recentGrouped, true))}
        </div>
      )}
    </div>
  );
};

export default EarningsCalendar;
