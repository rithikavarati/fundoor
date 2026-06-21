import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];

type Testimonial = {
  initials: string;
  name: string;
  quote: string;
  rating: number;
  avatarColor: string;
};

const AVATAR_COLORS = [
  "bg-catGreen",
  "bg-catOrange",
  "bg-catBlue",
  "bg-primary",
  "bg-secondary",
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    initials: "SM",
    name: "Sarah M.",
    quote:
      "FunDoor made our weekend planning SO much easier! We found a great science museum our kids hadn't been to. They're still talking about it.",
    rating: 5,
    avatarColor: "bg-catGreen",
  },
  {
    initials: "JL",
    name: "James L.",
    quote:
      "Finally an app that understands what families need. We discovered an adventure park 20 minutes from home that we never knew existed!",
    rating: 5,
    avatarColor: "bg-catOrange",
  },
  {
    initials: "PR",
    name: "Priya R.",
    quote:
      "The search and filter features are amazing. I searched 'museums' and found exactly what my 7-year-old loves. Highly recommend to all parents!",
    rating: 5,
    avatarColor: "bg-catBlue",
  },
];

const STORAGE_KEY = "fundoor_reviews";

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Testimonial[];
        return [...DEFAULT_TESTIMONIALS, ...parsed];
      }
    } catch {
      // ignore parse errors
    }
    return DEFAULT_TESTIMONIALS;
  });

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [errors, setErrors] = useState<{
    name?: string;
    message?: string;
    rating?: string;
  }>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userReviews = testimonials.slice(DEFAULT_TESTIMONIALS.length);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userReviews));
  }, [testimonials]);

  function validate() {
    const errs: { name?: string; message?: string; rating?: string } = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!message.trim()) errs.message = "Message is required";
    if (!rating) errs.rating = "Please select a rating";
    return errs;
  }

  function handlePost() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const colorIndex = testimonials.length % AVATAR_COLORS.length;
    const newReview: Testimonial = {
      initials: getInitials(name),
      name: name.trim(),
      quote: message.trim(),
      rating,
      avatarColor: AVATAR_COLORS[colorIndex],
    };
    setTestimonials((prev) => [...prev, newReview]);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowForm(false);
      setName("");
      setMessage("");
      setRating(0);
      setHovered(0);
      setErrors({});
    }, 1500);
  }

  function handleClose() {
    setShowForm(false);
    setName("");
    setMessage("");
    setRating(0);
    setHovered(0);
    setErrors({});
    setSuccess(false);
  }

  return (
    <section
      className="py-14 px-4"
      style={{ background: "oklch(0.95 0.01 181)" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-4 mb-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              What Our Community Says
            </h2>
            <Button
              data-ocid="testimonials.add_review_button"
              size="sm"
              className="flex items-center gap-1.5 rounded-full"
              onClick={() => setShowForm(true)}
              type="button"
            >
              <Plus className="w-4 h-4" />
              Add Review
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Thousands of families trust FunDoor for their weekend planning
          </p>
        </motion.div>

        {/* Add Review Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              key="review-form"
              data-ocid="testimonials.dialog"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl shadow-card p-6 mb-8 max-w-lg mx-auto relative"
            >
              <button
                type="button"
                data-ocid="testimonials.close_button"
                onClick={handleClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close form"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-foreground mb-4">
                Write a Review
              </h3>

              <AnimatePresence>
                {success && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    data-ocid="testimonials.success_state"
                    className="flex items-center justify-center gap-2 text-sm font-semibold text-green-700 bg-green-50 rounded-lg py-2 px-4 mb-4"
                  >
                    <Star className="w-4 h-4 fill-green-600 text-green-600" />
                    Review posted! Thank you.
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="review-name"
                    className="text-sm font-semibold"
                  >
                    Name
                  </Label>
                  <Input
                    id="review-name"
                    data-ocid="testimonials.name_input"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((p) => ({ ...p, name: undefined }));
                    }}
                  />
                  {errors.name && (
                    <p
                      data-ocid="testimonials.name_field_error"
                      className="text-xs text-destructive"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="review-message"
                    className="text-sm font-semibold"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="review-message"
                    data-ocid="testimonials.message_textarea"
                    placeholder="Share your experience..."
                    value={message}
                    rows={3}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setErrors((p) => ({ ...p, message: undefined }));
                    }}
                  />
                  {errors.message && (
                    <p
                      data-ocid="testimonials.message_field_error"
                      className="text-xs text-destructive"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Rating */}
                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-semibold">Rate</Label>
                  <div
                    className="flex gap-1"
                    data-ocid="testimonials.rating_stars"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        data-ocid={`testimonials.star.${star}`}
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        onClick={() => {
                          setRating(star);
                          setErrors((p) => ({ ...p, rating: undefined }));
                        }}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= (hovered || rating)
                              ? "fill-kiddoYellow text-kiddoYellow"
                              : "fill-none text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {errors.rating && (
                    <p
                      data-ocid="testimonials.rating_field_error"
                      className="text-xs text-destructive"
                    >
                      {errors.rating}
                    </p>
                  )}
                </div>

                {/* Post button */}
                <Button
                  type="button"
                  data-ocid="testimonials.submit_button"
                  onClick={handlePost}
                  className="w-full mt-1 font-semibold"
                  disabled={success}
                >
                  Post
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={`${t.name}-${i}`}
              data-ocid={`testimonials.item.${i + 1}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-card flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {STAR_KEYS.slice(0, t.rating).map((k) => (
                  <Star
                    key={k}
                    className="w-4 h-4 fill-kiddoYellow text-kiddoYellow"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                    t.avatarColor
                  }`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Member
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
