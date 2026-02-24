import { memo } from "react";
import type { Hotel } from "../../types";

interface HotelRowProps {
  hotel: Hotel;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const HotelRow = memo<HotelRowProps>(({ hotel }) => (
  <tr>
    <td data-label="Name">{hotel.name}</td>
    <td data-label="City">{hotel.city}</td>
    <td data-label="Price">{formatPrice(hotel.price)}</td>
    <td data-label="Rating">
      <span aria-hidden="true">⭐ </span>
      {hotel.rating.toFixed(1)}
    </td>
    <td data-label="Amenities">
      <div className="amenities-cell">
        {hotel.amenities.map((a) => (
          <span key={a} className="amenity-tag small">
            {a}
          </span>
        ))}
      </div>
    </td>
    <td data-label="Availability">
      {hotel.availability.checkIn} - {hotel.availability.checkOut}
    </td>
  </tr>
));

HotelRow.displayName = "HotelRow";

export default HotelRow;
