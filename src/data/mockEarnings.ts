export interface EarningsEvent {
  ticker: string;
  company: string;
  date: string;
  time: "BMO" | "AMC" | "DMH"; // Before Market Open, After Market Close, During Market Hours
  quarter: string;
  epsEstimate: number;
  revenueEstimate: string;
  historicalReactions: HistoricalReaction[];
}

export interface HistoricalReaction {
  quarter: string;
  date: string;
  epsActual: number;
  epsEstimate: number;
  surprise: number;
  dayMove: number;
  weekMove: number;
}

// Generate dates relative to today
const today = new Date();
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r.toISOString().split("T")[0];
};

export const mockEarnings: EarningsEvent[] = [
  {
    ticker: "NVDA",
    company: "NVIDIA Corp.",
    date: addDays(today, 3),
    time: "AMC",
    quarter: "Q4 2025",
    epsEstimate: 0.89,
    revenueEstimate: "$38.5B",
    historicalReactions: [
      { quarter: "Q3 2025", date: "2025-11-20", epsActual: 0.81, epsEstimate: 0.75, surprise: 8.0, dayMove: 3.2, weekMove: 5.1 },
      { quarter: "Q2 2025", date: "2025-08-28", epsActual: 0.68, epsEstimate: 0.64, surprise: 6.3, dayMove: -6.4, weekMove: -2.1 },
      { quarter: "Q1 2025", date: "2025-05-28", epsActual: 0.61, epsEstimate: 0.59, surprise: 3.4, dayMove: 9.3, weekMove: 11.2 },
      { quarter: "Q4 2024", date: "2025-02-26", epsActual: 0.52, epsEstimate: 0.49, surprise: 6.1, dayMove: 16.4, weekMove: 8.7 },
    ],
  },
  {
    ticker: "AAPL",
    company: "Apple Inc.",
    date: addDays(today, 5),
    time: "AMC",
    quarter: "Q1 2026",
    epsEstimate: 2.35,
    revenueEstimate: "$124.1B",
    historicalReactions: [
      { quarter: "Q4 2025", date: "2025-10-30", epsActual: 1.64, epsEstimate: 1.60, surprise: 2.5, dayMove: -1.2, weekMove: 0.8 },
      { quarter: "Q3 2025", date: "2025-08-01", epsActual: 1.40, epsEstimate: 1.35, surprise: 3.7, dayMove: -4.8, weekMove: -3.2 },
      { quarter: "Q2 2025", date: "2025-05-01", epsActual: 1.53, epsEstimate: 1.50, surprise: 2.0, dayMove: 6.1, weekMove: 4.5 },
      { quarter: "Q1 2025", date: "2025-01-30", epsActual: 2.18, epsEstimate: 2.11, surprise: 3.3, dayMove: -3.5, weekMove: 1.2 },
    ],
  },
  {
    ticker: "MSFT",
    company: "Microsoft Corp.",
    date: addDays(today, 5),
    time: "AMC",
    quarter: "Q2 2026",
    epsEstimate: 3.22,
    revenueEstimate: "$68.7B",
    historicalReactions: [
      { quarter: "Q1 2026", date: "2025-10-29", epsActual: 3.30, epsEstimate: 3.10, surprise: 6.5, dayMove: 2.1, weekMove: 3.8 },
      { quarter: "Q4 2025", date: "2025-07-22", epsActual: 2.95, epsEstimate: 2.93, surprise: 0.7, dayMove: -3.6, weekMove: -1.4 },
      { quarter: "Q3 2025", date: "2025-04-30", epsActual: 2.94, epsEstimate: 2.82, surprise: 4.3, dayMove: 7.2, weekMove: 5.0 },
      { quarter: "Q2 2025", date: "2025-01-29", epsActual: 3.23, epsEstimate: 3.11, surprise: 3.9, dayMove: -6.2, weekMove: -4.1 },
    ],
  },
  {
    ticker: "TSLA",
    company: "Tesla Inc.",
    date: addDays(today, 7),
    time: "AMC",
    quarter: "Q4 2025",
    epsEstimate: 0.76,
    revenueEstimate: "$27.2B",
    historicalReactions: [
      { quarter: "Q3 2025", date: "2025-10-23", epsActual: 0.72, epsEstimate: 0.58, surprise: 24.1, dayMove: 21.9, weekMove: 18.3 },
      { quarter: "Q2 2025", date: "2025-07-23", epsActual: 0.52, epsEstimate: 0.46, surprise: 13.0, dayMove: -12.3, weekMove: -8.7 },
      { quarter: "Q1 2025", date: "2025-04-22", epsActual: 0.27, epsEstimate: 0.39, surprise: -30.8, dayMove: -9.7, weekMove: -5.2 },
      { quarter: "Q4 2024", date: "2025-01-29", epsActual: 0.73, epsEstimate: 0.76, surprise: -3.9, dayMove: 2.1, weekMove: 6.4 },
    ],
  },
  {
    ticker: "AMZN",
    company: "Amazon.com Inc.",
    date: addDays(today, 10),
    time: "AMC",
    quarter: "Q4 2025",
    epsEstimate: 1.49,
    revenueEstimate: "$187.3B",
    historicalReactions: [
      { quarter: "Q3 2025", date: "2025-10-30", epsActual: 1.43, epsEstimate: 1.14, surprise: 25.4, dayMove: 6.2, weekMove: 8.1 },
      { quarter: "Q2 2025", date: "2025-08-01", epsActual: 1.26, epsEstimate: 1.03, surprise: 22.3, dayMove: -8.8, weekMove: -5.3 },
      { quarter: "Q1 2025", date: "2025-04-29", epsActual: 0.98, epsEstimate: 0.83, surprise: 18.1, dayMove: 3.4, weekMove: 2.7 },
      { quarter: "Q4 2024", date: "2025-02-06", epsActual: 1.86, epsEstimate: 1.48, surprise: 25.7, dayMove: -4.1, weekMove: 1.9 },
    ],
  },
  {
    ticker: "META",
    company: "Meta Platforms Inc.",
    date: addDays(today, 12),
    time: "AMC",
    quarter: "Q4 2025",
    epsEstimate: 6.77,
    revenueEstimate: "$46.1B",
    historicalReactions: [
      { quarter: "Q3 2025", date: "2025-10-29", epsActual: 6.03, epsEstimate: 5.25, surprise: 14.9, dayMove: -4.1, weekMove: -1.8 },
      { quarter: "Q2 2025", date: "2025-07-30", epsActual: 5.16, epsEstimate: 4.73, surprise: 9.1, dayMove: 7.2, weekMove: 5.6 },
      { quarter: "Q1 2025", date: "2025-04-30", epsActual: 4.71, epsEstimate: 4.32, surprise: 9.0, dayMove: -10.6, weekMove: -7.3 },
      { quarter: "Q4 2024", date: "2025-01-29", epsActual: 8.02, epsEstimate: 6.71, surprise: 19.5, dayMove: -15.4, weekMove: -9.8 },
    ],
  },
  {
    ticker: "GOOGL",
    company: "Alphabet Inc.",
    date: addDays(today, 14),
    time: "AMC",
    quarter: "Q4 2025",
    epsEstimate: 2.12,
    revenueEstimate: "$96.8B",
    historicalReactions: [
      { quarter: "Q3 2025", date: "2025-10-29", epsActual: 2.12, epsEstimate: 1.84, surprise: 15.2, dayMove: -1.7, weekMove: 2.4 },
      { quarter: "Q2 2025", date: "2025-07-23", epsActual: 1.89, epsEstimate: 1.84, surprise: 2.7, dayMove: 5.1, weekMove: 3.8 },
      { quarter: "Q1 2025", date: "2025-04-24", epsActual: 2.81, epsEstimate: 2.01, surprise: 39.8, dayMove: 10.2, weekMove: 7.6 },
      { quarter: "Q4 2024", date: "2025-02-04", epsActual: 2.15, epsEstimate: 2.12, surprise: 1.4, dayMove: -7.3, weekMove: -3.1 },
    ],
  },
  {
    ticker: "JPM",
    company: "JPMorgan Chase",
    date: addDays(today, 2),
    time: "BMO",
    quarter: "Q4 2025",
    epsEstimate: 4.11,
    revenueEstimate: "$42.0B",
    historicalReactions: [
      { quarter: "Q3 2025", date: "2025-10-11", epsActual: 4.37, epsEstimate: 3.96, surprise: 10.4, dayMove: 4.4, weekMove: 2.1 },
      { quarter: "Q2 2025", date: "2025-07-12", epsActual: 4.40, epsEstimate: 4.19, surprise: 5.0, dayMove: 0.6, weekMove: 3.2 },
      { quarter: "Q1 2025", date: "2025-04-11", epsActual: 4.44, epsEstimate: 4.11, surprise: 8.0, dayMove: -5.2, weekMove: -2.4 },
      { quarter: "Q4 2024", date: "2025-01-15", epsActual: 4.81, epsEstimate: 4.09, surprise: 17.6, dayMove: 2.0, weekMove: 5.6 },
    ],
  },
];
