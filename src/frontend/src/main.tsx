import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./contexts/AuthContext";
import "./index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// On startup, clear any localStorage cache entries that contain empty arrays
// so stale empty results from pre-data searches don't persist across sessions.
function clearEmptyCacheEntries(): void {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith("kiddoscout_cache_")) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as {
              results: unknown[];
              timestamp: number;
            };
            if (Array.isArray(parsed.results) && parsed.results.length === 0) {
              localStorage.removeItem(key);
            }
          } catch {
            // ignore malformed entries
          }
        }
      }
    }
  } catch {
    // ignore storage errors
  }
}

clearEmptyCacheEntries();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: Number.POSITIVE_INFINITY,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
