import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import { motion } from "motion/react";
import { type RefObject, useState } from "react";

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

interface HeroSectionProps {
  city: string;
  state: string;
  onCityChange: (city: string) => void;
  onStateChange: (state: string) => void;
  onSearch: () => void;
  searchRef: RefObject<HTMLDivElement | null>;
}

export default function HeroSection({
  city,
  state,
  onCityChange,
  onStateChange,
  onSearch,
  searchRef,
}: HeroSectionProps) {
  const [searched, setSearched] = useState(false);
  const [lastCity, setLastCity] = useState("");
  const [lastState, setLastState] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const trimmedCity = city.trim();
    const trimmedState = state.trim();
    setLastCity(trimmedCity);
    setLastState(trimmedState);
    onSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setSearched(true);
      const trimmedCity = city.trim();
      const trimmedState = state.trim();
      setLastCity(trimmedCity);
      setLastState(trimmedState);
      onSearch();
    }
  };

  const getResultLabel = () => {
    if (!searched) return null;
    if (lastCity && lastState)
      return `Showing results for ${lastCity}, ${lastState}`;
    if (lastCity) return `Showing results for ${lastCity}`;
    if (lastState) return `Showing results for ${lastState}`;
    return null;
  };

  const resultLabel = getResultLabel();

  return (
    <section
      className="relative min-h-[600px] md:min-h-[680px] flex items-center justify-center overflow-hidden pt-20"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.38 0.09 181) 0%, oklch(0.44 0.102 181) 40%, oklch(0.52 0.115 181) 100%)",
      }}
    >
      {/* Blob decorations */}
      <div
        className="absolute top-[-60px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-20 animate-blob-pulse"
        style={{ background: "oklch(0.65 0.18 39)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-80px] left-[-60px] w-[350px] h-[350px] rounded-full opacity-20"
        style={{ background: "oklch(0.85 0.16 88)" }}
        aria-hidden="true"
      />
      <div
        className="absolute top-[30%] left-[5%] w-[200px] h-[200px] rounded-full opacity-10"
        style={{ background: "oklch(0.62 0.2 28)" }}
        aria-hidden="true"
      />

      {/* Wavy bottom */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-20"
          aria-hidden="true"
        >
          <title>Wave divider</title>
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="#F4F7F6"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
            <span>🌟</span>
            <span>Your Family Adventure Awaits</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            Discover Amazing Fun
            <br />
            <span style={{ color: "oklch(0.85 0.16 88)" }}>
              for your Family!
            </span>
          </h1>

          <p className="text-white/85 text-lg md:text-xl font-medium mb-8">
            Find theme parks, activities, parks &amp; museums near you
          </p>
        </motion.div>

        {/* City + State search */}
        <motion.div
          ref={searchRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl sm:rounded-full shadow-2xl overflow-hidden max-w-2xl mx-auto"
          >
            {/* City field */}
            <div className="flex items-center gap-2 flex-1 px-5 py-1 border-b sm:border-b-0 sm:border-r border-border/30">
              <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <div className="flex flex-col flex-1 py-1">
                <label
                  htmlFor="hero-city"
                  className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-0.5"
                >
                  City
                </label>
                <input
                  data-ocid="hero.city.input"
                  id="hero-city"
                  type="text"
                  value={city}
                  onChange={(e) => onCityChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter city..."
                  className="text-sm md:text-base font-medium text-foreground bg-transparent outline-none placeholder:text-muted-foreground/70 w-full"
                  aria-label="City"
                />
              </div>
            </div>

            {/* State field */}
            <div className="flex items-center gap-2 flex-1 px-5 py-1">
              <Search className="w-4 h-4 text-teal-600 flex-shrink-0 sm:hidden" />
              <div className="flex flex-col flex-1 py-1">
                <label
                  htmlFor="hero-state"
                  className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-0.5"
                >
                  State
                </label>
                <select
                  data-ocid="hero.state.select"
                  id="hero-state"
                  value={state}
                  onChange={(e) => onStateChange(e.target.value)}
                  className="text-sm md:text-base font-medium text-foreground bg-transparent outline-none w-full appearance-none cursor-pointer"
                  aria-label="State"
                >
                  <option value="">Select state...</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search button */}
            <Button
              data-ocid="hero.search.primary_button"
              type="submit"
              className="m-2 rounded-full bg-kiddoOrange hover:bg-kiddoOrange/90 text-white font-bold text-sm px-6 py-3 h-auto transition-all duration-200 shadow-md flex items-center gap-2 justify-center"
            >
              <Search className="w-4 h-4" />
              Search
            </Button>
          </form>

          {/* Sub-text */}
          <p className="text-white/70 text-xs mt-3 font-medium">
            {resultLabel ? (
              <span className="text-white font-semibold">{resultLabel}</span>
            ) : (
              "Search activities across the USA"
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
