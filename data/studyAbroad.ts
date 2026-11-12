/**
 * Study-abroad photos on About. Each city is a pin on the Europe map.
 * `pin` is a percentage of the map (0 to 100). Photos live in
 * public/images/study-abroad. The same file can also be listed in data/albums.ts.
 */
import type { AlbumPhoto } from "./albums";

export type StudyCity = {
  id: string;
  city: string;
  country: string;
  /** Pin position on the map, in percent. */
  pin: { x: number; y: number };
  photos: AlbumPhoto[];
};

const shot = (file: string, alt: string, caption: string): AlbumPhoto => ({
  src: `/images/study-abroad/${file}.webp`,
  alt,
  caption,
});

export const studyAbroadCities: StudyCity[] = [
  {
    id: "madrid",
    city: "Madrid",
    country: "Spain",
    pin: { x: 18, y: 64 },
    photos: [
      shot("01", "A bronze lion sculpture beside the Alfonso XII monument in Retiro Park, Madrid.", "Retiro Park"),
      shot("02", "A narrow street of apartment buildings in Madrid.", "Madrid"),
      shot("03", "A cobblestone street of apartment buildings in Madrid.", "Madrid"),
      shot("04", "An ornate corner building in Madrid.", "Madrid"),
      shot("05", "The Royal Palace in Madrid, seen from the Sabatini Gardens.", "Royal Palace"),
      shot(
        "06",
        "A red and silver Frecciarossa train waiting at a station platform.",
        "Train station",
      ),
    ],
  },
  {
    id: "munich",
    city: "Munich",
    country: "Germany",
    pin: { x: 48, y: 40 },
    photos: [
      shot("07", "The New Town Hall tower in Marienplatz, Munich.", "Marienplatz"),
      shot("08", "Two people sitting by a train window, with green fields outside.", "On the train"),
      shot("09", "A sugared pastry in front of Cafe Frischhut in Munich.", "Cafe Frischhut"),
      shot("10", "The ornate facade of the Asamkirche in Munich.", "Asamkirche"),
      shot("11", "Framed photographs in a gallery window.", "Munich"),
      shot("12", "More framed photographs in a gallery window.", "Munich"),
      shot("13", "The gilded interior of a church in Munich.", "Munich"),
      shot("14", "Red rooftops under a cloudy sky in Munich.", "Munich"),
      shot("15", "A night soccer match at Allianz Arena, with red flags in the crowd.", "Allianz Arena"),
      shot("16", "Another view of the night match at Allianz Arena.", "Allianz Arena"),
      shot("17", "The inside of a beer tent roof, with wreaths hanging from it.", "Oktoberfest"),
      shot("18", "Street food in a paper tray, with wooden forks.", "Munich"),
      shot("19", "The Oktoberfest fairgrounds, with a Ferris wheel and a crowded midway.", "Oktoberfest"),
      shot("20", "A plate of goulash with two dumplings.", "Munich"),
    ],
  },
];
