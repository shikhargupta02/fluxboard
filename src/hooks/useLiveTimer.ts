import { useState, useEffect } from "react";

export function useLiveTimer(intervalMs: number = 10_000): number {
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((prev) => prev + 1);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return tick;
}
