import React, { Suspense, lazy } from "react";
import DashboardSkeleton from "./Components/DashboardSkeleton";

const HotelBookingDashboard = lazy(() => import("./HotelBookingDashboard"));

const App: React.FC = () => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <HotelBookingDashboard />
    </Suspense>
  );
};

export default App;
