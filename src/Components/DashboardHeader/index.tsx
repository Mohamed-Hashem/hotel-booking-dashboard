import { memo } from "react";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

const DashboardHeader = memo<DashboardHeaderProps>(
  ({
    title = "🏨 Hotel Booking Dashboard",
    subtitle = "Find your perfect stay",
  }) => (
    <header className="dashboard-header">
      <h1>{title}</h1>
      <p className="subtitle">{subtitle}</p>
    </header>
  )
);

DashboardHeader.displayName = "DashboardHeader";

export default DashboardHeader;
