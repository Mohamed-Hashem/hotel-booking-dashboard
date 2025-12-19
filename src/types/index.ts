export type Hotel = {
  id: number;
  name: string;
  city: string;
  price: number;
  rating: number;
  amenities: string[];
  availability: {
    checkIn: string; // ISO date string (YYYY-MM-DD)
    checkOut: string;
  };
};

export type SortField = "price" | "rating" | "name";

export type SortOrder = "asc" | "desc";

export type SortState = {
  primary: SortField;
  order: SortOrder;
  secondary?: SortField;
};

export type FilterLogic = "AND" | "OR";

export type Filters = {
  search: string;
  minPrice: number;
  maxPrice: number;
  amenities: string[];
  amenityLogic: FilterLogic;
  minRating: number;
  startDate: string;
  endDate: string;
};

export type DateError = "invalid-range" | "invalid-format" | null;

export interface UseHotelFiltersReturn {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  dateError: DateError;
}

export const ALL_AMENITIES = [
  "WiFi",
  "Pool",
  "Gym",
  "Beach",
  "Spa",
  "Restaurant",
  "Parking",
  "Bar",
] as const;

export const HOTELS: Hotel[] = [
  {
    id: 1,
    name: "Agoda Palace",
    city: "Bangkok",
    price: 120,
    rating: 4.5,
    amenities: ["WiFi", "Pool", "Gym"],
    availability: { checkIn: "2025-01-15", checkOut: "2025-01-20" },
  },
  {
    id: 2,
    name: "Seaside View",
    city: "Phuket",
    price: 80,
    rating: 4.2,
    amenities: ["WiFi", "Beach"],
    availability: { checkIn: "2025-01-10", checkOut: "2025-01-25" },
  },
  {
    id: 3,
    name: "Mountain Stay",
    city: "Chiang Mai",
    price: 100,
    rating: 4.8,
    amenities: ["WiFi", "Gym", "Spa"],
    availability: { checkIn: "2025-01-05", checkOut: "2025-01-30" },
  },
  {
    id: 4,
    name: "Urban Loft",
    city: "Bangkok",
    price: 150,
    rating: 4.6,
    amenities: ["WiFi", "Pool", "Restaurant"],
    availability: { checkIn: "2025-01-12", checkOut: "2025-01-18" },
  },
  {
    id: 5,
    name: "Tropical Resort",
    city: "Phuket",
    price: 200,
    rating: 4.9,
    amenities: ["WiFi", "Pool", "Beach", "Spa"],
    availability: { checkIn: "2025-01-08", checkOut: "2025-01-22" },
  },
  {
    id: 6,
    name: "City Center Hotel",
    city: "Bangkok",
    price: 90,
    rating: 4.0,
    amenities: ["WiFi", "Restaurant", "Parking"],
    availability: { checkIn: "2025-01-01", checkOut: "2025-02-28" },
  },
  {
    id: 7,
    name: "Beachfront Paradise",
    city: "Phuket",
    price: 250,
    rating: 4.7,
    amenities: ["WiFi", "Pool", "Beach", "Spa", "Restaurant"],
    availability: { checkIn: "2025-01-05", checkOut: "2025-01-25" },
  },
  {
    id: 8,
    name: "Jungle Retreat",
    city: "Chiang Mai",
    price: 130,
    rating: 4.4,
    amenities: ["WiFi", "Spa", "Restaurant"],
    availability: { checkIn: "2025-01-10", checkOut: "2025-01-28" },
  },
  {
    id: 9,
    name: "Royal Orchid",
    city: "Bangkok",
    price: 180,
    rating: 4.8,
    amenities: ["WiFi", "Pool", "Gym", "Spa", "Restaurant", "Bar"],
    availability: { checkIn: "2025-01-15", checkOut: "2025-02-15" },
  },
  {
    id: 10,
    name: "Sunset Bay Resort",
    city: "Phuket",
    price: 160,
    rating: 4.3,
    amenities: ["WiFi", "Beach", "Pool", "Bar"],
    availability: { checkIn: "2025-01-12", checkOut: "2025-01-30" },
  },
  {
    id: 11,
    name: "Heritage Boutique",
    city: "Chiang Mai",
    price: 110,
    rating: 4.6,
    amenities: ["WiFi", "Restaurant", "Spa"],
    availability: { checkIn: "2025-01-08", checkOut: "2025-02-10" },
  },
  {
    id: 12,
    name: "Grand Metropolitan",
    city: "Bangkok",
    price: 220,
    rating: 4.9,
    amenities: ["WiFi", "Pool", "Gym", "Spa", "Restaurant", "Bar", "Parking"],
    availability: { checkIn: "2025-01-01", checkOut: "2025-03-01" },
  },
  {
    id: 13,
    name: "Coconut Beach Villa",
    city: "Phuket",
    price: 300,
    rating: 5.0,
    amenities: ["WiFi", "Pool", "Beach", "Spa", "Restaurant", "Bar"],
    availability: { checkIn: "2025-01-20", checkOut: "2025-02-20" },
  },
  {
    id: 14,
    name: "Budget Inn",
    city: "Bangkok",
    price: 45,
    rating: 3.5,
    amenities: ["WiFi"],
    availability: { checkIn: "2025-01-01", checkOut: "2025-12-31" },
  },
  {
    id: 15,
    name: "Riverside Lodge",
    city: "Chiang Mai",
    price: 85,
    rating: 4.1,
    amenities: ["WiFi", "Restaurant", "Parking"],
    availability: { checkIn: "2025-01-15", checkOut: "2025-02-28" },
  },
];

export type Comparator<T> = (a: T, b: T) => number;
