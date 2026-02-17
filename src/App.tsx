import React, { Suspense, lazy } from "react";
import { BoardProvider } from "./context/BoardContext";

const Board = lazy(() => import("./components/Board/Board"));

const BoardSkeleton: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        padding: "2rem",
        minHeight: "100vh",
      }}
    >
      {[1, 2, 3].map((col) => (
        <div
          key={col}
          style={{
            flex: 1,
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            padding: "1rem",
            minHeight: "400px",
          }}
        >
          <div
            style={{
              height: "32px",
              backgroundColor: "#e0e0e0",
              borderRadius: "4px",
              marginBottom: "1rem",
            }}
          />
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              style={{
                height: "100px",
                backgroundColor: "#ececec",
                borderRadius: "4px",
                marginBottom: "0.5rem",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BoardProvider>
      <Suspense fallback={<BoardSkeleton />}>
        <Board />
      </Suspense>
    </BoardProvider>
  );
};

export default App;
