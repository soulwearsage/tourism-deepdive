const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "012_ine");

const LINES = [
  {
    "file": "title.mp3",
    "text": "Ineh, Kyoto."
  },
  {
    "file": "map.mp3",
    "text": "Ineh."
  },
  {
    "file": "hook.mp3",
    "text": "This bay looks like something from a fairytale — houses that float on the water. But they were never built for people."
  },
  {
    "file": "fact-1.mp3",
    "text": "Ine's first written record dates back to 1191, in a document called the Chokodo Shoryo Chumon, where it appears as \"Ine-no-sho.\" The poet Kamo no Chōmei, author of the famous Hojoki, is even said to have composed a poem about this very bay."
  },
  {
    "file": "fact-2.mp3",
    "text": "Those iconic \"funaya\" boathouses were never built as homes. The ground floor was a garage for pulling boats in from the sea, the second floor was storage — people rarely lived inside them at all. The actual family home stood separately, across the road."
  },
  {
    "file": "fact-3.mp3",
    "text": "About 230 funaya line the 5-kilometer curve of Ine Bay."
  },
  {
    "file": "twist.mp3",
    "text": "The fishing village a Heian-era poet once sang about still looks almost the same today. What was once built as a garage for boats slowly became the shape of everyday life itself."
  },
  {
    "file": "outro.mp3",
    "text": "Just a short drive from here wait two more of Japan's mysteries: Amanohashidate, one of Japan's three most celebrated views, and Kono Shrine — the legendary 'former Ise,' said to be where Ise Grand Shrine's deity once resided before moving south. The mystery isn't over yet."
  },
  {
    "file": "epilogue.mp3",
    "text": "Worth the visit? Absolutely."
  }
];

generateAll(OUTPUT_DIR, LINES);
