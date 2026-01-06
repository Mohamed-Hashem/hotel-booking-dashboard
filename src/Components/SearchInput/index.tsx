import { memo, useEffect, useRef, useState } from "react";
import type { Hotel } from "../../types";
import { useDebounce } from "../../hooks/useDebounce";

interface SearchInputProps {
  value: string;
  baseHotels: Hotel[];
  onValueChange: (value: string) => void;
  onResults: (results: Hotel[]) => void;
  onSearchingChange?: (isSearching: boolean) => void;
  placeholder?: string;
  debounceMs?: number;
  isPending?: boolean;
}

const SearchInput = memo<SearchInputProps>(
  ({
    value,
    baseHotels,
    onValueChange,
    onResults,
    onSearchingChange,
    placeholder = "Hotel name or city...",
    debounceMs = 300,
    isPending = false,
  }) => {
    const [isSearching, setIsSearching] = useState(false);
    const abortRef = useRef<AbortController | null>(null);
    const debouncedValue = useDebounce(value, debounceMs);

    useEffect(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const term = debouncedValue.trim().toLowerCase();
      if (!term) {
        onResults(baseHotels);
        setIsSearching(false);
        onSearchingChange?.(false);
        return () => controller.abort();
      }

      const run = async () => {
        setIsSearching(true);
        onSearchingChange?.(true);
        try {
          // Simulated async work; replace with real fetch if needed.
          await new Promise((resolve) => setTimeout(resolve, 150));
          if (controller.signal.aborted) return;

          const filtered = baseHotels.filter(
            (hotel) =>
              hotel.name.toLowerCase().includes(term) ||
              hotel.city.toLowerCase().includes(term)
          );
          onResults(filtered);
        } finally {
          if (!controller.signal.aborted) {
            setIsSearching(false);
            onSearchingChange?.(false);
          }
        }
      };

      run();

      return () => controller.abort();
    }, [debouncedValue, baseHotels, onResults, onSearchingChange]);

    const showSpinner = isSearching || isPending;

    return (
      <div className="filter-group">
        <label htmlFor="search-input">Search</label>
        <div className="input-wrapper">
          <input
            id="search-input"
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            aria-describedby="search-help"
          />
          {showSpinner && <span className="input-spinner" aria-hidden="true" />}
        </div>
        <small id="search-help" className="help-text">
          Search by hotel name or city
        </small>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
