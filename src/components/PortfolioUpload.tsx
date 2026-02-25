import { useState, useRef } from "react";
import { Upload, X, FileSpreadsheet } from "lucide-react";
import { sp500Stocks, Stock } from "@/data/sp500";
import * as XLSX from "xlsx";

interface PortfolioUploadProps {
  onPortfolioLoaded: (stocks: Stock[]) => void;
  compact?: boolean;
}

const PortfolioUpload = ({ onPortfolioLoaded, compact }: PortfolioUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loaded, setLoaded] = useState<string[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const extractTickers = (text: string): string[] => {
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
    return tickers;
  };

  const processTickers = (tickers: string[]) => {
    const unique = [...new Set(tickers)];
    // Match against known stocks, and create entries for unknown tickers too
    const stocks: Stock[] = unique.map((ticker) => {
      const known = sp500Stocks.find((s) => s.ticker === ticker);
      if (known) return known;
      return { ticker, name: ticker, sector: "Other", industry: "Other", marketCap: "Mid" as const };
    });
    setLoaded(unique);
    if (stocks.length > 0) {
      onPortfolioLoaded(stocks);
    }
  };

  const handleFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const csv = XLSX.utils.sheet_to_csv(sheet);
        processTickers(extractTickers(csv));
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) processTickers(extractTickers(text));
      };
      reader.readAsText(file);
    }
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
      className={`rounded-lg border-2 border-dashed cursor-pointer transition-all text-center ${
        compact ? "p-4" : "p-8"
      } ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground"
      }`}
    >
      <input
        ref={fileRef}
        type="file"
        accept=".csv,.txt,.xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <Upload className={`mx-auto mb-3 text-muted-foreground ${compact ? "h-5 w-5" : "h-8 w-8"}`} />
      {compact ? (
        <p className="text-xs text-muted-foreground">
          Drop CSV/XLSX or click
        </p>
      ) : (
        <>
          <p className="text-sm text-foreground font-medium mb-1">
            Drop your portfolio file here
          </p>
          <p className="text-xs text-muted-foreground">
            Supports CSV, TXT, and XLSX — parsed client-side, nothing leaves your browser
          </p>
        </>
      )}
    </div>
  );
};

export default PortfolioUpload;
