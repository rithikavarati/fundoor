import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Activity } from "./backend";
import ActivityModal from "./components/ActivityModal";
import CategoryTiles from "./components/CategoryTiles";
import FeaturedAdventures from "./components/FeaturedAdventures";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navigation from "./components/Navigation";
import TestimonialsSection from "./components/TestimonialsSection";
import { useAuth } from "./contexts/AuthContext";
import { useActor } from "./hooks/useActor";
import {
  clearLegacyCache,
  fetchActivitiesByCityAndState,
  fetchActivitiesByCityStateAndCategory,
  fetchWeekendEventsByCityAndState,
  useGetActivities,
} from "./hooks/useQueries";

export type CategoryType =
  | "All"
  | "Favorites"
  | "Theme Parks"
  | "Weekend Activities"
  | "Parks"
  | "Museums";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredActivities, setFilteredActivities] = useState<
    Activity[] | null
  >(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<CategoryType | null>(
    null,
  );
  const searchRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const { data: allActivities, isLoading } = useGetActivities();
  const { actor } = useActor();

  // Clear legacy v1 cache on mount so stale empty results don't persist
  useEffect(() => {
    clearLegacyCache();
  }, []);

  const scrollToResults = useCallback(() => {
    setTimeout(
      () =>
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      100,
    );
  }, []);

  const handleSearch = useCallback(async () => {
    const trimmedCity = city.trim();
    const trimmedState = state.trim();

    if (!trimmedCity || !trimmedState) {
      setFilteredActivities(null);
      setHasSearched(false);
      return;
    }

    if (!actor) {
      setHasSearched(true);
      setFilteredActivities([]);
      setIsSearching(false);
      return;
    }

    setHasSearched(true);
    setIsSearching(true);

    try {
      let results: Activity[];

      if (selectedCategory === "Weekend Activities") {
        results = await fetchWeekendEventsByCityAndState(
          actor,
          trimmedCity,
          trimmedState,
        );
      } else if (selectedCategory !== "All") {
        // Use exact city+state+category endpoint
        results = await fetchActivitiesByCityStateAndCategory(
          actor,
          trimmedCity,
          trimmedState,
          selectedCategory,
          true, // always skip cache on explicit search
        );
      } else {
        // Use exact city+state endpoint
        results = await fetchActivitiesByCityAndState(
          actor,
          trimmedCity,
          trimmedState,
          true, // always skip cache on explicit search
        );
      }

      setFilteredActivities(results);
    } catch (err) {
      console.error("Search failed:", err);
      setFilteredActivities([]);
    } finally {
      setIsSearching(false);
      scrollToResults();
    }
  }, [city, state, selectedCategory, actor, scrollToResults]);

  const fetchCategory = useCallback(
    async (category: CategoryType) => {
      if (!actor) return false;
      setIsSearching(true);
      try {
        if (category === "All") {
          const results = await actor.getActivities();
          setFilteredActivities(results);
        } else {
          const results = await actor.getByCategory(category);
          setFilteredActivities(results);
        }
        return true;
      } catch {
        setFilteredActivities([]);
        return true;
      } finally {
        setIsSearching(false);
      }
    },
    [actor],
  );

  // When actor becomes available, fulfill any pending category fetch
  useEffect(() => {
    if (actor && pendingCategory !== null) {
      const cat = pendingCategory;
      setPendingCategory(null);
      // Weekend Activities requires a city and state to show results
      if (cat === "Weekend Activities" && (!city.trim() || !state.trim())) {
        setFilteredActivities([]);
        setHasSearched(false);
        scrollToResults();
        return;
      }
      fetchCategory(cat).then(() => scrollToResults());
    }
  }, [actor, pendingCategory, fetchCategory, scrollToResults, city, state]);

  const handleCategorySelect = useCallback(
    async (category: CategoryType) => {
      setSelectedCategory(category);

      // Weekend Activities requires a city and state to show results
      if (
        category === "Weekend Activities" &&
        (!city.trim() || !state.trim())
      ) {
        setFilteredActivities([]);
        setHasSearched(false);
        scrollToResults();
        return;
      }

      // If a search has been performed (city/state are set), re-fetch using
      // the exact-match endpoint for the new category.
      if (hasSearched && city.trim() && state.trim()) {
        setIsSearching(true);
        try {
          let results: Activity[];

          if (category === "Weekend Activities") {
            results = await fetchWeekendEventsByCityAndState(
              actor!,
              city.trim(),
              state.trim(),
            );
          } else if (category !== "All") {
            results = await fetchActivitiesByCityStateAndCategory(
              actor!,
              city.trim(),
              state.trim(),
              category,
              false, // allow cache on tab switch
            );
          } else {
            results = await fetchActivitiesByCityAndState(
              actor!,
              city.trim(),
              state.trim(),
              false, // allow cache on tab switch
            );
          }

          setFilteredActivities(results);
        } catch (err) {
          console.error("Category re-search failed:", err);
          setFilteredActivities([]);
        } finally {
          setIsSearching(false);
          scrollToResults();
        }
        return;
      }

      // No prior search — show all activities for the selected category
      setHasSearched(false);
      if (allActivities) {
        if (category === "All") {
          setFilteredActivities(allActivities);
        } else {
          setFilteredActivities(
            allActivities.filter((a) => a.category === category),
          );
        }
      }

      if (!actor) {
        setPendingCategory(category);
        scrollToResults();
        return;
      }

      await fetchCategory(category);
      scrollToResults();
    },
    [
      hasSearched,
      city,
      state,
      actor,
      allActivities,
      fetchCategory,
      scrollToResults,
    ],
  );

  const handleCardClick = useCallback((activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  }, []);

  const rawDisplayActivities = filteredActivities ?? allActivities ?? [];

  const { isLoggedIn, serverFavorites } = useAuth();

  const getGuestFavorites = (): Set<string> => {
    try {
      const raw = localStorage.getItem("scoutplore_favorites");
      if (!raw) return new Set();
      const parsed = JSON.parse(raw) as string[];
      return new Set(parsed);
    } catch {
      return new Set();
    }
  };

  let displayActivities: Activity[];
  const allActivitiesList = allActivities ?? [];
  if (selectedCategory === "Favorites") {
    if (isLoggedIn) {
      displayActivities = allActivitiesList.filter((a) =>
        serverFavorites.has(String(a.id)),
      );
    } else {
      const favs = getGuestFavorites();
      displayActivities = allActivitiesList.filter((a) =>
        favs.has(String(a.id)),
      );
    }
  } else if (selectedCategory === "Theme Parks") {
    displayActivities = [...rawDisplayActivities].sort((a, b) => {
      const parseLocation = (loc: string) => {
        const idx = loc.indexOf(", ");
        if (idx === -1) return { city: loc.toLowerCase(), state: "" };
        return {
          city: loc.slice(0, idx).toLowerCase(),
          state: loc.slice(idx + 2).toLowerCase(),
        };
      };
      const locA = parseLocation(a.location);
      const locB = parseLocation(b.location);
      const cityCompare = locA.city.localeCompare(locB.city);
      if (cityCompare !== 0) return cityCompare;
      return locA.state.localeCompare(locB.state);
    });
  } else {
    displayActivities = rawDisplayActivities;
  }

  return (
    <div className="min-h-screen bg-background font-poppins">
      <Navigation
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      <HeroSection
        city={city}
        state={state}
        onCityChange={setCity}
        onStateChange={setState}
        onSearch={handleSearch}
        searchRef={searchRef}
      />
      <CategoryTiles
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      <FeaturedAdventures
        activities={displayActivities}
        isLoading={isLoading || isSearching}
        selectedCategory={selectedCategory}
        onCardClick={handleCardClick}
        searchQuery={[city, state].filter(Boolean).join(", ")}
        hasSearched={hasSearched}
        resultsRef={resultsRef}
        weekendNeedsLocation={
          selectedCategory === "Weekend Activities" &&
          (!city.trim() || !state.trim())
        }
      />
      <TestimonialsSection />
      <Footer />

      <ActivityModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Toaster />
    </div>
  );
}
