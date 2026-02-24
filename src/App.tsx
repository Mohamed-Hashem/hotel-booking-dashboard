import {
  useMemo,
  useCallback,
  useState,
  useTransition,
  Suspense,
  lazy,
} from "react";
import type { SortField, SortOrder, SortState, FilterLogic } from "./types";
import { HOTELS } from "./types";
import { useHotelFilters, FILTER_PRICE_RANGE } from "./hooks/useHotelFilters";
import {
  createHotelComparator,
  exportToCSV,
  isDateRangeValid,
  matchesAmenities,
} from "./utilities";
import DashboardSkeleton from "./Components/DashboardSkeleton";
import DashboardHeader from "./Components/DashboardHeader";
import FilterPanel from "./Components/FilterPanel";
import ControlsPanel from "./Components/ControlsPanel";
import "./App.css";

const ResultsSection = lazy(() => import("./Components/ResultsSection"));

const PAGE_SIZE = 10;

const HotelBookingDashboard: React.FC = () => {
  const { filters, setFilter, clearFilters, activeFilterCount, dateError } =
    useHotelFilters();

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(HOTELS);

  const [sortState, setSortState] = useState<SortState>({
    primary: "price",
    order: "asc",
    secondary: undefined,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [isPending, startTransition] = useTransition();
  const isLoading = isSearching || isPending;

  const filteredHotels = useMemo(() => {
    return searchResults.filter((hotel) => {
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

      return inPriceRange && meetsRating && hasAmenities && inDateRange;
    });
  }, [
    searchResults,
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

  const handleSearchValueChange = useCallback(
    (value: string) => {
      setFilter("search", value);
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
    <Suspense fallback={<DashboardSkeleton />}>
      <main className="dashboard">
        <a href="#results-section" className="skip-link">
          Skip to results
        </a>
        <DashboardHeader />

        <FilterPanel
          filters={filters}
          activeFilterCount={activeFilterCount}
          dateError={dateError}
          isLoading={isLoading}
          searchValue={filters.search}
          baseHotels={HOTELS}
          onSearchValueChange={handleSearchValueChange}
          onSearchResults={setSearchResults}
          onSearchingChange={setIsSearching}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
          onRatingChange={handleRatingChange}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onAmenityToggle={handleAmenityToggle}
          onAmenityLogicChange={handleAmenityLogicChange}
          onClearFilters={handleClearFilters}
        />

        <ControlsPanel
          sortState={sortState}
          viewMode={viewMode}
          hasResults={sortedHotels.length > 0}
          onSortFieldChange={handleSortFieldChange}
          onSortOrderChange={handleSortOrderChange}
          onSecondarySortChange={handleSecondarySortChange}
          onExportCSV={handleExportCSV}
          onViewModeChange={handleViewModeChange}
        />

        <ResultsSection
          isLoading={isLoading}
          isPending={isPending}
          viewMode={viewMode}
          paginatedHotels={paginatedHotels}
          totalHotels={sortedHotels.length}
          activeFilterCount={activeFilterCount}
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          sortState={sortState}
          onSortFieldChange={handleSortFieldChange}
          onPageChange={handlePageChange}
          onClearFilters={handleClearFilters}
        />
      </main>
    </Suspense>
  );
};

export default HotelBookingDashboard;
