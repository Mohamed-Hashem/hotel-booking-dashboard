import React from "react";
import HotelCardSkeleton from "../HotelCardSkeleton";
import "./index.css";

export const ResultsSkeleton: React.FC = () => (
  <div className="hotels-grid">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <HotelCardSkeleton key={i} />
    ))}
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="table-container">
    <table className="hotels-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>City</th>
          <th>Price</th>
          <th>Rating</th>
          <th>Amenities</th>
          <th>Availability</th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3, 4, 5].map((i) => (
          <tr key={i}>
            {Array.from({ length: 6 }).map((_, j) => (
              <td key={j}>
                <div className="skeleton-line" style={{ height: "1rem" }} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const FilterSkeleton: React.FC = () => (
  <section className="filter-panel skeleton-mode">
    <div className="filter-header">
      <div
        className="skeleton-line"
        style={{ width: "100px", height: "2rem" }}
      />
    </div>
    <div className="filter-grid">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="filter-group">
          <div
            className="skeleton-line"
            style={{ width: "80px", height: "1rem", marginBottom: "0.5rem" }}
          />
          <div
            className="skeleton-line"
            style={{ width: "100%", height: "2.5rem" }}
          />
        </div>
      ))}
    </div>
  </section>
);

const DashboardSkeleton: React.FC = () => {
  return (
    <main className="dashboard skeleton-mode" aria-label="Loading dashboard">
      <header className="dashboard-header">
        <div
          className="skeleton-line"
          style={{ margin: "0 auto", width: "300px", height: "2.5rem" }}
        />
        <div
          className="skeleton-line"
          style={{
            margin: "0.5rem auto 0",
            width: "200px",
            height: "1.125rem",
          }}
        />
      </header>

      <FilterSkeleton />

      <div className="controls-panel">
        <div
          className="skeleton-line"
          style={{ width: "100%", height: "40px" }}
        />
      </div>

      <section className="results-section">
        <ResultsSkeleton />
      </section>
    </main>
  );
};

export default DashboardSkeleton;
