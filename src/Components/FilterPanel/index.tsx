import React, { memo } from "react";
import type { Filters } from "../../types";
import { ALL_AMENITIES } from "../../types";
import { FILTER_PRICE_RANGE } from "../../hooks/useHotelFilters";

interface FilterPanelProps {
  filters: Filters;
  activeFilterCount: number;
  dateError: string | null;
  isLoading: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMinPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRatingChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAmenityToggle: (amenity: string) => void;
  onAmenityLogicChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClearFilters: () => void;
}

const FilterPanel = memo<FilterPanelProps>(
  ({
    filters,
    activeFilterCount,
    dateError,
    isLoading,
    onSearchChange,
    onMinPriceChange,
    onMaxPriceChange,
    onRatingChange,
    onStartDateChange,
    onEndDateChange,
    onAmenityToggle,
    onAmenityLogicChange,
    onClearFilters,
  }) => (
    <section className="filter-panel" aria-label="Filter options">
      <div className="filter-header">
        <h2>
          Filters
          {activeFilterCount > 0 && (
            <span
              className="filter-badge"
              aria-label={`${activeFilterCount} active filters`}
            >
              {activeFilterCount}
            </span>
          )}
        </h2>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="btn btn-secondary btn-small"
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="filter-grid">
        <div className="filter-group">
          <label htmlFor="search-input">Search</label>
          <div className="input-wrapper">
            <input
              id="search-input"
              type="text"
              placeholder="Hotel name or city..."
              value={filters.search}
              onChange={onSearchChange}
              aria-describedby="search-help"
            />
            {isLoading && <span className="input-spinner" aria-hidden="true" />}
          </div>
          <small id="search-help" className="help-text">
            Search by hotel name or city
          </small>
        </div>

        <div className="filter-group">
          <label>Price Range</label>
          <div className="price-inputs">
            <input
              type="number"
              min={FILTER_PRICE_RANGE.min}
              max={filters.maxPrice}
              value={filters.minPrice}
              onChange={onMinPriceChange}
              aria-label="Minimum price"
              placeholder="Min"
            />
            <span className="price-separator">to</span>
            <input
              type="number"
              min={filters.minPrice}
              max={FILTER_PRICE_RANGE.max}
              value={filters.maxPrice}
              onChange={onMaxPriceChange}
              aria-label="Maximum price"
              placeholder="Max"
            />
          </div>
          {filters.minPrice > filters.maxPrice && (
            <span className="error-text" role="alert">
              Min price cannot exceed max price
            </span>
          )}
        </div>

        <div className="filter-group">
          <label htmlFor="rating-select">Minimum Rating</label>
          <select
            id="rating-select"
            value={filters.minRating}
            onChange={onRatingChange}
          >
            <option value={0}>All ratings</option>
            <option value={3}>3+ stars</option>
            <option value={3.5}>3.5+ stars</option>
            <option value={4}>4+ stars</option>
            <option value={4.5}>4.5+ stars</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Availability Dates</label>
          <div className="date-inputs">
            <input
              type="date"
              value={filters.startDate}
              onChange={onStartDateChange}
              aria-label="Check-in date"
            />
            <span className="date-separator">to</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={onEndDateChange}
              aria-label="Check-out date"
            />
          </div>
          {dateError && (
            <span className="error-text" role="alert">
              {dateError === "invalid-range"
                ? "Check-in must be before check-out"
                : "Invalid date format"}
            </span>
          )}
        </div>

        <div className="filter-group amenities-group">
          <div className="amenities-header">
            <label>Amenities</label>
            <select
              value={filters.amenityLogic}
              onChange={onAmenityLogicChange}
              className="logic-select"
              aria-label="Filter logic"
            >
              <option value="AND">Match ALL</option>
              <option value="OR">Match ANY</option>
            </select>
          </div>
          <div
            className="amenities-checkboxes"
            role="group"
            aria-label="Available amenities"
          >
            {ALL_AMENITIES.map((amenity) => (
              <label key={amenity} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => onAmenityToggle(amenity)}
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
);

FilterPanel.displayName = "FilterPanel";

export default FilterPanel;
