import {
  useMemo,
  useCallback,
  useState,
  useTransition,
  useDeferredValue,
} from "react";
import type { SortField, SortOrder, SortState, FilterLogic } from "./types";
import { HOTELS } from "./types";
import { useDebounce } from "./hooks/useDebounce";
import { useHotelFilters, FILTER_PRICE_RANGE } from "./hooks/useHotelFilters";
import {
  createHotelComparator,
  exportToCSV,
  isDateRangeValid,
  matchesAmenities,
} from "./utilities";
import EmptyState from "./Components/EmptyState";
import FilterPanel from "./Components/FilterPanel";
import HotelList from "./Components/HotelList";
import Pagination from "./Components/Pagination";
import { ResultsSkeleton, TableSkeleton } from "./Components/DashboardSkeleton";
import "./HotelBookingDashboard.css";

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 300;

const HotelBookingDashboard: React.FC = () => {
  const { filters, setFilter, clearFilters, activeFilterCount, dateError } =
    useHotelFilters();

  const [sortState, setSortState] = useState<SortState>({
    primary: "price",
    order: "asc",
    secondary: undefined,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [isPending, startTransition] = useTransition();
  const debouncedSearch = useDebounce(filters.search, DEBOUNCE_DELAY);
  const deferredSearch = useDeferredValue(debouncedSearch);

  const isLoading = filters.search !== debouncedSearch || isPending;

  const filteredHotels = useMemo(() => {
    const searchTerm = deferredSearch.trim().toLowerCase();

    return HOTELS.filter((hotel) => {
      const matchesSearch =
        !searchTerm ||
        hotel.name.toLowerCase().includes(searchTerm) ||
        hotel.city.toLowerCase().includes(searchTerm);

      const inPriceRange =
        hotel.price >= filters.minPrice && hotel.price <= filters.maxPrice;

      const meetsRating = hotel.rating >= filters.minRating;

      const hasAmenities = matchesAmenities(
        hotel.amenities,
        filters.amenities,
        filters.amenityLogic
      );

      const inDateRange =
        dateError !== null ||
        isDateRangeValid(hotel, filters.startDate, filters.endDate);

      return (
        matchesSearch &&
        inPriceRange &&
        meetsRating &&
        hasAmenities &&
        inDateRange
      );
    });
  }, [
    deferredSearch,
    filters.minPrice,
    filters.maxPrice,
    filters.minRating,
    filters.amenities,
    filters.amenityLogic,
    filters.startDate,
    filters.endDate,
    dateError,
  ]);

  const sortedHotels = useMemo(() => {
    const comparator = createHotelComparator(sortState);
    return [...filteredHotels].sort(comparator);
  }, [filteredHotels, sortState]);

  const totalPages = Math.max(1, Math.ceil(sortedHotels.length / PAGE_SIZE));

  const safeCurrentPage = useMemo(() => {
    return currentPage > totalPages ? 1 : Math.min(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const paginatedHotels = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return sortedHotels.slice(start, start + PAGE_SIZE);
  }, [sortedHotels, safeCurrentPage]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilter("search", e.target.value);
      startTransition(() => setCurrentPage(1));
    },
    [setFilter]
  );

  const handleMinPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(0, Number(e.target.value) || 0);
      startTransition(() => {
        setFilter("minPrice", value);
        setCurrentPage(1);
      });
    },
    [setFilter]
  );

  const handleMaxPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(
        0,
        Number(e.target.value) || FILTER_PRICE_RANGE.max
      );
      startTransition(() => {
        setFilter("maxPrice", value);
        setCurrentPage(1);
      });
    },
    [setFilter]
  );

  const handleRatingChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      startTransition(() => {
        setFilter("minRating", Number(e.target.value));
        setCurrentPage(1);
      });
    },
    [setFilter]
  );

  const handleAmenityToggle = useCallback(
    (amenity: string) => {
      const newAmenities = filters.amenities.includes(amenity)
        ? filters.amenities.filter((a) => a !== amenity)
        : [...filters.amenities, amenity];
      startTransition(() => {
        setFilter("amenities", newAmenities);
        setCurrentPage(1);
      });
    },
    [filters.amenities, setFilter]
  );

  const handleAmenityLogicChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      startTransition(() => {
        setFilter("amenityLogic", e.target.value as FilterLogic);
        setCurrentPage(1);
      });
    },
    [setFilter]
  );

  const handleStartDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      startTransition(() => {
        setFilter("startDate", e.target.value);
        setCurrentPage(1);
      });
    },
    [setFilter]
  );

  const handleEndDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      startTransition(() => {
        setFilter("endDate", e.target.value);
        setCurrentPage(1);
      });
    },
    [setFilter]
  );

  const handleSortFieldChange = useCallback((field: SortField) => {
    setSortState((prev) => ({
      ...prev,
      primary: field,
      order: prev.primary === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  }, []);

  const handleSortOrderChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortState((prev) => ({ ...prev, order: e.target.value as SortOrder }));
    },
    []
  );

  const handleSecondarySortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSortState((prev) => ({
        ...prev,
        secondary: value ? (value as SortField) : undefined,
      }));
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    document
      .getElementById("results-section")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleClearFilters = useCallback(() => {
    clearFilters();
    setCurrentPage(1);
  }, [clearFilters]);

  const handleExportCSV = useCallback(() => {
    exportToCSV(sortedHotels);
  }, [sortedHotels]);

  const handleViewModeChange = useCallback((mode: "table" | "grid") => {
    setViewMode(mode);
  }, []);

  return (
    <main className="dashboard" role="main">
      <header className="dashboard-header">
        <h1>🏨 Hotel Booking Dashboard</h1>
        <p className="subtitle">Find your perfect stay</p>
      </header>

      <FilterPanel
        filters={filters}
        activeFilterCount={activeFilterCount}
        dateError={dateError}
        isLoading={isLoading}
        onSearchChange={handleSearchChange}
        onMinPriceChange={handleMinPriceChange}
        onMaxPriceChange={handleMaxPriceChange}
        onRatingChange={handleRatingChange}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onAmenityToggle={handleAmenityToggle}
        onAmenityLogicChange={handleAmenityLogicChange}
        onClearFilters={handleClearFilters}
      />

      <section className="controls-panel" aria-label="Sort and view options">
        <div className="sort-controls">
          <div className="sort-group">
            <label htmlFor="sort-primary">Sort by</label>
            <select
              id="sort-primary"
              value={sortState.primary}
              onChange={(e) =>
                handleSortFieldChange(e.target.value as SortField)
              }
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
              onChange={handleSortOrderChange}
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
              onChange={handleSecondarySortChange}
            >
              <option value="">None</option>
              {sortState.primary !== "price" && (
                <option value="price">Price</option>
              )}
              {sortState.primary !== "rating" && (
                <option value="rating">Rating</option>
              )}
              {sortState.primary !== "name" && (
                <option value="name">Name</option>
              )}
            </select>
          </div>
        </div>
        <div className="view-controls">
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary"
            aria-label="Export to CSV"
            disabled={sortedHotels.length === 0}
          >
            📥 Export CSV
          </button>
          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              className={`btn ${
                viewMode === "grid" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => handleViewModeChange("grid")}
              aria-pressed={viewMode === "grid"}
            >
              Grid
            </button>
            <button
              className={`btn ${
                viewMode === "table" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => handleViewModeChange("table")}
              aria-pressed={viewMode === "table"}
            >
              Table
            </button>
          </div>
        </div>
      </section>

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
          <EmptyState onClear={handleClearFilters} />
        ) : (
          <>
            <div className="results-summary" aria-live="polite">
              Found {sortedHotels.length} hotel
              {sortedHotels.length !== 1 ? "s" : ""}
              {activeFilterCount > 0 && " matching your criteria"}
              {isPending && (
                <span className="pending-indicator"> (updating...)</span>
              )}
            </div>

            <HotelList
              hotels={paginatedHotels}
              viewMode={viewMode}
              sortState={sortState}
              onSortFieldChange={handleSortFieldChange}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                totalItems={sortedHotels.length}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default HotelBookingDashboard;
