const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "011_katsuoji");

const LINES = [
  {
    "file": "title.mp3",
    "text": "勝尾寺, TODO地名."
  },
  {
    "file": "map.mp3",
    "text": "勝尾寺."
  },
  {
    "file": "hook.mp3",
    "text": "This temple's name almost declared it more powerful than the Emperor himself."
  },
  {
    "file": "fact-1.mp3",
    "text": "TODO : In the Heian era, Emperor Seiwa was so moved after a monk's prayers cured his illness that he declared the temple's power had \"defeated\" (katsu) even the emperor himself, and wanted to name it accordingly."
  },
  {
    "file": "fact-2.mp3",
    "text": "Countless tiny red daruma dolls fill every gap in the stone steps and walls — each one a self-made vow, not a wish granted by someone else. Pilgrims write their life's purpose on the bottom, a 365-day goal on the back, then paint in one eye as a signature to their own resolve. TODO"
  },
  {
    "file": "fact-3.mp3",
    "text": "The temple grounds span roughly 80,000 tsubo (about 264,000 square meters). TODO"
  },
  {
    "file": "twist.mp3",
    "text": "The name the emperor wanted was \"Katsuou-ji\" — the temple that defeated the king. But the monks found that far too immodest, so they quietly swapped one character, 王 (king) for 尾 (tail) — and the temple that could have boasted about beating an emperor ended up with one of the humblest name origins in Japan."
  },
  {
    "file": "outro.mp3",
    "text": "Worth the visit? Absolutely."
  }
];

generateAll(OUTPUT_DIR, LINES);
