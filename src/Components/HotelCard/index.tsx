import { memo } from "react";
import type { Hotel } from "../../types";

interface HotelCardProps {
  hotel: Hotel;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const HotelCard = memo<HotelCardProps>(({ hotel }) => (
  <article className="hotel-card" aria-labelledby={`hotel-${hotel.id}`}>
    <div className="hotel-card-header">
      <h3 id={`hotel-${hotel.id}`}>{hotel.name}</h3>
      <span className="rating" aria-label={`Rating: ${hotel.rating}`}>
        <span aria-hidden="true">⭐ </span>
        {hotel.rating.toFixed(1)}
      </span>
    </div>
    <p className="city">
      <span aria-hidden="true">📍 </span>
      {hotel.city}
    </p>
    <p className="price">
      {formatPrice(hotel.price)}
      <span className="per-night">/night</span>
    </p>
    <div className="amenities" aria-label="Amenities">
      {hotel.amenities.map((a) => (
        <span key={a} className="amenity-tag">
          {a}
        </span>
      ))}
    </div>
    <div className="availability">
      <span aria-hidden="true">📅 </span>
      {hotel.availability.checkIn} - {hotel.availability.checkOut}
    </div>
  </article>
));

HotelCard.displayName = "HotelCard";

export default HotelCard;
