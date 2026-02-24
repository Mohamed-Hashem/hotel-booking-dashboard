import React, { memo } from "react";import type { Hotel, SortField, SortState } from "../../types";
import HotelCard from "../HotelCard";
import SortIndicator from "../SortIndicator";
import HotelRow from "../HotelRow";

interface HotelListProps {
  hotels: Hotel[];
  viewMode: "table" | "grid";
  sortState: SortState;
  onSortFieldChange: (field: SortField) => void;
}

const handleSortKeyDown =
  (field: SortField, onSort: (field: SortField) => void) =>
  (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSort(field);
    }
  };

const HotelList = memo<HotelListProps>(
  ({ hotels, viewMode, sortState, onSortFieldChange }) => {
    if (viewMode === "grid") {
      return (
        <div className="hotels-grid">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      );
    }

    return (
      <div className="table-container">
        <table className="hotels-table" aria-label="Hotels list">
          <thead>
            <tr>
              <th
                scope="col"
                role="button"
                tabIndex={0}
                onClick={() => onSortFieldChange("name")}
                onKeyDown={handleSortKeyDown("name", onSortFieldChange)}
                className="sortable"
                aria-sort={
                  sortState.primary === "name"
                    ? sortState.order === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                Name <SortIndicator field="name" sortState={sortState} />
              </th>
              <th scope="col">City</th>
              <th
                scope="col"
                role="button"
                tabIndex={0}
                onClick={() => onSortFieldChange("price")}
                onKeyDown={handleSortKeyDown("price", onSortFieldChange)}
                className="sortable"
                aria-sort={
                  sortState.primary === "price"
                    ? sortState.order === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                Price <SortIndicator field="price" sortState={sortState} />
              </th>
              <th
                scope="col"
                role="button"
                tabIndex={0}
                onClick={() => onSortFieldChange("rating")}
                onKeyDown={handleSortKeyDown("rating", onSortFieldChange)}
                className="sortable"
                aria-sort={
                  sortState.primary === "rating"
                    ? sortState.order === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                Rating <SortIndicator field="rating" sortState={sortState} />
              </th>
              <th scope="col">Amenities</th>
              <th scope="col">Availability</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <HotelRow key={hotel.id} hotel={hotel} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

HotelList.displayName = "HotelList";

export default HotelList;
