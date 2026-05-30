/**
 * Registry of named image "areas" the site renders via <PlacedImage area=...>.
 * The admin Image Placements screen lists these so an editor can assign any
 * library image to each spot without touching code. Add an entry here when you
 * add a new <PlacedImage> to a page.
 */
export interface AreaDef {
  area: string;
  label: string;
  page: string;
  /** Recommended aspect ratio for this slot (guidance for the editor). */
  aspect: string;
  note?: string;
}

export const PLACEMENT_AREAS: AreaDef[] = [
  // Home
  { area: "home.portrait", label: "Home — hero portrait", page: "/", aspect: "4/5", note: "Portrait beside the intro" },
  { area: "home.feature", label: "Home — feature band", page: "/", aspect: "21/9", note: "Wide landscape works best" },
  { area: "home.card.about", label: "Home card — About", page: "/", aspect: "16/10", note: "Card cover" },
  { area: "home.card.medicine", label: "Home card — Family Medicine", page: "/", aspect: "16/10", note: "Card cover" },
  { area: "home.card.balance", label: "Home card — Balance", page: "/", aspect: "16/10", note: "Card cover" },
  { area: "home.card.technology", label: "Home card — Technology", page: "/", aspect: "16/10", note: "Card cover" },
  { area: "home.card.outdoors", label: "Home card — Outside the Hospital", page: "/", aspect: "16/10", note: "Card cover" },
  { area: "home.card.projects", label: "Home card — Projects", page: "/", aspect: "16/10", note: "Card cover" },
  { area: "home.card.philosophy", label: "Home card — Philosophy", page: "/", aspect: "16/10", note: "Card cover" },
  { area: "home.card.writing", label: "Home card — Writing", page: "/", aspect: "16/10", note: "Card cover" },
  { area: "home.glimpse1", label: "Home — glimpses gallery 1", page: "/", aspect: "1/1", note: "Square" },
  { area: "home.glimpse2", label: "Home — glimpses gallery 2", page: "/", aspect: "1/1", note: "Square" },
  { area: "home.glimpse3", label: "Home — glimpses gallery 3", page: "/", aspect: "1/1", note: "Square" },
  // Body side-images
  { area: "balance.side", label: "Balance — side image", page: "/balance", aspect: "4/5", note: "Beside the closing" },
  { area: "technology.side", label: "Technology — side image", page: "/technology", aspect: "4/5", note: "Beside the closing" },
  { area: "philosophy.opening", label: "Philosophy — opening side image", page: "/philosophy", aspect: "4/5", note: "Beside the opening" },
  { area: "philosophy.goal", label: "Philosophy — goal side image", page: "/philosophy", aspect: "4/5", note: "Beside the goal" },
  // About
  { area: "about.profile", label: "About — profile photo", page: "/about", aspect: "4/5", note: "Portrait of Zev" },
  // Path
  { area: "path.hero", label: "Path — hero", page: "/path", aspect: "3/2", note: "A scene from the journey" },
  // Family Medicine
  { area: "medicine.portrait", label: "Family Medicine — portrait", page: "/medicine", aspect: "4/5", note: "Clinical / professional portrait" },
  // Balance
  { area: "balance.hero", label: "Balance — hero", page: "/balance", aspect: "16/9", note: "Calming landscape" },
  // Technology
  { area: "technology.portrait", label: "Technology — portrait", page: "/technology", aspect: "4/5", note: "Portrait" },
  // Outdoors
  { area: "outdoors.hero", label: "Outdoors — hero", page: "/outdoors", aspect: "16/9", note: "Landscape" },
  { area: "outdoors.climbing", label: "Outdoors — Climbing", page: "/outdoors", aspect: "4/5", note: "Portrait" },
  { area: "outdoors.maisy", label: "Outdoors — Maisy", page: "/outdoors", aspect: "4/5", note: "Portrait" },
  // Projects / Work
  { area: "work.hero", label: "Projects — hero", page: "/work", aspect: "3/2", note: "Community / building scene" },
  // Philosophy
  { area: "philosophy.portrait", label: "Philosophy — portrait", page: "/philosophy", aspect: "4/5", note: "Warm portrait" },
  // Unplugged
  { area: "unplugged.hero", label: "Unplugged — hero", page: "/unplugged", aspect: "3/2", note: "Camp scene" },
  { area: "unplugged.camp1", label: "Unplugged — camp tile 1", page: "/unplugged", aspect: "1/1", note: "Square" },
  { area: "unplugged.camp2", label: "Unplugged — camp tile 2", page: "/unplugged", aspect: "1/1", note: "Square" },
  { area: "unplugged.camp3", label: "Unplugged — camp tile 3", page: "/unplugged", aspect: "1/1", note: "Square" },
  // CV
  { area: "cv.portrait", label: "CV — portrait", page: "/cv", aspect: "4/5", note: "Professional headshot" },
  // Contact
  { area: "contact.portrait", label: "Contact — portrait", page: "/contact", aspect: "4/5", note: "Friendly portrait" },
];
