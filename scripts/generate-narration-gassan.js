const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "007_gassan");

const LINES = [
  { file: "title.mp3", text: "Gassan Shrine, Yamagata." },
  { file: "map.mp3", text: "Gassan Shrine." },
  {
    file: "hook.mp3",
    text: "One of Japan's three founding gods has almost no story at all.",
  },
  {
    file: "fact-1.mp3",
    text: "This mountain rises one thousand nine hundred eighty four meters, one of the world's rare round shield volcanoes. It was founded in 593 AD by a prince fleeing an assassination plot, guided here by a three legged sacred crow.",
  },
  {
    file: "fact-2.mp3",
    text: "During Japan's civil wars, monks hid the mountain's sacred treasures inside a secret cave — guarded for generations by a single hereditary family, sworn never to reveal its location.",
  },
  {
    file: "fact-3.mp3",
    text: "Step inside the summit shrine, and photography is forbidden. Every visitor must be purified first — a rule enforced exactly as it was centuries ago.",
  },
  {
    file: "twist.mp3",
    text: "Tsukuyomi has only one recorded story: he killed the goddess of food in disgust, and his own sister, Amaterasu, banished him forever — the reason day and night never meet in the sky. That same forgotten god is who pilgrims still climb this mountain to meet, praying for peace in the afterlife.",
  },
  { file: "outro.mp3", text: "Worth the visit? Absolutely." },
];

generateAll(OUTPUT_DIR, LINES);
