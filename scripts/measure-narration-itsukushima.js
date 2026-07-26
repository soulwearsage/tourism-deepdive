/**
 * 厳島神社のナレーション音声をElevenLabs(Milo)でまとめて生成する。
 *
 * 使い方:
 *   export OPENAI_API_KEY="sk-..."
 *   node scripts/generate-narration-itsukushima.js
 */
const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "002_itsukushima");

const LINES = [
  { file: "title.mp3", text: "Miyajima, Hiroshima." },
  { file: "map.mp3", text: "Itsukushima Shrine." },
  {
    file: "hook.mp3",
    text: "For over a thousand years, no one has been born on this island — and no one is allowed to die here either.",
  },
  {
    file: "fact-1.mp3",
    text: "This gate touches no ground. It isn't bolted down — it simply stands in the tide, held upright by its own weight, nearly sixty tons of it.",
  },
  {
    file: "fact-2.mp3",
    text: "Giving birth here is forbidden. So is dying. For centuries, islanders crossed to the mainland for both — the island itself is considered too sacred to bear either.",
  },
  {
    file: "fact-3.mp3",
    text: "Three sister goddesses have been enshrined here since 593 AD — the Munakata deities.",
  },
  {
    file: "fact-4.mp3",
    text: "The deer aren't wildlife. They're considered messengers of the gods, free to wander the shrine grounds exactly as they have for over a thousand years.",
  },
  {
    file: "twist.mp3",
    text: "High on Mount Misen, a fire lit in the year eight-oh-six has burned without stopping for over twelve hundred years. In nineteen forty-five, it lit the Peace Flame in Hiroshima — thirty kilometers away.",
  },
  { file: "outro.mp3", text: "Worth the visit? Absolutely." },
];

generateAll(OUTPUT_DIR, LINES);
