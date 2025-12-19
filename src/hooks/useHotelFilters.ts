import { useState, useCallback, useEffect, useMemo } from "react";
import type { Filters, DateError, UseHotelFiltersReturn } from "../types";
import { HOTELS } from "../types";

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = "hotel-dashboard-filters";

const getPriceRange = () => {
  const prices = HOTELS.map((h) => h.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

const PRICE_RANGE = getPriceRange();

const getDefaultFilters = (): Filters => ({
  search: "",
  minPrice: PRICE_RANGE.min,
  maxPrice: PRICE_RANGE.max,
  amenities: [],
  amenityLogic: "AND",
  minRating: 0,
  startDate: "",
  endDate: "",
});

// ============================================================================
// URL PARAMETER HELPERS
// ============================================================================

const parseFiltersFromURL = (): Partial<Filters> => {
  const params = new URLSearchParams(window.location.search);
  const filters: Partial<Filters> = {};

  const search = params.get("search");
  if (search) filters.search = search;

  const minPrice = params.get("minPrice");
  if (minPrice) filters.minPrice = Number(minPrice);

  const maxPrice = params.get("maxPrice");
  if (maxPrice) filters.maxPrice = Number(maxPrice);

  const amenities = params.get("amenities");
  if (amenities) filters.amenities = amenities.split(",").filter(Boolean);

  const amenityLogic = params.get("amenityLogic");
  if (amenityLogic === "AND" || amenityLogic === "OR") {
    filters.amenityLogic = amenityLogic;
  }

  const minRating = params.get("minRating");
  if (minRating) filters.minRating = Number(minRating);

  const startDate = params.get("startDate");
  if (startDate) filters.startDate = startDate;

  const endDate = params.get("endDate");
  if (endDate) filters.endDate = endDate;

  return filters;
};

const updateURLWithFilters = (filters: Filters): void => {
  const defaults = getDefaultFilters();
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);

  if (filters.minPrice !== defaults.minPrice)
    params.set("minPrice", String(filters.minPrice));

  if (filters.maxPrice !== defaults.maxPrice)
    params.set("maxPrice", String(filters.maxPrice));

  if (filters.amenities.length > 0)
    params.set("amenities", filters.amenities.join(","));

  if (filters.amenityLogic !== defaults.amenityLogic)
    params.set("amenityLogic", filters.amenityLogic);

  if (filters.minRating !== defaults.minRating)
    params.set("minRating", String(filters.minRating));

  if (filters.startDate) params.set("startDate", filters.startDate);

  if (filters.endDate) params.set("endDate", filters.endDate);

  const queryString = params.toString();
  const newURL = queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname;

  // Use replaceState to avoid cluttering browser history
  window.history.replaceState(null, "", newURL);
};

// ============================================================================
// LOCALSTORAGE HELPERS
// ============================================================================

const saveFiltersToStorage = (filters: Filters): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.warn("Failed to save filters to localStorage:", error);
  }
};

const loadFiltersFromStorage = (): Partial<Filters> | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Partial<Filters>;
    }
  } catch (error) {
    console.warn("Failed to load filters from localStorage:", error);
  }
  return null;
};

// ============================================================================
// DATE VALIDATION
// ============================================================================

const validateDateRange = (startDate: string, endDate: string): DateError => {
  if (!startDate && !endDate) return null;

  // Check if dates are valid format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (startDate && !dateRegex.test(startDate)) return "invalid-format";
  if (endDate && !dateRegex.test(endDate)) return "invalid-format";

  // Check if both dates are valid
  if (startDate && isNaN(Date.parse(startDate))) return "invalid-format";
  if (endDate && isNaN(Date.parse(endDate))) return "invalid-format";

  // Check if start date is before or equal to end date
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) return "invalid-range";
  }

  return null;
};

// ============================================================================
// HOOK: useHotelFilters
// ============================================================================

export function useHotelFilters(): UseHotelFiltersReturn {
  const [filters, setFilters] = useState<Filters>(() => {
    const defaults = getDefaultFilters();

    const urlFilters = parseFiltersFromURL();
    if (Object.keys(urlFilters).length > 0) {
      return { ...defaults, ...urlFilters };
    }

    const storedFilters = loadFiltersFromStorage();
    if (storedFilters) {
      return { ...defaults, ...storedFilters };
    }

    return defaults;
  });

  const dateError = useMemo(
    () => validateDateRange(filters.startDate, filters.endDate),
    [filters.startDate, filters.endDate]
  );

  const activeFilterCount = useMemo(() => {
    const defaults = getDefaultFilters();
    let count = 0;

    if (filters.search.trim()) count++;
    if (filters.minPrice > defaults.minPrice) count++;
    if (filters.maxPrice < defaults.maxPrice) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.minRating > 0) count++;
    if (filters.startDate || filters.endDate) count++;

    return count;
  }, [filters]);

  useEffect(() => {
    updateURLWithFilters(filters);
    saveFiltersToStorage(filters);
  }, [filters]);

  const setFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters(getDefaultFilters());
  }, []);

  return {
    filters,
    setFilter,
    clearFilters,
    activeFilterCount,
    dateError,
  };
}

export const FILTER_PRICE_RANGE = PRICE_RANGE;
