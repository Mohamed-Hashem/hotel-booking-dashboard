import { memo, useEffect, useRef } from "react";

interface EmptyStateProps {
  onClear: () => void;
}

const EmptyState = memo<EmptyStateProps>(({ onClear }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      className="empty-state"
      role="alert"
      aria-live="polite"
      tabIndex={-1}
    >
      <span className="empty-icon" aria-hidden="true">
        🏨
      </span>
      <h3>No hotels found</h3>
      <p>Try adjusting your filters to find more results.</p>
      <button onClick={onClear} className="btn btn-primary">
        Clear all filters
      </button>
    </div>
  );
});

EmptyState.displayName = "EmptyState";

export default EmptyState;
