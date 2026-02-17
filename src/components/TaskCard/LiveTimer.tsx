import React, { useMemo } from "react";
import { useLiveTimer } from "../../hooks/useLiveTimer";

interface LiveTimerProps {
  updatedAt: number;
}

const LiveTimer: React.FC<LiveTimerProps> = ({ updatedAt }) => {
  const tick = useLiveTimer(10_000);

  const label = useMemo(() => {
    const secondsAgo = Math.floor((Date.now() - updatedAt) / 1000);
    if (secondsAgo < 60) return `Modified ${secondsAgo}s ago`;
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `Modified ${minutesAgo}m ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    return `Modified ${hoursAgo}h ago`;
  }, [updatedAt, tick]);

  return <span>{label}</span>;
};

export default LiveTimer;
