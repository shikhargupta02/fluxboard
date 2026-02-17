import React, { useState, useCallback, useDeferredValue } from "react";
import { useBoardContext } from "../../context/BoardContext";
import useTaskFilters from "../../hooks/useTaskFilters";
import { setFilter } from "../../store/actions";
import type { Priority } from "../../types";
import "./FilterBar.css";

const FilterBar: React.FC = () => {
  const { state, dispatch } = useBoardContext();
  const { hasActiveFilters } = useTaskFilters();
  const [textValue, setTextValue] = useState(state.filters.text);
  const deferredText = useDeferredValue(textValue);

  React.useEffect(() => {
    dispatch(setFilter({ text: deferredText }));
  }, [deferredText, dispatch]);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTextValue(e.target.value);
    },
    []
  );

  const handlePriorityClick = useCallback(
    (priority: Priority | null) => {
      if (state.filters.priority === priority) {
        dispatch(setFilter({ priority: null }));
      } else {
        dispatch(setFilter({ priority }));
      }
    },
    [state.filters.priority, dispatch]
  );

  const handleClearFilters = useCallback(() => {
    setTextValue("");
    dispatch(setFilter({ text: "", priority: null }));
  }, [dispatch]);

  return (
    <div className={"fbar__root"}>
      <div className={"fbar__search-wrapper "}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={textValue}
          onChange={handleTextChange}
          className={"fbar__search-input"}
          aria-label="Search tasks"
        />
      </div>

      <div className={"fbar__chip-group"}>
        <button
          className={`fbar__chip ${
            state.filters.priority === null ? "fbar__chip--active" : ""
          }`}
          onClick={() => handlePriorityClick(null)}
          aria-label="Show all priorities"
        >
          All
        </button>
        <button
          className={`fbar__chip ${
            state.filters.priority === 1 ? "fbar__chip--active" : ""
          }`}
          onClick={() => handlePriorityClick(1)}
          aria-label="Filter by low priority"
        >
          Low
        </button>
        <button
          className={`fbar__chip ${
            state.filters.priority === 2 ? "fbar__chip--active" : ""
          }`}
          onClick={() => handlePriorityClick(2)}
          aria-label="Filter by medium priority"
        >
          Medium
        </button>
        <button
          className={`fbar__chip ${
            state.filters.priority === 3 ? "fbar__chip--active" : ""
          }`}
          onClick={() => handlePriorityClick(3)}
          aria-label="Filter by high priority"
        >
          High
        </button>
      </div>

      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className={"fbar__clear-btn"}
          aria-label="Clear all filters"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
