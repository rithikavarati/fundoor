// Deterministic hash of the activity name → stable image per activity
function nameHash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % 1000;
  return h;
}

// Build a Picsum Photos URL with 800x500 dimensions using a descriptive seed
function picsum(seed: string, sig: number): string {
  // Append sig to seed to get variation within a category while keeping it deterministic
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}-${sig}/800/500`;
}

export function getActivityImage(activity: {
  name: string;
  category: string;
  imageUrl?: string;
  tags?: string[];
}): string {
  // Preserve explicitly set non-placeholder URLs
  if (
    activity.imageUrl &&
    activity.imageUrl.trim() !== "" &&
    !activity.imageUrl.includes("placehold.co") &&
    !activity.imageUrl.includes("/assets/generated/") &&
    !activity.imageUrl.includes("source.unsplash.com")
  ) {
    return activity.imageUrl;
  }

  const name = activity.name.toLowerCase();
  const sig = nameHash(activity.name);

  // ── SPECIFIC NAMED ATTRACTIONS ──────────────────────────────────────────────

  // Disney / Walt Disney World / Disneyland — use uploaded image
  if (
    name.includes("disneyland") ||
    name.includes("disney world") ||
    name.includes("walt disney world") ||
    name.includes("disney")
  )
    return "/assets/wdw_hero_tablet_posterimage-019ec7a4-7418-7366-baef-70e068004268.webp";

  // Universal Studios
  if (name.includes("universal studios") || name.includes("universal"))
    return picsum("movie-themepark-rides", sig);

  // Six Flags — always use the same real roller coaster image
  if (name.includes("six flags")) {
    return "/assets/roller-coaster-six-flags.jpg";
  }

  // Busch Gardens
  if (name.includes("busch gardens"))
    return picsum("safari-themepark-coaster", sig);

  // SeaWorld
  if (name.includes("seaworld") || name.includes("sea world"))
    return picsum("marine-ocean-park", sig);

  // LEGOLAND Discovery Center (check before generic legoland)
  if (name.includes("legoland discovery"))
    return picsum("indoor-play-children-building", sig);

  // LEGOLAND
  if (name.includes("legoland") || name.includes("lego land"))
    return picsum("legoland-children-rides", sig);

  // Cedar Point
  if (name.includes("cedar point"))
    return picsum("steelcoaster-amusementpark", sig);

  // Knott's Berry Farm
  if (name.includes("knott"))
    return picsum("rollercoaster-amusementpark-family", sig);

  // Dollywood
  if (name.includes("dollywood"))
    return picsum("mountain-themepark-coaster", sig);

  // Hersheypark
  if (name.includes("hershey")) return picsum("rollercoaster-family-park", sig);

  // Kings Island / Kings Dominion / Carowinds
  if (
    name.includes("kings island") ||
    name.includes("kings dominion") ||
    name.includes("carowinds")
  )
    return picsum("themepark-familyrides", sig);

  // Silver Dollar City
  if (name.includes("silver dollar city"))
    return picsum("countryfair-themepark", sig);

  // Great Wolf Lodge
  if (name.includes("great wolf"))
    return picsum("indoor-waterpark-resort", sig);

  // Schlitterbahn
  if (name.includes("schlitterbahn"))
    return picsum("waterpark-waterslide-river", sig);

  // Peppa Pig
  if (name.includes("peppa pig"))
    return picsum("children-themepark-colorful", sig);

  // Nickelodeon Universe / Nickelodeon
  if (name.includes("nickelodeon"))
    return picsum("indoor-themepark-children", sig);

  // KidZania
  if (name.includes("kidzania") || name.includes("kidz"))
    return picsum("children-roleplay-activities", sig);

  // Dave and Buster's
  if (name.includes("dave and buster") || name.includes("dave & buster"))
    return picsum("arcade-entertainment-center", sig);

  // American Girl
  if (name.includes("american girl")) return picsum("children-toy-store", sig);

  // Mall of America
  if (name.includes("mall of america"))
    return picsum("indoor-amusementpark-mall", sig);

  // Navy Pier
  if (name.includes("navy pier"))
    return picsum("chicago-pier-ferriswheel", sig);

  // Coney Island
  if (name.includes("coney island"))
    return picsum("boardwalk-amusementpark-beach", sig);

  // Luna Park
  if (name.includes("luna park"))
    return picsum("amusementpark-ferriswheel-lights", sig);

  // Exploratorium
  if (name.includes("exploratorium"))
    return picsum("science-museum-interactive", sig);

  // California Academy of Sciences
  if (name.includes("california academy") || name.includes("cal academy"))
    return picsum("naturalhistory-planetarium-science", sig);

  // Golden Gate Park
  if (name.includes("golden gate park"))
    return picsum("golden-gate-park-outdoor", sig);

  // Pier 39
  if (name.includes("pier 39"))
    return picsum("sanfrancisco-waterfront-pier", sig);

  // San Francisco Zoo / SF Zoo
  if (
    name.includes("sf zoo") ||
    (name.includes("san francisco") && name.includes("zoo"))
  )
    return picsum("zoo-animals-wildlife", sig);

  // Children's Creativity Museum
  if (
    name.includes("creativity museum") ||
    name.includes("children's creativity")
  )
    return picsum("children-creativity-art", sig);

  // Smithsonian
  if (name.includes("smithsonian"))
    return picsum("nationalmuseum-exhibits", sig);

  // Kennedy Space Center
  if (name.includes("kennedy space") || name.includes("space center"))
    return picsum("space-rocket-nasa", sig);

  // Liberty Science Center
  if (name.includes("liberty science"))
    return picsum("science-center-discovery", sig);

  // Field Museum
  if (name.includes("field museum"))
    return picsum("dinosaur-naturalhistory-museum", sig);

  // Shedd Aquarium
  if (name.includes("shedd")) return picsum("aquarium-beluga-underwater", sig);

  // Georgia Aquarium
  if (name.includes("georgia aquarium"))
    return picsum("aquarium-whaleshark-underwater", sig);

  // Monterey Bay Aquarium
  if (name.includes("monterey bay"))
    return picsum("aquarium-kelp-seaotters", sig);

  // Dallas Aquarium
  if (name.includes("dallas") && name.includes("aquarium"))
    return picsum("aquarium-tropical-rainforest", sig);

  // Arboretum
  if (name.includes("arboretum"))
    return picsum("botanical-garden-flowers", sig);

  // San Diego Zoo
  if (name.includes("san diego") && name.includes("zoo"))
    return picsum("zoo-pandas-tropical", sig);

  // Bronx Zoo
  if (name.includes("bronx zoo")) return picsum("zoo-wildlife-tigers", sig);

  // State Fair / County Fair
  if (name.includes("state fair") || name.includes("county fair"))
    return picsum("carnival-fair-ferriswheel", sig);

  // Pumpkin Patch / Corn Maze
  if (name.includes("pumpkin") || name.includes("corn maze"))
    return picsum("pumpkin-patch-autumn-harvest", sig);

  // Christmas / Holiday Lights
  if (name.includes("christmas") || name.includes("holiday light"))
    return picsum("christmas-lights-holiday", sig);

  // Ice Rink / Skating
  if (
    name.includes("ice rink") ||
    name.includes("ice skating") ||
    name.includes("skating rink")
  )
    return picsum("iceskating-rink-winter", sig);

  // Circus
  if (name.includes("circus"))
    return picsum("circus-performers-entertainment", sig);

  // Bowling
  if (name.includes("bowling")) return picsum("bowling-alley-family", sig);

  // Trampoline Park
  if (name.includes("trampoline"))
    return picsum("trampoline-park-jumping", sig);

  // Laser Tag
  if (name.includes("laser tag")) return picsum("lasertag-neon-indoor", sig);

  // Mini Golf
  if (
    name.includes("mini golf") ||
    name.includes("miniature golf") ||
    name.includes("putt")
  )
    return picsum("minigolf-outdoor-family", sig);

  // Go Kart / Karting
  if (
    name.includes("go kart") ||
    name.includes("go-kart") ||
    name.includes("karting")
  )
    return picsum("gokart-racing-family", sig);

  // Escape Room
  if (name.includes("escape room"))
    return picsum("escaperoom-puzzle-adventure", sig);

  // Rock Climbing
  if (name.includes("rock climb") || name.includes("climbing wall"))
    return picsum("rockclimbing-wall-bouldering", sig);

  // Central Park
  if (name.includes("central park"))
    return picsum("centralpark-newyork-family", sig);

  // ── KEYWORD-BASED NAME MATCHES ───────────────────────────────────────────────

  // Aquarium (generic)
  if (name.includes("aquarium")) return picsum("aquarium-fish-underwater", sig);

  // Zoo (generic)
  if (name.includes("zoo")) return picsum("zoo-animals-wildlife", sig);

  // Natural History Museum
  if (name.includes("natural history"))
    return picsum("dinosaur-fossils-museum", sig);

  // Art Museum / Art Institute
  if (
    name.includes("art museum") ||
    name.includes("museum of art") ||
    name.includes("art institute") ||
    name.includes("art gallery")
  )
    return picsum("artmuseum-paintings-gallery", sig);

  // Children's Museum
  if (name.includes("children") && name.includes("museum"))
    return picsum("childrens-museum-interactive", sig);

  // Science Center / Science Museum
  if (
    name.includes("science center") ||
    name.includes("science museum") ||
    name.includes("cosi") ||
    name.includes("discovery science")
  )
    return picsum("science-museum-stem", sig);

  // Science (general)
  if (name.includes("science")) return picsum("science-exhibit-discovery", sig);

  // Planetarium
  if (name.includes("planetarium"))
    return picsum("planetarium-stars-astronomy", sig);

  // Space
  if (name.includes("space")) return picsum("space-stars-cosmos", sig);

  // History Museum
  if (
    name.includes("history museum") ||
    name.includes("historical museum") ||
    name.includes("heritage")
  )
    return picsum("history-museum-artifacts", sig);

  // Botanical Garden
  if (name.includes("botanical") || name.includes("botanic"))
    return picsum("botanical-garden-colorful", sig);

  if (name.includes("garden")) return picsum("garden-flowers-outdoor", sig);

  // Water Park
  if (
    name.includes("water park") ||
    name.includes("waterpark") ||
    name.includes("aquatica")
  )
    return picsum("waterpark-waterslide-pool", sig);

  if (name.includes("splash")) return picsum("splashpad-water-children", sig);

  // Playground
  if (name.includes("playground"))
    return picsum("playground-children-swings", sig);

  // Golden Gate
  if (name.includes("golden gate"))
    return picsum("goldengate-bridge-sanfrancisco", sig);

  // Pier / Waterfront
  if (name.includes("pier") || name.includes("waterfront"))
    return picsum("pier-waterfront-harbor", sig);

  // Farm / Petting Zoo
  if (name.includes("farm") || name.includes("petting zoo"))
    return picsum("farm-animals-pettingzoo", sig);

  // Safari / Wildlife
  if (name.includes("safari") || name.includes("wildlife"))
    return picsum("safari-wildlife-nature", sig);

  // Creek / River / Lake
  if (name.includes("creek") || name.includes("river") || name.includes("lake"))
    return picsum("creek-nature-outdoor", sig);

  // Library
  if (name.includes("library")) return picsum("library-books-reading", sig);

  // Theater / Theatre
  if (name.includes("theater") || name.includes("theatre"))
    return picsum("theater-stage-performance", sig);

  // Museum (generic fallback)
  if (name.includes("museum")) return picsum("museum-exhibits-culture", sig);

  // ── CATEGORY-BASED FALLBACKS ─────────────────────────────────────────────────
  const cat = activity.category;

  if (cat === "Theme Parks")
    return picsum("rollercoaster-themepark-family", sig);

  if (cat === "Parks") return picsum("park-playground-outdoor", sig);

  if (cat === "Museums") return picsum("museum-exhibit-culture", sig);

  if (cat === "Zoos" || cat === "Zoo")
    return picsum("zoo-animals-wildlife-family", sig);

  if (cat === "Aquariums" || cat === "Aquarium")
    return picsum("aquarium-fish-underwater-ocean", sig);

  if (cat === "Science Centers")
    return picsum("science-museum-interactive-stem", sig);

  if (cat === "Children's Museums")
    return picsum("childrens-museum-play-colorful", sig);

  if (cat === "Water Parks") return picsum("waterpark-waterslide-summer", sig);

  if (cat === "Indoor Play")
    return picsum("indoor-play-trampoline-family", sig);

  if (cat === "Botanical Gardens")
    return picsum("botanical-garden-plants-nature", sig);

  if (cat === "Planetariums") return picsum("planetarium-stars-dome", sig);

  if (cat === "Art Museums")
    return picsum("artmuseum-paintings-gallery-culture", sig);

  if (cat === "History Museums")
    return picsum("history-artifacts-heritage", sig);

  if (cat === "Weekend Activities")
    return picsum("family-outdoor-weekend-fun", sig);

  // Ultimate fallback
  return picsum("family-fun-outdoor-adventure", sig);
}
