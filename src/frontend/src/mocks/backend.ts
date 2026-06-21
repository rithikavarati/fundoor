import type { backendInterface } from "../backend";
import type { Activity } from "../backend";

const sampleActivities: Activity[] = [
  {
    id: BigInt(1),
    name: "Six Flags New England",
    description: "Thrilling roller coasters and family rides in western Massachusetts.",
    category: "Theme Parks",
    location: "Agawam, Massachusetts",
    rating: 4.2,
    tags: ["roller coasters", "family", "thrill rides", "water park"],
    imageUrl: "https://placehold.co/400x300/FF6B35/white?text=Theme+Park",
    websiteUrl: "https://www.sixflags.com/newengland",
  },
  {
    id: BigInt(3),
    name: "Disneyland",
    description: "The original Disney theme park, bringing beloved characters and attractions to life.",
    category: "Theme Parks",
    location: "Anaheim, California",
    rating: 4.9,
    tags: ["disney", "family", "rides", "characters", "magic"],
    imageUrl: "https://placehold.co/400x300/FF6B35/white?text=Theme+Park",
    websiteUrl: "https://disneyland.disney.go.com",
  },
  {
    id: BigInt(66),
    name: "Peppa Pig Theme Park Dallas-Fort Worth",
    description:
      "Kid-friendly 14-acre park with 9 themed play areas, rides, and attractions based on the Peppa Pig show.",
    category: "Theme Parks",
    location: "Dallas, Texas",
    rating: 4.7,
    tags: ["peppa pig", "rides", "toddlers", "indoor", "outdoor", "splash pad"],
    imageUrl: "https://placehold.co/400x300/FF6B35/white?text=Theme+Park",
    websiteUrl: "https://www.peppapigpark.com/texas",
  },
  {
    id: BigInt(67),
    name: "LEGOLAND Discovery Center Dallas/Fort Worth",
    description:
      "Indoor LEGO playground at Grapevine Mills with 12+ attractions, rides, Miniland, and a Build & Test zone.",
    category: "Theme Parks",
    location: "Dallas, Texas",
    rating: 4.6,
    tags: ["lego", "indoor", "building", "rides", "miniland"],
    imageUrl: "https://placehold.co/400x300/FF6B35/white?text=Theme+Park",
    websiteUrl: "https://www.legolanddiscoverycenter.com/dallas-fort-worth",
  },
  {
    id: BigInt(68),
    name: "Great Wolf Lodge Grapevine",
    description:
      "Indoor water park resort near Dallas with 80,000 sq ft of water attractions kept at 84 degrees year-round.",
    category: "Theme Parks",
    location: "Dallas, Texas",
    rating: 4.5,
    tags: ["water park", "indoor", "resort", "slides", "wave pool"],
    imageUrl: "https://placehold.co/400x300/FF6B35/white?text=Theme+Park",
    websiteUrl: "https://www.greatwolf.com/grapevine",
  },
  {
    id: BigInt(115),
    name: "Perot Museum of Nature and Science",
    description: "Dallas's stunning science museum with dinosaur hall and energy exhibits.",
    category: "Museums",
    location: "Dallas, Texas",
    rating: 4.8,
    tags: ["nature", "science", "dinosaurs", "energy", "interactive"],
    imageUrl: "https://placehold.co/400x300/4ECDC4/white?text=Museum",
    websiteUrl: "https://www.perotmuseum.org",
  },
  {
    id: BigInt(50),
    name: "Exploratorium",
    description: "World-famous science museum with hundreds of hands-on exhibits.",
    category: "Museums",
    location: "San Francisco, California",
    rating: 4.7,
    tags: ["science", "interactive", "kids", "education"],
    imageUrl: "https://placehold.co/400x300/4ECDC4/white?text=Museum",
    websiteUrl: "https://www.exploratorium.edu",
  },
  {
    id: BigInt(51),
    name: "Golden Gate Park Playground",
    description: "Beautiful playground and green space in the heart of San Francisco.",
    category: "Parks",
    location: "San Francisco, California",
    rating: 4.5,
    tags: ["park", "playground", "outdoor", "free"],
    imageUrl: "https://placehold.co/400x300/45B7D1/white?text=Park",
    websiteUrl: "https://sfrecpark.org/parks-open-spaces/golden-gate-park",
  },
  {
    id: BigInt(100),
    name: "Weekend Camping Adventure",
    description: "Fun family camping trip with guided nature walks and stargazing.",
    category: "Weekend Activities",
    location: "Yosemite, California",
    rating: 4.8,
    tags: ["camping", "nature", "family", "outdoor"],
    imageUrl: "https://placehold.co/400x300/96CEB4/white?text=Weekend",
    websiteUrl: "https://www.nps.gov/yose",
  },
];

export const mockBackend: backendInterface = {
  getActivities: async () => sampleActivities,
  getActivity: async (id: bigint) =>
    sampleActivities.find((a) => a.id === id) ?? null,
  getByCategory: async (category: string) =>
    sampleActivities.filter((a) => a.category === category),
  searchActivities: async (searchQuery: string) => {
    const lower = searchQuery.toLowerCase();
    return sampleActivities.filter(
      (a) =>
        a.name.toLowerCase().includes(lower) ||
        a.location.toLowerCase().includes(lower) ||
        a.category.toLowerCase().includes(lower)
    );
  },
  getActivitiesByCityAndState: async (city: string, state: string) => {
    const cityLower = city.trim().toLowerCase();
    const stateLower = state.trim().toLowerCase();
    return sampleActivities.filter((a) => {
      const loc = a.location.toLowerCase();
      return loc.includes(cityLower) && loc.includes(stateLower);
    });
  },
  getActivitiesByCityStateAndCategory: async (
    city: string,
    state: string,
    category: string
  ) => {
    const cityLower = city.trim().toLowerCase();
    const stateLower = state.trim().toLowerCase();
    return sampleActivities.filter((a) => {
      const loc = a.location.toLowerCase();
      return (
        loc.includes(cityLower) &&
        loc.includes(stateLower) &&
        a.category === category
      );
    });
  },
  getWeekendEventsByCityAndState: async (
    city: string,
    state: string,
    _currentDate: string | null,
  ) => {
    const cityLower = city.trim().toLowerCase();
    const stateLower = state.trim().toLowerCase();
    return sampleActivities.filter((a) => {
      const loc = a.location.toLowerCase();
      return (
        loc.includes(cityLower) &&
        loc.includes(stateLower) &&
        a.category === "Weekend Activities"
      );
    });
  },
  login: async (_email: string, _password: string) => ({
    __kind__: "err" as const,
    err: "Mock: login not supported",
  }),
  register: async (
    _firstName: string,
    _lastName: string,
    _email: string,
    _password: string,
  ) => ({
    __kind__: "err" as const,
    err: "Mock: register not supported",
  }),
  logout: async () => {},
  getFavorites: async () => [] as bigint[],
  addFavorite: async (_activityId: bigint) => ({
    __kind__: "ok" as const,
    ok: null,
  }),
  removeFavorite: async (_activityId: bigint) => ({
    __kind__: "ok" as const,
    ok: null,
  }),
  getMe: async () => ({
    __kind__: "err" as const,
    err: "Mock: not authenticated",
  }),
  updateUser: async (
    _firstName: string,
    _lastName: string,
    _email: string,
  ) => ({
    __kind__: "err" as const,
    err: "Mock: update not supported",
  }),
  forgotPassword: async (_email: string, _newPassword: string, _confirmPassword: string) => ({
    __kind__: "ok" as const,
    ok: null,
  }),
};
