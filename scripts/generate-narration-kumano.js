/**
 * 熊野本宮大社のナレーション音声をOpenAI(onyx)でまとめて生成する。
 *
 * 使い方:
 *   export OPENAI_API_KEY="sk-..."
 *   node scripts/generate-narration-kumano.js
 */
const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "005_kumano");

const LINES = [
  { file: "title.mp3", text: "Kumano Hongu Taisha, Wakayama." },
  { file: "map.mp3", text: "Kumano Hongu Taisha." },
  {
    file: "hook.mp3",
    text: "At one of Japan's holiest shrines, nobody is certain who they're actually praying to.",
  },
  {
    file: "fact-1.mp3",
    text: "Japan's largest torii gate, thirty four meters tall, marks the original site of this shrine. Only four of the original twelve shrine buildings survived a flood that destroyed most of it in 1889. They were moved to where the shrine stands today.",
  },
  {
    file: "fact-2.mp3",
    text: "Over forty seven hundred shrines across Japan trace back to this single site — making it the head shrine of all Kumano worship.",
  },
  {
    file: "fact-3.mp3",
    text: "A three legged crow guided Japan's first emperor. Its three legs are said to represent heaven, earth, and humanity. Today, that same crow is the emblem of Japan's national football team.",
  },
  {
    file: "twist.mp3",
    text: "No one is certain who they're worshipping. This region is called Kii — \"Land of Trees\" — after a myth of the god Susanoo scattering tree seeds here. The word \"Kumano\" itself means \"the hidden place,\" where the spirits of the dead were once believed to gather. Sun god. Water god. Tree god. After a thousand years, historians still don't agree on who's really enshrined here.",
  },
  { file: "outro.mp3", text: "Worth the visit? Absolutely." },
];

generateAll(OUTPUT_DIR, LINES);
