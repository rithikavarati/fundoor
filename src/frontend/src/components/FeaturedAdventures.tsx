import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ExternalLink, MapPin, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import type { CategoryType } from "../App";
import type { Activity } from "../backend";
import { useAuth } from "../contexts/AuthContext";
import { getActivityImage } from "../utils/activityImages";

interface FeaturedAdventuresProps {
  activities: Activity[];
  isLoading: boolean;
  selectedCategory: CategoryType;
  onCardClick: (activity: Activity) => void;
  searchQuery: string;
  hasSearched: boolean;
  resultsRef?: React.RefObject<HTMLDivElement | null>;
  weekendNeedsLocation?: boolean;
}

const FAVORITES_KEY = "scoutplore_favorites";

function getGuestFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function saveGuestFavorites(favs: Set<string>) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favs)));
  } catch {
    // ignore
  }
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

function FavoriteHeart({
  activityId,
}: {
  activityId: string;
}) {
  const { user, serverFavorites, toggleFavorite } = useAuth();
  const [guestIsFav, setGuestIsFav] = useState(() =>
    getGuestFavorites().has(activityId),
  );

  useEffect(() => {
    if (!user) {
      setGuestIsFav(getGuestFavorites().has(activityId));
    }
  }, [activityId, user]);

  const isFav = user ? serverFavorites.has(activityId) : guestIsFav;

  const toggle = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (user) {
        await toggleFavorite(activityId);
      } else {
        const favs = getGuestFavorites();
        if (favs.has(activityId)) {
          favs.delete(activityId);
          setGuestIsFav(false);
        } else {
          favs.add(activityId);
          setGuestIsFav(true);
        }
        saveGuestFavorites(favs);
      }
    },
    [activityId, user, toggleFavorite],
  );

  return (
    <button
      type="button"
      data-ocid="adventures.favorite_button"
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      onClick={toggle}
      className={`shrink-0 ml-2 p-1 rounded-full transition-colors duration-200 ${
        isFav
          ? "text-red-500 hover:text-red-600"
          : "text-muted-foreground hover:text-red-400"
      }`}
    >
      <HeartIcon filled={isFav} />
    </button>
  );
}

const FALLBACK_EMOJIS: Record<string, string> = {
  "Theme Parks": "🎡",
  Parks: "🌳",
  Museums: "🏛️",
  "Weekend Activities": "🎪",
};

const GRADIENT_BG: Record<string, string> = {
  "Theme Parks": "from-catGreen/80 to-catTeal/80",
  Parks: "from-catTeal/80 to-catBlue/80",
  Museums: "from-catYellow/80 to-catOrange/80",
  "Weekend Activities": "from-kiddoOrange/70 to-kiddoCoral/70",
  All: "from-teal-primary/80 to-teal-hero/80",
};

const DEFAULT_GRADIENT = GRADIENT_BG.All;

function formatEventDate(
  eventDate?: string,
  eventDateEnd?: string,
): string | null {
  if (!eventDate) return null;
  const start = new Date(eventDate);
  const startStr = start.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  if (!eventDateEnd || eventDateEnd === eventDate) return startStr;
  const end = new Date(eventDateEnd);
  const endStr = end.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${startStr} - ${endStr}`;
}

// Sample activities kept for reference but not used in production

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

function ActivityCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-9 w-full mt-2" />
      </div>
    </div>
  );
}

function ActivityCard({
  activity,
  index,
  onClick,
}: { activity: Activity; index: number; onClick: () => void }) {
  const imageUrl = getActivityImage(activity);
  const emoji = FALLBACK_EMOJIS[activity.category] || "🎠";
  const gradientClass = GRADIENT_BG[activity.category] ?? DEFAULT_GRADIENT;

  return (
    <motion.div
      data-ocid={`adventures.item.${index + 1}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent && !parent.querySelector(".img-fallback")) {
              const fallback = document.createElement("div");
              fallback.className = `img-fallback w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${gradientClass}`;
              const emojiEl = document.createElement("span");
              emojiEl.className = "text-5xl mb-2";
              emojiEl.textContent = emoji;
              const nameEl = document.createElement("span");
              nameEl.className =
                "text-sm font-semibold text-white/90 text-center px-2 line-clamp-2";
              nameEl.textContent = activity.name;
              fallback.appendChild(emojiEl);
              fallback.appendChild(nameEl);
              parent.appendChild(fallback);
            }
          }}
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 rounded-full px-2.5 py-1 shadow-md">
          <Star className="w-3.5 h-3.5 fill-kiddoYellow text-kiddoYellow" />
          <span className="text-xs font-bold text-foreground">
            {activity.rating.toFixed(1)}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-teal-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {activity.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-base font-bold text-foreground line-clamp-1 group-hover:text-teal-primary transition-colors">
            {activity.name}
          </h3>
          <FavoriteHeart activityId={activity.id.toString()} />
        </div>
        {activity.category === "Weekend Activities" && (
          <div className="flex items-center gap-1 text-accent text-xs font-semibold mb-1.5">
            <span className="shrink-0">📅</span>
            <span>
              {formatEventDate(activity.eventDate, activity.eventDateEnd) ??
                "Date TBD"}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2.5">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{activity.location}</span>
        </div>

        {activity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {activity.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            data-ocid={`adventures.learn_more.button.${index + 1}`}
            className="w-full bg-teal-primary hover:bg-teal-dark text-white font-semibold rounded-xl text-sm transition-all duration-200"
            size="sm"
            onClick={onClick}
          >
            Learn More
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          {activity.websiteUrl && activity.websiteUrl.trim() !== "" ? (
            <a
              href={activity.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid={`adventures.website_link.${index + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 w-full border-2 border-teal-primary/50 rounded-xl px-3 py-2.5 text-sm font-semibold text-teal-primary bg-teal-primary/5 hover:bg-teal-primary/10 hover:border-teal-primary transition-all duration-200"
            >
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate flex-1">
                {activity.websiteUrl
                  .replace(/^https?:\/\//, "")
                  .replace(/\/$/, "")}
              </span>
              <span className="text-xs shrink-0">&#x2197;</span>
            </a>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

const PAGE_SIZE = 20;

export default function FeaturedAdventures({
  activities,
  isLoading,
  selectedCategory,
  onCardClick,
  searchQuery,
  hasSearched,
  resultsRef,
  weekendNeedsLocation,
}: FeaturedAdventuresProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset pagination when category changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: selectedCategory is a prop, resetting count on its change is intentional
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory]);

  const displayActivities = activities.slice(0, visibleCount);
  const hasMore = visibleCount < activities.length;

  return (
    <section ref={resultsRef} className="py-12 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-1">
              {hasSearched ? "Search Results" : "Featured Adventures"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {hasSearched && searchQuery
                ? `Showing results for "${searchQuery}"`
                : searchQuery
                  ? `Search results for "${searchQuery}"`
                  : selectedCategory === "All"
                    ? "Explore top-rated family destinations and activities"
                    : `Best ${selectedCategory} for your family`}
            </p>
          </div>

          {/* Active filter pill */}
          <div className="flex-shrink-0">
            <span
              data-ocid="adventures.category_filter.tab"
              className="inline-flex items-center gap-1.5 bg-teal-primary text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-kiddoYellow" />
              {selectedCategory}
            </span>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div
            data-ocid="adventures.loading_state"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {SKELETON_KEYS.map((k) => (
              <ActivityCardSkeleton key={k} />
            ))}
          </div>
        ) : displayActivities.length === 0 ? (
          <div data-ocid="adventures.empty_state" className="text-center py-20">
            {selectedCategory === "Weekend Activities" &&
            weekendNeedsLocation ? (
              <>
                <div className="flex justify-center mb-4">
                  <MapPin className="w-16 h-16 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Location needed
                </h3>
                <p className="text-muted-foreground">
                  Select city/state to view local weekend activities
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  No adventures found yet!
                </h3>
                <p className="text-muted-foreground">
                  Try a different city or state
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayActivities.map((activity, index) => (
                  <ActivityCard
                    key={activity.id.toString()}
                    activity={activity}
                    index={index}
                    onClick={() => onCardClick(activity)}
                  />
                ))}
              </div>
            </AnimatePresence>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  type="button"
                  data-ocid="adventures.show_more_button"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="bg-teal-primary hover:bg-teal-dark text-white font-semibold px-8 py-2.5 rounded-xl shadow-sm transition-all duration-200"
                >
                  Show More ({activities.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
