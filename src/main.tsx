import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { onCLS, onINP, onLCP } from "web-vitals";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./Components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

onCLS(console.log);
onINP(console.log);
onLCP(console.log);
