import { useQuery } from "@tanstack/react-query";
import type { Activity } from "../types/index";
// Activity type imported from ../types/index above
import { useActor } from "./useActor";

// ---------------------------------------------------------------------------
// localStorage cache helpers — keyed by city + state
// ---------------------------------------------------------------------------
function getCacheKey(city: string, state: string, category?: string): string {
  const c = city.trim().toLowerCase().replace(/\s+/g, "_");
  const s = state.trim().toLowerCase().replace(/\s+/g, "_");
  const cat = category
    ? `_${category.trim().toLowerCase().replace(/\s+/g, "_")}`
    : "";
  return `kiddoscout_v3_${c}_${s}${cat}`;
}

function readCache(
  city: string,
  state: string,
  category?: string,
): Activity[] | null {
  try {
    const raw = localStorage.getItem(getCacheKey(city, state, category));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      results: Activity[];
      timestamp: number;
    };
    // Treat empty cached results as miss — stale from before data was added
    if (!parsed.results || parsed.results.length === 0) return null;
    return parsed.results;
  } catch {
    return null;
  }
}

function writeCache(
  city: string,
  state: string,
  results: Activity[],
  category?: string,
): void {
  try {
    if (results.length === 0) return; // never cache empty results
    const payload = { results, timestamp: Date.now() };
    localStorage.setItem(
      getCacheKey(city, state, category),
      JSON.stringify(payload),
    );
  } catch {
    // Ignore storage errors
  }
}

/** Clear all v1 (old) cache entries that may have empty/stale data */
export function clearLegacyCache(): void {
  try {
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key?.startsWith("kiddoscout_cache_") ||
        key?.startsWith("kiddoscout_v2_")
      ) {
        toRemove.push(key);
      }
    }
    for (const key of toRemove) {
      localStorage.removeItem(key);
    }
  } catch {
    // Ignore
  }
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useGetActivities() {
  const { actor, isFetching } = useActor();
  return useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActivities();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Activity[]>({
    queryKey: ["activities", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "All") return actor.getActivities();
      return actor.getByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchActivities(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Activity[]>({
    queryKey: ["activities", "search", query],
    queryFn: async () => {
      if (!actor) return [];
      if (!query || query.length < 2) return actor.getActivities();
      return actor.searchActivities(query);
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * Exact-match hook: fetches all activities for a specific city + state.
 * Uses localStorage cache; pass skipCache=true to force a fresh backend call.
 */
export async function fetchActivitiesByCityAndState(
  actor: {
    getActivitiesByCityAndState(
      city: string,
      state: string,
    ): Promise<Activity[]>;
  },
  city: string,
  state: string,
  skipCache = false,
): Promise<Activity[]> {
  const trimCity = city.trim();
  const trimState = state.trim();

  if (!skipCache) {
    const cached = readCache(trimCity, trimState);
    if (cached) return cached;
  }

  const results = await actor.getActivitiesByCityAndState(trimCity, trimState);
  const safe = results ?? [];
  writeCache(trimCity, trimState, safe);
  return safe;
}

/**
 * Exact-match hook: fetches activities for a specific city + state + category.
 * Uses localStorage cache; pass skipCache=true to force a fresh backend call.
 */
export async function fetchActivitiesByCityStateAndCategory(
  actor: {
    getActivitiesByCityStateAndCategory(
      city: string,
      state: string,
      category: string,
    ): Promise<Activity[]>;
  },
  city: string,
  state: string,
  category: string,
  skipCache = false,
): Promise<Activity[]> {
  const trimCity = city.trim();
  const trimState = state.trim();
  const trimCategory = category.trim();

  if (!skipCache) {
    const cached = readCache(trimCity, trimState, trimCategory);
    if (cached) return cached;
  }

  const results = await actor.getActivitiesByCityStateAndCategory(
    trimCity,
    trimState,
    trimCategory,
  );
  const safe = results ?? [];
  writeCache(trimCity, trimState, safe, trimCategory);
  return safe;
}

/**
 * Fetch weekend events for a specific city + state.
 * Always goes to the backend (no cache) so events stay fresh.
 */
export async function fetchWeekendEventsByCityAndState(
  actor: {
    getWeekendEventsByCityAndState(
      city: string,
      state: string,
      currentDate: string | null,
    ): Promise<Activity[]>;
  },
  city: string,
  state: string,
): Promise<Activity[]> {
  const trimCity = city.trim();
  const trimState = state.trim();
  const todayIso = new Date().toISOString().split("T")[0];
  const results = await actor.getWeekendEventsByCityAndState(
    trimCity,
    trimState,
    todayIso,
  );
  return results ?? [];
}
