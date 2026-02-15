import { Activity, Wifi, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const StatusBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const marketOpen = () => {
    const ny = new Date(time.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const h = ny.getHours();
    const m = ny.getMinutes();
    const mins = h * 60 + m;
    return mins >= 570 && mins < 960; // 9:30 - 16:00
  };

  const isOpen = marketOpen();

  return (
    <div className="h-6 border-t border-border bg-card flex items-center justify-between px-4 text-[10px] font-mono text-muted-foreground">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${isOpen ? "bg-terminal-green animate-pulse-green" : "bg-terminal-red"}`} />
          <span>NYSE {isOpen ? "OPEN" : "CLOSED"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="h-3 w-3" />
          <span>EARNINGS INTEL PRO</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Wifi className="h-3 w-3 text-terminal-green" />
          <span>CONNECTED</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{time.toLocaleTimeString("en-US", { hour12: false })}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
