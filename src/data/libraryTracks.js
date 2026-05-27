import { AUTUMN_LEAVES_NOTES } from "./melodies/autumnLeaves";
import { BLUE_BOSSA_NOTES } from "./melodies/blueBossa";
import { SUMMERTIME_NOTES } from "./melodies/summertime";
import { WARMUP_SCALE_NOTES } from "./melodies/warmupScale";

/** Pre-digitized library tracks (structured notes, not images) */
export const LIBRARY_TRACKS = [
  {
    id: "autumn-leaves",
    title: "Autumn Leaves",
    subtitle: "Jazz standard · Easy",
    notes: AUTUMN_LEAVES_NOTES,
  },
  {
    id: "blue-bossa",
    title: "Blue Bossa",
    subtitle: "Latin jazz · Medium",
    notes: BLUE_BOSSA_NOTES,
  },
  {
    id: "summertime",
    title: "Summertime",
    subtitle: "Blues · Beginner",
    notes: SUMMERTIME_NOTES,
  },
  {
    id: "warmup-scale",
    title: "C Major Warm-up",
    subtitle: "Technique · Full scale",
    notes: WARMUP_SCALE_NOTES,
  },
];
