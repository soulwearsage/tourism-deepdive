const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "010_hosenin");

const LINES = [
  {
    "file": "title.mp3",
    "text": "Hoh-sen-in, Kyoto."
  },
  {
    "file": "map.mp3",
    "text": "Hoh-sen-in."
  },
  {
    "file": "hook.mp3",
    "text": "A garden framed like a painting — a perfect, timeless beauty. But that lush green moss? It didn't grow that way on its own."
  },
  {
    "file": "fact-1.mp3",
    "text": "The wooden pillars and lintel of the guest hall frame the garden like a living painting. At its center stands a 700-year-old five-needle pine, shaped to resemble Mount Mikami — Kyoto's own 'Omi Fuji.' The garden's name, Bankan-en, means 'a place too beautiful to leave.'"
  },
  {
    "file": "fact-2.mp3",
    "text": "Hoh-sen-in actually holds three distinct gardens — Bankan-en, the Crane-and-Turtle Garden, and Horaku-en."
  },
  {
    "file": "fact-3.mp3",
    "text": "Lean close to the bamboo pipe and you'll hear it — water dripping into a buried jar underground, its sound echoing up in a clear, hidden chime."
  },
  {
    "file": "twist.mp3",
    "text": "That 'perfect' moss garden was never wild. For generations, monks have hand-pulled every single weed, blade by blade, to keep it looking untouched."
  },
  {
    "file": "outro.mp3",
    "text": "Worth the visit? Absolutely."
  }
];

generateAll(OUTPUT_DIR, LINES);
