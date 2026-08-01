const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "008_minashi");

const LINES = [
  { file: "title.mp3", text: "Minashi Shrine, Gifu." },
  { file: "map.mp3", text: "Minashi Shrine." },
  {
    file: "hook.mp3",
    text: "The shrine behind Japan's most famous anime love story hides an even older secret.",
  },
  {
    file: "fact-1.mp3",
    text: "Its name — Minashi — mirrors the fictional \"Miyamizu\" shrine in one of Japan's most celebrated animated films, almost letter for letter reversed.",
  },
  {
    file: "fact-2.mp3",
    text: "This single sacred mountain feeds two oceans — one river runs to the Sea of Japan, the other all the way to the Pacific.",
  },
  {
    file: "fact-3.mp3",
    text: "During the final days of World War Two, the sacred treasure of Atsuta Shrine — believed to be the legendary sword Kusanagi — was secretly moved here for safekeeping.",
  },
  {
    file: "twist.mp3",
    text: "A local oral tradition, passed down for generations and unrecognized by mainstream history, claims a lost \"Hida Dynasty\" once ruled from this very peak — centuries before Yamato, centuries before Izumo. Historians call it legend. The mountain keeps its silence.",
  },
  { file: "outro.mp3", text: "Worth the visit? Absolutely." },
];

generateAll(OUTPUT_DIR, LINES);
