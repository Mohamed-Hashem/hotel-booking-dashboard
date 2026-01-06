import { memo } from "react";
import type { Hotel, SortField, SortState } from "../../types";
import EmptyState from "../EmptyState";
import HotelList from "../HotelList";
import Pagination from "../Pagination";
import { ResultsSkeleton, TableSkeleton } from "../DashboardSkeleton";

interface ResultsSectionProps {
  isLoading: boolean;
  isPending: boolean;
  viewMode: "table" | "grid";
  paginatedHotels: Hotel[];
  totalHotels: number;
  activeFilterCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  sortState: SortState;
  onSortFieldChange: (field: SortField) => void;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

const ResultsSection = memo<ResultsSectionProps>(
  ({
    isLoading,
    isPending,
    viewMode,
    paginatedHotels,
    totalHotels,
    activeFilterCount,
    currentPage,
    totalPages,
    pageSize,
    sortState,
    onSortFieldChange,
    onPageChange,
    onClearFilters,
  }) => (
    <section
      id="results-section"
      className="results-section"
      aria-label="Search results"
    >
      {isLoading ? (
        viewMode === "grid" ? (
          <ResultsSkeleton />
        ) : (
          <TableSkeleton />
        )
      ) : paginatedHotels.length === 0 ? (
        <EmptyState onClear={onClearFilters} />
      ) : (
        <>
          <div className="results-summary" aria-live="polite">
            Found {totalHotels} hotel
            {totalHotels !== 1 ? "s" : ""}
            {activeFilterCount > 0 && " matching your criteria"}
            {isPending && (
              <span className="pending-indicator"> (updating...)</span>
            )}
          </div>

          <HotelList
            hotels={paginatedHotels}
            viewMode={viewMode}
            sortState={sortState}
            onSortFieldChange={onSortFieldChange}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalHotels}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </section>
  )
);

ResultsSection.displayName = "ResultsSection";

export default ResultsSection;
