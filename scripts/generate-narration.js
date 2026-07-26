/**
 * 伏見稲荷のナレーション音声をElevenLabs(Milo)でまとめて生成する。
 *
 * 使い方:
 *   export OPENAI_API_KEY="sk-..."
 *   node scripts/generate-narration.js
 */
const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "001_fushimi-inari");

const LINES = [
  { file: "title.mp3", text: "Fushimi Inari Taisha, Kyoto." },
  { file: "map.mp3", text: "Fushimi Inari Taisha." },
  { file: "hook.mp3", text: "Nine out of ten visitors never learn who they're actually praying to." },
  {
    file: "fact-1.mp3",
    text: "Scattered across this mountain are nearly ten thousand private shrines, called otsuka. Each one carved by an individual believer, with a deity name that appears in no official record. Unrecognized beliefs, hiding in plain sight.",
  },
  {
    file: "fact-2.mp3",
    text: `There's a fringe theory: that "Inari" hides an echo of "INRI" — the words on Christ's cross, smuggled here by the shrine's founding clan. Historians call it wordplay. The legend refuses to die.`,
  },
  {
    file: "fact-3.mp3",
    text: "Five kami, enshrined as one. Leading them: Ukanomitama — the spirit of rice and food itself.",
  },
  {
    file: "fact-4.mp3",
    text: "The foxes aren't the gods. They're messengers. Look closely — each one carries something different: a rice sheaf, a key, a jewel, or a scroll.",
  },
  {
    file: "twist.mp3",
    text: "Here's the twist. The real shrine has no walls. The sacred object isn't inside any building — it's the mountain itself. The torii don't lead to the shrine. They ARE the shrine.",
  },
  { file: "outro.mp3", text: "Worth the visit? Absolutely." },
];

generateAll(OUTPUT_DIR, LINES);
