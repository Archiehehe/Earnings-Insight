export interface Stock {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: "Mega" | "Large" | "Mid";
}

export const sp500Stocks: Stock[] = [
  { ticker: "AAPL", name: "Apple Inc.", sector: "Technology", industry: "Consumer Electronics", marketCap: "Mega" },
  { ticker: "MSFT", name: "Microsoft Corp.", sector: "Technology", industry: "Software", marketCap: "Mega" },
  { ticker: "GOOGL", name: "Alphabet Inc.", sector: "Technology", industry: "Internet Services", marketCap: "Mega" },
  { ticker: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Discretionary", industry: "E-Commerce", marketCap: "Mega" },
  { ticker: "NVDA", name: "NVIDIA Corp.", sector: "Technology", industry: "Semiconductors", marketCap: "Mega" },
  { ticker: "META", name: "Meta Platforms Inc.", sector: "Technology", industry: "Social Media", marketCap: "Mega" },
  { ticker: "TSLA", name: "Tesla Inc.", sector: "Consumer Discretionary", industry: "Auto Manufacturers", marketCap: "Mega" },
  { ticker: "BRK.B", name: "Berkshire Hathaway", sector: "Financials", industry: "Diversified Holding", marketCap: "Mega" },
  { ticker: "JPM", name: "JPMorgan Chase", sector: "Financials", industry: "Banks", marketCap: "Mega" },
  { ticker: "V", name: "Visa Inc.", sector: "Financials", industry: "Credit Services", marketCap: "Mega" },
  { ticker: "UNH", name: "UnitedHealth Group", sector: "Healthcare", industry: "Health Insurance", marketCap: "Mega" },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", industry: "Pharmaceuticals", marketCap: "Mega" },
  { ticker: "WMT", name: "Walmart Inc.", sector: "Consumer Staples", industry: "Retail", marketCap: "Mega" },
  { ticker: "MA", name: "Mastercard Inc.", sector: "Financials", industry: "Credit Services", marketCap: "Mega" },
  { ticker: "PG", name: "Procter & Gamble", sector: "Consumer Staples", industry: "Household Products", marketCap: "Mega" },
  { ticker: "HD", name: "Home Depot Inc.", sector: "Consumer Discretionary", industry: "Home Improvement", marketCap: "Large" },
  { ticker: "XOM", name: "Exxon Mobil Corp.", sector: "Energy", industry: "Oil & Gas", marketCap: "Mega" },
  { ticker: "CVX", name: "Chevron Corp.", sector: "Energy", industry: "Oil & Gas", marketCap: "Large" },
  { ticker: "LLY", name: "Eli Lilly & Co.", sector: "Healthcare", industry: "Pharmaceuticals", marketCap: "Mega" },
  { ticker: "ABBV", name: "AbbVie Inc.", sector: "Healthcare", industry: "Pharmaceuticals", marketCap: "Large" },
  { ticker: "PFE", name: "Pfizer Inc.", sector: "Healthcare", industry: "Pharmaceuticals", marketCap: "Large" },
  { ticker: "KO", name: "Coca-Cola Co.", sector: "Consumer Staples", industry: "Beverages", marketCap: "Large" },
  { ticker: "PEP", name: "PepsiCo Inc.", sector: "Consumer Staples", industry: "Beverages", marketCap: "Large" },
  { ticker: "MRK", name: "Merck & Co.", sector: "Healthcare", industry: "Pharmaceuticals", marketCap: "Large" },
  { ticker: "AVGO", name: "Broadcom Inc.", sector: "Technology", industry: "Semiconductors", marketCap: "Mega" },
  { ticker: "COST", name: "Costco Wholesale", sector: "Consumer Staples", industry: "Retail", marketCap: "Large" },
  { ticker: "TMO", name: "Thermo Fisher", sector: "Healthcare", industry: "Diagnostics", marketCap: "Large" },
  { ticker: "NFLX", name: "Netflix Inc.", sector: "Communication", industry: "Entertainment", marketCap: "Large" },
  { ticker: "CRM", name: "Salesforce Inc.", sector: "Technology", industry: "Software", marketCap: "Large" },
  { ticker: "AMD", name: "AMD Inc.", sector: "Technology", industry: "Semiconductors", marketCap: "Large" },
  { ticker: "INTC", name: "Intel Corp.", sector: "Technology", industry: "Semiconductors", marketCap: "Mid" },
  { ticker: "DIS", name: "Walt Disney Co.", sector: "Communication", industry: "Entertainment", marketCap: "Large" },
  { ticker: "BA", name: "Boeing Co.", sector: "Industrials", industry: "Aerospace & Defense", marketCap: "Large" },
  { ticker: "GS", name: "Goldman Sachs", sector: "Financials", industry: "Capital Markets", marketCap: "Large" },
  { ticker: "CAT", name: "Caterpillar Inc.", sector: "Industrials", industry: "Machinery", marketCap: "Large" },
  { ticker: "UBER", name: "Uber Technologies", sector: "Technology", industry: "Software", marketCap: "Large" },
  { ticker: "NOW", name: "ServiceNow Inc.", sector: "Technology", industry: "Software", marketCap: "Large" },
  { ticker: "PLTR", name: "Palantir Technologies", sector: "Technology", industry: "Software", marketCap: "Large" },
  { ticker: "NEE", name: "NextEra Energy", sector: "Utilities", industry: "Electric Utilities", marketCap: "Large" },
  { ticker: "DE", name: "Deere & Co.", sector: "Industrials", industry: "Machinery", marketCap: "Large" },
];

export const sectors = [...new Set(sp500Stocks.map(s => s.sector))].sort();
export const industries = [...new Set(sp500Stocks.map(s => s.industry))].sort();
