import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Calendar, ExternalLink, MapPin, Star, Tag } from "lucide-react";
import type { Activity } from "../types/index";
// Activity type imported from ../types/index above
import { getActivityImage } from "../utils/activityImages";

interface ActivityModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ActivityModal({
  activity,
  isOpen,
  onClose,
}: ActivityModalProps) {
  if (!activity) return null;

  const imageUrl = getActivityImage(activity);
  const gradientFallbacks: Record<string, string> = {
    "Theme Parks": "from-catGreen/80 to-catTeal/80",
    Parks: "from-catTeal/80 to-catBlue/80",
    Museums: "from-catYellow/80 to-catOrange/80",
    "Weekend Activities": "from-kiddoOrange/70 to-kiddoCoral/70",
  };
  const gradientClass =
    gradientFallbacks[activity.category] ??
    "from-teal-primary/80 to-teal-hero/80";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        data-ocid="activity.modal"
        className="max-w-2xl p-0 overflow-hidden rounded-2xl max-h-[90vh] flex flex-col"
      >
        {/* Image header */}
        <div className="relative h-56 bg-muted">
          <img
            src={imageUrl}
            alt={activity.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent && !parent.querySelector(".img-fallback")) {
                const fallback = document.createElement("div");
                fallback.className = `img-fallback w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${gradientClass}`;
                const categoryEmojis: Record<string, string> = {
                  "Theme Parks": "🎡",
                  Parks: "🌳",
                  Museums: "🏛️",
                  Zoos: "🦁",
                  Aquariums: "🐠",
                  "Science Centers": "🔬",
                  "Water Parks": "💦",
                  "Indoor Play": "🎮",
                  "Weekend Activities": "🎪",
                };
                const emoji = categoryEmojis[activity.category] ?? "🎠";
                const emojiEl = document.createElement("span");
                emojiEl.className = "text-6xl mb-3";
                emojiEl.textContent = emoji;
                const nameEl = document.createElement("span");
                nameEl.className =
                  "text-base font-bold text-white/90 text-center px-4";
                nameEl.textContent = activity.name;
                fallback.appendChild(emojiEl);
                fallback.appendChild(nameEl);
                parent.appendChild(fallback);
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="bg-teal-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
              {activity.category}
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1.5">
              {activity.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-primary" />
              <span className="text-sm font-semibold text-foreground">
                {activity.location}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-kiddoYellow text-kiddoYellow" />
              <span className="text-sm font-bold text-foreground">
                {activity.rating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">/ 5.0</span>
            </div>
            {activity.category === "Weekend Activities" &&
              activity.eventDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-accent">
                    {activity.eventDateEnd &&
                    activity.eventDateEnd !== activity.eventDate
                      ? `${new Date(activity.eventDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} - ${new Date(activity.eventDateEnd).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                      : new Date(activity.eventDate).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" },
                        )}
                  </span>
                </div>
              )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {activity.description}
          </p>

          {/* Tags */}
          {activity.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              <div className="flex items-center gap-1.5 text-teal-primary">
                <Tag className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">Tags:</span>
              </div>
              {activity.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary text-secondary-foreground text-xs font-medium px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Visit Website — always render the section; hide gracefully if no URL */}
          <div className="border-t border-border pt-4 mt-2">
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
              Official Website
            </p>
            {activity.websiteUrl && activity.websiteUrl.trim() !== "" ? (
              <a
                href={activity.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="activity.modal.visit_website_link"
                className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-teal-primary bg-teal-primary/5 hover:bg-teal-primary/15 hover:border-teal-primary/80 transition-all duration-200 group"
              >
                <ExternalLink className="w-4 h-4 text-teal-primary shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-semibold text-teal-primary truncate flex-1">
                  {activity.websiteUrl
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                </span>
                <span className="text-xs font-bold text-teal-primary shrink-0">
                  Open ↗
                </span>
              </a>
            ) : (
              <p
                data-ocid="activity.modal.no_website"
                className="text-sm text-muted-foreground italic px-1"
              >
                No website available for this activity.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
