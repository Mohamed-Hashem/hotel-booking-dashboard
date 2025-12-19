import { memo } from "react";
import type { SortField, SortState } from "../../types";

interface SortIndicatorProps {
  field: SortField;
  sortState: SortState;
}

const SortIndicator = memo<SortIndicatorProps>(({ field, sortState }) => {
  if (sortState.primary !== field) return null;
  return (
    <span className="sort-indicator" aria-hidden="true">
      {sortState.order === "asc" ? " ↑" : " ↓"}
    </span>
  );
});

SortIndicator.displayName = "SortIndicator";

export default SortIndicator;
