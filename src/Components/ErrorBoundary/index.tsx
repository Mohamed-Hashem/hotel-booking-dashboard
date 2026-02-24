import React, { type ReactNode } from "react";
import "./index.css";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  errorMessage?: string;
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

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { errorMessage: error.message || "Unexpected error" };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("ErrorBoundary caught an error", error, info);
  }

  private handleReset = () => {
    this.setState({ errorMessage: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.errorMessage) {
      return (
        <ErrorFallback
          message={this.state.errorMessage}
          onReset={this.handleReset}
          onReload={this.handleReload}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
