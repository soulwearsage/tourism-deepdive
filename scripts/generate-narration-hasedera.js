const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "009_hasedera");

const LINES = [
  { file: "title.mp3", text: "Hase-dera, Kamakura." },
  { file: "map.mp3", text: "Hase-dera." },
  {
    file: "hook.mp3",
    text: "For centuries, not even the head priest has been allowed to see the object at the center of this temple.",
  },
  {
    file: "fact-1.mp3",
    text: "The temple's principal image is a giant wooden Eleven-Headed Kannon — one of Japan's tallest wooden Buddhist statues — classified as an absolute hibutsu. Even the resident priests have never laid eyes on it.",
  },
  {
    file: "fact-2.mp3",
    text: "Three small stone jizo are scattered through the grounds, each carved with a round, smiling face. Locals call them Ryoen Jizo — guardians of good relationships.",
  },
  {
    file: "fact-3.mp3",
    text: "Beneath the main hall runs a pitch-black corridor. Visitors feel along the wall in total darkness until their hand finds a single iron key, said to unlock paradise for whoever touches it.",
  },
  {
    file: "twist.mp3",
    text: "Legend says the statue was carved from one giant camphor tree, split in two: one half enshrined in Nara, the other set adrift in the sea with a prayer that it would find whoever needed saving. Fifteen years later, it washed ashore right here in Kamakura.",
  },
  { file: "outro.mp3", text: "Worth the visit? Absolutely." },
];

generateAll(OUTPUT_DIR, LINES);
