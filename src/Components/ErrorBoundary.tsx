import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import "./ErrorBoundary.css";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface FallbackProps {
  message?: string;
  onReset: () => void;
  onReload: () => void;
}

const ErrorFallback: React.FC<FallbackProps> = ({
  message,
  onReset,
  onReload,
}) => (
  <div className="error-boundary">
    <div className="error-card" role="alert" aria-live="assertive">
      <h1>Something went wrong</h1>
      <p>{message || "Please try again."}</p>
      <div className="error-actions">
        <button type="button" onClick={onReset}>
          Try again
        </button>
        <button type="button" onClick={onReload}>
          Reload page
        </button>
      </div>
    </div>
  </div>
);

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleReset = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      console.error(
        "Error boundary caught an error",
        event.error || event.message
      );
      setErrorMessage(
        event?.error?.message || event.message || "Unexpected error"
      );
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled rejection", event.reason);
      const reason =
        event.reason instanceof Error
          ? event.reason.message
          : String(event.reason);
      setErrorMessage(reason || "Unexpected error");
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  const content = useMemo(() => {
    if (errorMessage) {
      return (
        <ErrorFallback
          message={errorMessage}
          onReset={handleReset}
          onReload={handleReload}
        />
      );
    }
    return children;
  }, [children, errorMessage, handleReload, handleReset]);

  return content;
};

export default ErrorBoundary;
