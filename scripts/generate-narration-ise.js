/**
 * 伊勢神宮のナレーション音声をOpenAI(onyx)でまとめて生成する。
 *
 * 使い方:
 *   export OPENAI_API_KEY="sk-..."
 *   node scripts/generate-narration-ise.js
 */
const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "004_ise");

const LINES = [
  { file: "title.mp3", text: "Ise Jingu, Mie." },
  { file: "map.mp3", text: "Ise Jingu." },
  {
    file: "hook.mp3",
    text: "The goddess enshrined here might not have started out as a goddess at all.",
  },
  {
    file: "fact-1.mp3",
    text: "One hundred twenty five shrines make up what's simply called Jingu. The inner shrine honors the sun goddess Amaterasu. The outer shrine honors Toyouke, goddess of food. Together, their history stretches back over two thousand years.",
  },
  {
    file: "fact-2.mp3",
    text: "Every twenty years, without exception, this entire shrine is torn down and rebuilt from scratch — every building, every gate. It's happened sixty-two times since the year six ninety.",
  },
  {
    file: "fact-3.mp3",
    text: "Some scholars believe the sun goddess enshrined here didn't start out as a goddess at all. Ancient records suggest the deity was originally male — until a reigning empress may have remade the sun in her own image.",
  },
  {
    file: "twist.mp3",
    text: "For twelve hundred years, the emperors stayed away. Their own ancestral goddess is enshrined here — yet no reigning emperor visited. A ritual proxy took their place, and the journey itself was nearly impossible. It took a modern empire, in eighteen sixty-nine, to finally end the silence.",
  },
  { file: "outro.mp3", text: "Worth the visit? Absolutely." },
];

generateAll(OUTPUT_DIR, LINES);
