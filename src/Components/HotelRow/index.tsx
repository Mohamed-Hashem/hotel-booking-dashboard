import { memo } from "react";
import type { Hotel } from "../../types";

interface HotelRowProps {
  hotel: Hotel;
}

const HotelRow = memo<HotelRowProps>(
  ({ hotel }) => (
    <tr>
      <td data-label="Name">{hotel.name}</td>
      <td data-label="City">{hotel.city}</td>
      <td data-label="Price">${hotel.price}</td>
      <td data-label="Rating">⭐ {hotel.rating.toFixed(1)}</td>
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
  ),
  (prev, next) => prev.hotel.id === next.hotel.id
);

HotelRow.displayName = "HotelRow";

export default HotelRow;
