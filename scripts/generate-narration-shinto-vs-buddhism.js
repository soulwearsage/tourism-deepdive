const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "000_shinto-vs-buddhism");

const LINES = [
  { "file": "title.mp3", "text": "Shinto vs. Buddhism, Japan." },
  { "file": "map.mp3",   "text": "Shinto vs. Buddhism." },
  { "file": "hook.mp3",  "text": "Think Japanese shrines and temples are the same? They were. Until 1868." },
  { "file": "fact-1.mp3", "text": "Long before Buddhism arrived, ancient Japanese worshipped nature itself — giant rocks, mountains, rivers, and ancient trees were believed to be the dwelling places of kami. This worldview became known as Ko-Shinto, the ancient way of the gods." },
  { "file": "fact-2.mp3", "text": "In the 6th century, Buddhism arrived from the Asian mainland. But the old gods weren't pushed aside — instead, kami and Buddhas came to be understood as different expressions of the same sacred truth, and this blended tradition became known as Shinbutsu-shugo." },
  { "file": "fact-3.mp3", "text": "That fusion endured for more than a thousand years. Then in 1868, the Meiji government issued a decree — Shinbutsu Bunri — ordering the separation of Shinto and Buddhism. Centuries of shared tradition were dismantled almost overnight." },
  { "file": "twist.mp3",  "text": "More than 150 years later, Japan's shrines and temples are still living out that forced divorce — standing side by side, but never again as one. Yet history never disappears completely. In a few quiet corners of Japan, the old fusion survived — hidden deep in the mountains, or carved into cliffs where Buddhas and kami still seem to share the same sacred landscape. So why did building a modern nation require tearing one faith into two?" },
  { "file": "outro.mp3",  "text": "Worth the visit? Absolutely." }
];

generateAll(OUTPUT_DIR, LINES);
