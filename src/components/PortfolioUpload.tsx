import { useState, useRef } from "react";
import { Upload, X, FileSpreadsheet } from "lucide-react";
import { sp500Stocks, Stock } from "@/data/sp500";

interface PortfolioUploadProps {
  onPortfolioLoaded: (stocks: Stock[]) => void;
}

const PortfolioUpload = ({ onPortfolioLoaded }: PortfolioUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loaded, setLoaded] = useState<string[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string) => {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const tickers: string[] = [];

    for (const line of lines) {
      const parts = line.split(",").map((p) => p.trim().replace(/"/g, "").toUpperCase());
      for (const part of parts) {
        const clean = part.replace("$", "");
        if (clean.length >= 1 && clean.length <= 6 && /^[A-Z.]+$/.test(clean)) {
          tickers.push(clean);
        }
      }
    }

    const unique = [...new Set(tickers)];
    const matched = sp500Stocks.filter((s) => unique.includes(s.ticker));
    setLoaded(unique);
    if (matched.length > 0) {
      onPortfolioLoaded(matched);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) parseCSV(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  if (loaded) {
    return (
      <div className="rounded-md border border-border bg-secondary p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">Portfolio Loaded</span>
          </div>
          <button
            onClick={() => {
              setLoaded(null);
              onPortfolioLoaded([]);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground">
          {loaded.length} tickers parsed · {sp500Stocks.filter((s) => loaded.includes(s.ticker)).length} matched
        </p>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileRef.current?.click()}
      className={`rounded-md border-2 border-dashed p-4 cursor-pointer transition-colors text-center ${
        isDragging ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
      }`}
    >
      <input
        ref={fileRef}
        type="file"
        accept=".csv,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <Upload className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">
        Drop CSV portfolio or click to upload
      </p>
    </div>
  );
};

export default PortfolioUpload;
