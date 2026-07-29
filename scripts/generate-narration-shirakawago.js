const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "013_shirakawago");

const LINES = [
  { "file": "title.mp3", "text": "Shirakawa-go, Gifu." },
  { "file": "map.mp3", "text": "Shirakawa-go." },
  { "file": "hook.mp3", "text": "For centuries, these houses were built to survive Japan's heaviest snowfall. But snow wasn't the only thing they were hiding." },
  { "file": "fact-1.mp3", "text": "In the mountain valleys once ruled by the Kaga domain, gassho-zukuri houses stand with steep thatched roofs, lashed together with rope instead of a single nail — a shape evolved purely to shed heavy snow." },
  { "file": "fact-2.mp3", "text": "The vast attic space, sometimes stacked two or three stories high, was never just storage. From the Meiji era onward, entire families raised silkworms there — turning a single house into a small silk factory." },
  { "file": "fact-3.mp3", "text": "Beneath the floor lay an even bigger secret. Villagers fermented straw and wild plants for years to produce gunpowder — a closely guarded military secret of the Kaga domain." },
  { "file": "twist.mp3", "text": "In a quiet snowbound village, silkworms spun thread overhead while gunpowder fermented underfoot — two hidden industries inside a single house. In 1995, it was precisely that hidden quietness that earned Shirakawa-go its status as a UNESCO World Heritage Site." },
  { "file": "outro.mp3", "text": "Worth the visit? Absolutely." }
];

generateAll(OUTPUT_DIR, LINES);
