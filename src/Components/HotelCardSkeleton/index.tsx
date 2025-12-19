import { memo } from "react";
import "./index.css";

const HotelCardSkeleton = memo(() => (
  <div className="hotel-card skeleton" aria-hidden="true">
    <div className="skeleton-header">
      <div className="skeleton-line title" />
      <div className="skeleton-line rating" />
    </div>
    <div className="skeleton-line city" />
    <div className="skeleton-line price" />
    <div className="amenities">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-tag" />
      ))}
    </div>
    <div className="skeleton-line footer" />
  </div>
));

HotelCardSkeleton.displayName = "HotelCardSkeleton";

export default HotelCardSkeleton;
