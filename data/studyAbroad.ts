/**
 * Study-abroad photos on About. Each city is a pin on the Europe map.
 * `pin` is a percentage of the map (0 to 100). Photos live in
 * public/images/study-abroad. The Allianz Arena shots come from data/albums.ts.
 */
import {
  allianzArenaPhotos,
  bernabeuPhotos,
  portugalMatchPhotos,
  stamfordBridgePhotos,
  type AlbumPhoto,
} from "./albums";

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
    pin: { x: 28.2, y: 83.6 },
    photos: [
      shot("01", "A bronze lion sculpture beside the Alfonso XII monument in Retiro Park, Madrid.", "Retiro Park"),
      shot("02", "A narrow street of apartment buildings in Madrid.", "Madrid"),
      shot("03", "A cobblestone street of apartment buildings in Madrid.", "Madrid"),
      shot("04", "An ornate corner building in Madrid.", "Madrid"),
      shot("05", "The Royal Palace in Madrid, seen from the Sabatini Gardens.", "Royal Palace"),
      shot("06", "A red and silver Frecciarossa train waiting at a station platform in Madrid.", "Madrid"),
      ...bernabeuPhotos,
      shot("70", "El Rastro market in Madrid.", "El Rastro"),
    ],
  },
  {
    id: "munich",
    city: "Munich",
    country: "Germany",
    pin: { x: 76.8, y: 56.3 },
    photos: [
      shot("07", "The New Town Hall tower in Marienplatz, Munich.", "Marienplatz"),
      shot("08", "Two people sitting by a train window, with green fields outside.", "On the train"),
      shot("09", "A sugared pastry in front of Cafe Frischhut in Munich.", "Cafe Frischhut"),
      shot("10", "The ornate facade of the Asamkirche in Munich.", "Asamkirche"),
      shot("11", "Framed photographs in a gallery window.", "Munich"),
      shot("12", "More framed photographs in a gallery window.", "Munich"),
      shot("13", "The gilded interior of a church in Munich.", "Munich"),
      shot("14", "Red rooftops under a cloudy sky in Munich.", "Munich"),
      ...allianzArenaPhotos,
      shot("17", "The inside of a beer tent roof, with wreaths hanging from it.", "Oktoberfest"),
      shot("18", "Street food in a paper tray, with wooden forks.", "Munich"),
      shot("19", "The Oktoberfest fairgrounds, with a Ferris wheel and a crowded midway.", "Oktoberfest"),
      shot("20", "A plate of goulash with two dumplings.", "Munich"),
    ],
  },
  {
    id: "london",
    city: "London",
    country: "United Kingdom",
    pin: { x: 39.6, y: 43 },
    photos: [
      shot("24", "Cups of strawberries at Borough Market.", "Borough Market"),
      shot("25", "A latte in a glass cup on a blue saucer.", "Borough Market"),
      shot("26", "Josue standing next to a red telephone box.", "London"),
      ...stamfordBridgePhotos,
      shot("29", "The London Eye beside the river.", "London Eye"),
      shot("30", "Big Ben, with a red double-decker bus in front of it.", "Big Ben"),
      shot("31", "The gates in front of Buckingham Palace.", "Buckingham Palace"),
    ],
  },
  {
    id: "barcelona",
    city: "Barcelona",
    country: "Spain",
    pin: { x: 46.9, y: 80.3 },
    photos: [
      shot("32", "The Sagrada Família, seen from below.", "Sagrada Família"),
      shot("33", "Casa Batlló lit up at night.", "Casa Batlló"),
    ],
  },
  {
    id: "portugal",
    city: "Portugal",
    country: "Portugal",
    pin: { x: 11.3, y: 89.1 },
    photos: [
      shot("52", "A yellow palace tower.", "Portugal"),
      shot("53", "Josue leaning over a red tower wall.", "Portugal"),
      shot("54", "A stained glass window.", "Portugal"),
      shot("55", "A view over a forest.", "Portugal"),
      shot("56", "A tiled archway.", "Portugal"),
      shot("57", "A view from a stone walkway.", "Portugal"),
      shot("58", "A rock in the ocean.", "Portugal"),
      shot("59", "The Cabo da Roca sign.", "Cabo da Roca"),
      shot("60", "A column in a square.", "Lisbon"),
      shot("61", "Rooftops at night.", "Portugal"),
      ...portugalMatchPhotos,
      shot("64", "The Crush Doughnuts shop.", "Crush Doughnuts"),
      shot("65", "Rainbow umbrellas.", "Lisbon"),
      shot("66", "Inside Time Out Market.", "Time Out Market"),
      shot("67", "A plate of shrimp and rice.", "Time Out Market"),
      shot("68", "A yellow tram, number 28.", "Tram 28"),
      shot("69", "Sunset on a beach.", "Portugal"),
    ],
  },
  {
    id: "canaries",
    city: "Canary Islands",
    country: "Spain",
    pin: { x: 9, y: 8.5 },
    photos: [
      shot("34", "A long table set in a garden.", "Canary Islands"),
      shot("35", "A mortar and pestle on a cutting board.", "Canary Islands"),
      shot("36", "An orange cat lying on cobblestones.", "Canary Islands"),
      shot("37", "A collage of photos on a wall.", "Canary Islands"),
      shot("38", "A bunch of bananas.", "Bananas"),
      shot("39", "A white flower.", "Canary Islands"),
      shot("40", "Banana plants beside the ocean.", "Canary Islands"),
      shot("41", "A fountain in a courtyard.", "Canary Islands"),
      shot("42", "A dragon tree.", "Dragon tree"),
      shot("43", "A balcony looking over the sea.", "Canary Islands"),
      shot("44", "A volcano peak above scrubland.", "Canary Islands"),
      shot("45", "A night sky full of stars.", "Night sky"),
      shot("46", "The Pleiades, photographed through a telescope.", "Pleiades through a telescope"),
      shot("47", "Comet SWAN, photographed through a telescope.", "Comet SWAN through a telescope"),
      shot("48", "A sundial on a white wall.", "Sundial"),
      shot("49", "A view from above the clouds.", "Above the clouds"),
      shot("50", "The Running Man Nebula, photographed through a telescope.", "Running Man Nebula through a telescope"),
      shot("51", "A plate of rice.", "Dinner"),
    ],
  },
];
