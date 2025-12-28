import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const resolveTargetDate = () => {
  const now = new Date();
  let target = new Date(now.getFullYear(), 0, 7, 23, 59, 59);
  if (now.getTime() > target.getTime()) {
    target = new Date(now.getFullYear() + 1, 0, 7, 23, 59, 59);
  }
  return target;
};

const buildCountdown = (milliseconds: number): Countdown => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
};

const formatUnit = (value: number) => value.toString().padStart(2, "0");

export default function PromoBanner() {
  const targetDate = useMemo(() => resolveTargetDate(), []);
  const [remainingMs, setRemainingMs] = useState(() => targetDate.getTime() - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs(targetDate.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const countdown = buildCountdown(remainingMs);

  return (
    <div className="w-full bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <Badge variant="secondary" className="uppercase tracking-wide">
            New Year Special
          </Badge>
          <span>$4 per image through January 7</span>
        </div>
        <div className="text-xs sm:text-sm font-semibold">
          Ends in {countdown.days}d {formatUnit(countdown.hours)}h {formatUnit(countdown.minutes)}m{" "}
          {formatUnit(countdown.seconds)}s
        </div>
      </div>
    </div>
  );
}
