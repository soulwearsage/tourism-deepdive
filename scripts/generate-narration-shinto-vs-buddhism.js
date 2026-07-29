const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "000_shinto-vs-buddhism");

const LINES = [
  { "file": "title.mp3", "text": "Shinto vs. Buddhism, Japan." },
  { "file": "map.mp3",   "text": "Shinto vs. Buddhism." },
  { "file": "hook.mp3",  "text": "For over a thousand years, Japan's gods and Buddhas were worshipped side by side in the same grounds. Then, in a single year, the government tore them apart." },
  { "file": "fact-1.mp3", "text": "Long before Buddhism arrived, ancient Japanese worshipped nature itself — giant rocks, mountains, and trees were treated as gods. This belief became known as Ko-Shinto, the old way of the gods." },
  { "file": "fact-2.mp3", "text": "In the 6th century, Buddhism arrived from the mainland. But the old gods weren't pushed out — instead, kami and Buddhist statues began sharing the same shrine grounds, blending into a single faith called Shinbutsu-shugo." },
  { "file": "fact-3.mp3", "text": "That fusion, over a thousand years in the making, was torn apart in 1868 by a new government decree — Shinbutsu Bunri, the forced separation of Shinto and Buddhism." },
  { "file": "twist.mp3",  "text": "More than 150 years later, Japan's shrines and temples are still living out that forced divorce — standing side by side, but never again as one. Yet in a few quiet corners of the country, that fused form was never fully erased — preserved deep in the mountains, carved as the face of a Buddha into a cliff. So why is it that a faith once fused for over a thousand years never found its way back together?" },
  { "file": "outro.mp3",  "text": "Worth the visit? Absolutely." }
];

generateAll(OUTPUT_DIR, LINES);
