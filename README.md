# 🏨 Hotel Booking Dashboard

A high-performance, accessible, and feature-rich React dashboard for searching and filtering hotels. Built with **React 19**, **TypeScript**, and **Vite 7**, focusing on modern best practices and optimal user experience.

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646cff?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## ✨ Live Demo

[View Demo](https://hotel-booking-dashboard-neon.vercel.app/)

---

## 🚀 Features

### 🔍 Advanced Filtering

| Feature              | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| **Real-time Search** | Debounced search by hotel name or city with loading indicator |
| **Price Range**      | Filter by min/max price with instant validation               |
| **Rating Filter**    | Filter by minimum star rating (3+, 3.5+, 4+, 4.5+)            |
| **Amenity Logic**    | Multi-select amenities with **AND/OR** toggle logic           |
| **Date Range**       | Filter by check-in/check-out availability dates               |
| **Filter Badge**     | Visual counter showing active filters with "Clear All" option |

### 📊 Data Management

| Feature                 | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| **Multi-level Sorting** | Primary + secondary sort fields (Price, Rating, Name) |
| **View Modes**          | Toggle between **Grid View** and **Table View**       |
| **CSV Export**          | Export filtered results to CSV for offline analysis   |
| **Pagination**          | Browse large datasets with 10 items per page          |

### ⚡ Performance Optimizations

| Technique                | Implementation                                               |
| ------------------------ | ------------------------------------------------------------ |
| **Concurrent Rendering** | `useTransition` + `useDeferredValue` for non-blocking UI     |
| **Memoization**          | `useMemo`, `useCallback`, `React.memo` to prevent re-renders |
| **Lazy Loading**         | Code-split dashboard with `React.lazy` + `Suspense`          |
| **Skeleton Screens**     | Context-aware loading states for Grid/Table views            |
| **Debouncing**           | Custom `useDebounce` hook for search optimization            |

### ♿ Accessibility (WCAG 2.1)

- ✅ Semantic HTML with proper landmarks
- ✅ ARIA labels and live regions for screen readers
- ✅ Full keyboard navigation with focus indicators
- ✅ Color contrast compliant
- ✅ Responsive design (mobile, tablet, desktop)

### 💾 State Persistence

- **URL Sync**: Shareable filter states via query parameters
- **LocalStorage**: Filters persist across browser sessions

---

## 🏗️ Project Architecture

```
hotel-booking-dashboard/
├── public/
│   └── dashboard.svg           # App icon
├── src/
│   ├── Components/
│   │   ├── DashboardSkeleton/  # Loading skeleton for initial load
│   │   │   ├── index.tsx       # ResultsSkeleton, TableSkeleton, FilterSkeleton
│   │   │   └── index.css
│   │   ├── EmptyState/         # No results found UI
│   │   │   └── index.tsx
│   │   ├── ErrorBoundary.tsx   # Functional error boundary
│   │   ├── ErrorBoundary.css
│   │   ├── FilterPanel/        # All filter controls
│   │   │   └── index.tsx
│   │   ├── HotelCard/          # Grid view card
│   │   │   └── index.tsx
│   │   ├── HotelCardSkeleton/  # Shimmer loading for cards
│   │   │   ├── index.tsx
│   │   │   └── index.css
│   │   ├── HotelList/          # Grid/Table view container
│   │   │   └── index.tsx
│   │   ├── HotelRow/           # Table view row
│   │   │   └── index.tsx
│   │   ├── Pagination/         # Page navigation
│   │   │   └── index.tsx
│   │   └── SortIndicator/      # Sort direction arrows
│   │       └── index.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts      # Debounce utility hook
│   │   └── useHotelFilters.ts  # Filter state + URL/localStorage sync
│   ├── types/
│   │   └── index.ts            # TypeScript types + mock hotel data
│   ├── utilities/
│   │   └── index.ts            # Sorting, CSV export, date utilities
│   ├── App.tsx                 # Root with Suspense + lazy loading
│   ├── HotelBookingDashboard.tsx  # Main dashboard logic
│   ├── HotelBookingDashboard.css  # Dashboard styles
│   ├── index.css               # Global styles + CSS variables
│   └── main.tsx                # Entry point with ErrorBoundary
├── index.html                  # HTML template with SEO meta tags
├── package.json
├── tsconfig.json
├── vite.config.ts
└── eslint.config.js
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/Mohamed-Hashem/hotel-booking-dashboard.git

# Navigate to project directory
cd hotel-booking-dashboard

# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
# or
yarn build
```

### Preview Build

```bash
npm run preview
# or
yarn preview
```

### Linting

```bash
npm run lint
# or
yarn lint
```

---

## 📦 Component API Reference

### FilterPanel

Controls all filter inputs with memoized change handlers.

| Prop                | Type             | Description              |
| ------------------- | ---------------- | ------------------------ |
| `filters`           | `Filters`        | Current filter state     |
| `activeFilterCount` | `number`         | Number of active filters |
| `dateError`         | `string \| null` | Date validation error    |
| `isLoading`         | `boolean`        | Shows loading spinner    |
| `onSearchChange`    | `function`       | Search input handler     |
| `onClearFilters`    | `function`       | Reset all filters        |

### HotelList

Renders hotels in grid or table format with sortable columns.

| Prop                | Type                | Description                |
| ------------------- | ------------------- | -------------------------- |
| `hotels`            | `Hotel[]`           | Array of hotel objects     |
| `viewMode`          | `'grid' \| 'table'` | Current view mode          |
| `sortState`         | `SortState`         | Current sort configuration |
| `onSortFieldChange` | `function`          | Column sort handler        |

### Pagination

Page navigation with first/prev/next/last controls.

| Prop           | Type       | Description         |
| -------------- | ---------- | ------------------- |
| `currentPage`  | `number`   | Active page number  |
| `totalPages`   | `number`   | Total page count    |
| `totalItems`   | `number`   | Total hotel count   |
| `pageSize`     | `number`   | Items per page      |
| `onPageChange` | `function` | Page change handler |

---

## 🧪 Technical Decisions

| Decision                      | Rationale                                                        |
| ----------------------------- | ---------------------------------------------------------------- |
| **React 19 Transitions**      | `useTransition` keeps UI responsive during heavy filtering       |
| **Custom Filter Hook**        | `useHotelFilters` encapsulates state, URL sync, and localStorage |
| **CSS Variables**             | Consistent theming without CSS-in-JS overhead                    |
| **Functional Error Boundary** | Modern approach using window event listeners                     |
| **Skeleton Screens**          | Better perceived performance than spinners                       |
| **No External Dependencies**  | Pure React implementation for maximum control                    |

---

## 🔧 Configuration

### CSS Variables (src/index.css)

```css
:root {
  --color-primary: #4f46e5;
  --color-background: #f3f4f6;
  --color-surface: #ffffff;
  --color-text: #1f2937;
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --radius-lg: 0.75rem;
  --spacing-lg: 1.5rem;
}
```

### Filter Defaults (src/hooks/useHotelFilters.ts)

```typescript
const getDefaultFilters = (): Filters => ({
  search: "",
  minPrice: PRICE_RANGE.min,
  maxPrice: PRICE_RANGE.max,
  amenities: [],
  amenityLogic: "AND",
  minRating: 0,
  startDate: "",
  endDate: "",
});
```

---

## 👤 Author

**Mohamed Hashem**

- GitHub: [@Mohamed-Hashem](https://github.com/Mohamed-Hashem)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI Library
- [Vite](https://vitejs.dev/) - Build Tool
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
