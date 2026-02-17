import React, { useRef, useState, useCallback, useMemo } from "react";
import type { TaskId } from "../../types";

interface VirtualListProps {
  itemIds: TaskId[];
  renderItem: (id: TaskId, index: number) => React.ReactNode;
  itemHeight: number;
  windowSize?: number;
}

const VirtualList: React.FC<VirtualListProps> = ({
  itemIds,
  renderItem,
  itemHeight,
  windowSize = 20,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState<number>(0);

  const { startIndex, endIndex, visibleIds } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
    const end = Math.min(itemIds.length - 1, start + windowSize + 4);
    const visible = itemIds.slice(start, end + 1);

    return {
      startIndex: start,
      endIndex: end,
      visibleIds: visible,
    };
  }, [itemIds, itemHeight, scrollTop, windowSize]);

  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      if (containerRef.current) {
        setScrollTop(containerRef.current.scrollTop);
      }
    });
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        overflowY: "auto",
        maxHeight: "25rem",
      }}
    >
      <div style={{ height: startIndex * itemHeight }} />

      {visibleIds.map((id, i) => (
        <div key={id} style={{ height: itemHeight }}>
          {renderItem(id, startIndex + i)}
        </div>
      ))}

      <div style={{ height: (itemIds.length - endIndex - 1) * itemHeight }} />
    </div>
  );
};

export default VirtualList;
