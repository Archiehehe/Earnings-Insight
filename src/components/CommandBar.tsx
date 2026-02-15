import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { sp500Stocks, Stock } from "@/data/sp500";

interface CommandBarProps {
  onSelectStock: (stock: Stock) => void;
}

const CommandBar = ({ onSelectStock }: CommandBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.length > 0
    ? sp500Stocks.filter(
        (s) =>
          s.ticker.toLowerCase().includes(query.replace("$", "").toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      onSelectStock(filtered[selectedIndex]);
      setQuery("");
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 transition-colors focus-within:border-primary">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Search ticker or company... ⌘K"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-mono"
        />
        <span className="hidden sm:inline text-xs text-terminal-dim border border-border rounded px-1.5 py-0.5">
          ⌘K
        </span>
      </div>
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-border bg-card shadow-xl overflow-hidden">
          {filtered.map((stock, i) => (
            <button
              key={stock.ticker}
              onMouseDown={() => {
                onSelectStock(stock);
                setQuery("");
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                i === selectedIndex ? "bg-secondary" : "hover:bg-muted"
              }`}
            >
              <span className="font-mono font-semibold text-primary w-16">
                {stock.ticker}
              </span>
              <span className="text-foreground flex-1 truncate">{stock.name}</span>
              <span className="text-xs text-muted-foreground">{stock.sector}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommandBar;
