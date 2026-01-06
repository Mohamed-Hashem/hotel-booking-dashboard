import { memo } from "react";
import type { SortField, SortState } from "../../types";

interface ControlsPanelProps {
  sortState: SortState;
  viewMode: "table" | "grid";
  hasResults: boolean;
  onSortFieldChange: (field: SortField) => void;
  onSortOrderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSecondarySortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onExportCSV: () => void;
  onViewModeChange: (mode: "table" | "grid") => void;
}

const ControlsPanel = memo<ControlsPanelProps>(
  ({
    sortState,
    viewMode,
    hasResults,
    onSortFieldChange,
    onSortOrderChange,
    onSecondarySortChange,
    onExportCSV,
    onViewModeChange,
  }) => (
    <section className="controls-panel" aria-label="Sort and view options">
      <div className="sort-controls">
        <div className="sort-group">
          <label htmlFor="sort-primary">Sort by</label>
          <select
            id="sort-primary"
            value={sortState.primary}
            onChange={(e) => onSortFieldChange(e.target.value as SortField)}
          >
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="name">Name</option>
          </select>
        </div>
        <div className="sort-group">
          <label htmlFor="sort-order">Order</label>
          <select
            id="sort-order"
            value={sortState.order}
            onChange={onSortOrderChange}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div className="sort-group">
          <label htmlFor="sort-secondary">Then by</label>
          <select
            id="sort-secondary"
            value={sortState.secondary || ""}
            onChange={onSecondarySortChange}
          >
            <option value="">None</option>
            {sortState.primary !== "price" && (
              <option value="price">Price</option>
            )}
            {sortState.primary !== "rating" && (
              <option value="rating">Rating</option>
            )}
            {sortState.primary !== "name" && <option value="name">Name</option>}
          </select>
        </div>
      </div>
      <div className="view-controls">
        <button
          onClick={onExportCSV}
          className="btn btn-secondary"
          aria-label="Export to CSV"
          disabled={!hasResults}
        >
          📥 Export CSV
        </button>
        <div className="view-toggle" role="group" aria-label="View mode">
          <button
            className={`btn ${
              viewMode === "grid" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => onViewModeChange("grid")}
            aria-pressed={viewMode === "grid"}
          >
            Grid
          </button>
          <button
            className={`btn ${
              viewMode === "table" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => onViewModeChange("table")}
            aria-pressed={viewMode === "table"}
          >
            Table
          </button>
        </div>
      </div>
    </section>
  )
);

ControlsPanel.displayName = "ControlsPanel";

export default ControlsPanel;
