import { Building2, Calendar, Castle, Heart, Star, Trees } from "lucide-react";
import { motion } from "motion/react";
import type { CategoryType } from "../App";

interface CategoryTilesProps {
  selectedCategory: CategoryType;
  onCategorySelect: (category: CategoryType) => void;
}

const CATEGORIES: {
  label: CategoryType;
  icon: React.ReactNode;
  emoji: string;
  colorClass: string;
  hoverColorClass: string;
  textColorClass: string;
}[] = [
  {
    label: "All",
    icon: <Star className="w-8 h-8" />,
    emoji: "⭐",
    colorClass: "bg-catBlue",
    hoverColorClass: "hover:bg-catBlue/90",
    textColorClass: "text-white",
  },
  {
    label: "Favorites",
    icon: <Heart className="w-8 h-8" />,
    emoji: "❤️",
    colorClass: "bg-red-500",
    hoverColorClass: "hover:bg-red-500/90",
    textColorClass: "text-white",
  },
  {
    label: "Theme Parks",
    icon: <Castle className="w-8 h-8" />,
    emoji: "🏰",
    colorClass: "bg-catOrange",
    hoverColorClass: "hover:bg-catOrange/90",
    textColorClass: "text-white",
  },
  {
    label: "Weekend Activities",
    icon: <Calendar className="w-8 h-8" />,
    emoji: "📅",
    colorClass: "bg-catTeal",
    hoverColorClass: "hover:bg-catTeal/90",
    textColorClass: "text-white",
  },
  {
    label: "Parks",
    icon: <Trees className="w-8 h-8" />,
    emoji: "🌳",
    colorClass: "bg-catGreen",
    hoverColorClass: "hover:bg-catGreen/90",
    textColorClass: "text-white",
  },
  {
    label: "Museums",
    icon: <Building2 className="w-8 h-8" />,
    emoji: "🏛️",
    colorClass: "bg-catYellow",
    hoverColorClass: "hover:bg-catYellow/90",
    textColorClass: "text-white",
  },
];

export default function CategoryTiles({
  selectedCategory,
  onCategorySelect,
}: CategoryTilesProps) {
  return (
    <section className="bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-5 gap-3 md:gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.label}
              data-ocid={`category.${cat.label.toLowerCase().replace(/ /g, "_")}.tab`}
              onClick={() => onCategorySelect(cat.label)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl transition-all duration-200 cursor-pointer ${
                cat.colorClass
              } ${cat.hoverColorClass} ${cat.textColorClass} ${
                selectedCategory === cat.label
                  ? "ring-4 ring-offset-2 ring-offset-background shadow-lg scale-105"
                  : "shadow-md"
              } ${
                selectedCategory === cat.label
                  ? cat.colorClass === "bg-catGreen"
                    ? "ring-catGreen"
                    : cat.colorClass === "bg-catOrange"
                      ? "ring-catOrange"
                      : cat.colorClass === "bg-catTeal"
                        ? "ring-catTeal"
                        : cat.colorClass === "bg-catYellow"
                          ? "ring-catYellow"
                          : "ring-catBlue"
                  : ""
              }`}
            >
              <span
                className="text-2xl md:text-3xl"
                role="img"
                aria-label={cat.label}
              >
                {cat.emoji}
              </span>
              <span className="text-xs md:text-sm font-bold text-center leading-tight">
                {cat.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
