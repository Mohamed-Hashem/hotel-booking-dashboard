import type {
  Comparator,
  FilterLogic,
  Hotel,
  SortField,
  SortState,
} from "../types";

export const isDateRangeValid = (
  hotel: Hotel,
  startDate: string,
  endDate: string
): boolean => {
  if (!startDate && !endDate) return true;

  const hotelStart = new Date(hotel.availability.checkIn);
  const hotelEnd = new Date(hotel.availability.checkOut);

  if (startDate && !endDate) {
    const userStart = new Date(startDate);
    return userStart >= hotelStart && userStart <= hotelEnd;
  }

  if (!startDate && endDate) {
    const userEnd = new Date(endDate);
    return userEnd >= hotelStart && userEnd <= hotelEnd;
  }

  const userStart = new Date(startDate);
  const userEnd = new Date(endDate);
  return userStart >= hotelStart && userEnd <= hotelEnd;
};

export const matchesAmenities = (
  hotelAmenities: string[],
  selectedAmenities: string[],
  logic: FilterLogic
): boolean => {
  if (selectedAmenities.length === 0) return true;

  return logic === "AND"
    ? selectedAmenities.every((a) => hotelAmenities.includes(a))
    : selectedAmenities.some((a) => hotelAmenities.includes(a));
};

const compareByField = (a: Hotel, b: Hotel, field: SortField): number => {
  switch (field) {
    case "name":
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    case "price":
      return a.price - b.price;
    case "rating":
      return a.rating - b.rating;
    default:
      return 0;
  }
};

export const createHotelComparator = (
  sortState: SortState
): Comparator<Hotel> => {
  return (a: Hotel, b: Hotel): number => {
    let comparison = compareByField(a, b, sortState.primary);
    if (sortState.order === "desc") comparison = -comparison;
    if (comparison === 0 && sortState.secondary) {
      comparison = compareByField(a, b, sortState.secondary);
    }
    return comparison;
  };
};

const sanitizeCSVValue = (value: string): string => {
  if (/^[=+\-@\t\r]/.test(value)) {
    return `'${value}`;
  }
  return value;
};

export const exportToCSV = (hotels: Hotel[]): void => {
  const headers = [
    "ID",
    "Name",
    "City",
    "Price",
    "Rating",
    "Amenities",
    "Check-in",
    "Check-out",
  ];
  const rows = hotels.map((h) => [
    h.id,
    `"${sanitizeCSVValue(h.name)}"`,
    `"${sanitizeCSVValue(h.city)}"`,
    h.price,
    h.rating,
    `"${sanitizeCSVValue(h.amenities.join(", "))}"`,
    h.availability.checkIn,
    h.availability.checkOut,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `hotels-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};
