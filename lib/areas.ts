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
  { area: "home.feature", label: "Home — feature band", page: "/", aspect: "21/9", note: "Wide landscape works best" },
  { area: "about.profile", label: "About — profile photo", page: "/about", aspect: "4/5", note: "Portrait of Zev" },
  { area: "outdoors.hero", label: "Outdoors — hero", page: "/outdoors", aspect: "16/9", note: "Landscape" },
  { area: "outdoors.climbing", label: "Outdoors — Climbing", page: "/outdoors", aspect: "4/5", note: "Portrait" },
  { area: "outdoors.maisy", label: "Outdoors — Maisy", page: "/outdoors", aspect: "4/5", note: "Portrait" },
  { area: "unplugged.hero", label: "Unplugged — hero", page: "/unplugged", aspect: "3/2", note: "Camp scene" },
  { area: "unplugged.camp1", label: "Unplugged — camp tile 1", page: "/unplugged", aspect: "1/1", note: "Square" },
  { area: "unplugged.camp2", label: "Unplugged — camp tile 2", page: "/unplugged", aspect: "1/1", note: "Square" },
  { area: "unplugged.camp3", label: "Unplugged — camp tile 3", page: "/unplugged", aspect: "1/1", note: "Square" },
];
