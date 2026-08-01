/**
 * 出雲大社のナレーション音声をOpenAI(onyx)でまとめて生成する。
 *
 * 使い方:
 *   export OPENAI_API_KEY="sk-..."
 *   node scripts/generate-narration-izumo.js
 */
const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "006_izumo");

const LINES = [
  { file: "title.mp3", text: "Izumo Taisha, Shimane." },
  { file: "map.mp3", text: "Izumo Taisha." },
  {
    file: "hook.mp3",
    text: "Every October, the gods of Japan vanish from their shrines — all except in one place.",
  },
  {
    file: "fact-1.mp3",
    text: "Okuninushi once ruled Japan, until the myth of \"kuniyuzuri\" forced him to hand the land to the gods who came before the emperors. This shrine was his reward for stepping aside. Excavations in the year 2000 uncovered three massive pillars bound together as one — proof that it once stood forty eight meters tall, nearly half the height of the Great Pyramid of Giza.",
  },
  {
    file: "fact-2.mp3",
    text: "Online, some compare its ancient internal passage and chamber to the Great Pyramid's own. Historians dismiss it as legend — but the resemblance is hard to unsee.",
  },
  {
    file: "fact-3.mp3",
    text: "Inside the shrine, the god Okuninushi doesn't face his own worshippers. His sacred seat points sideways, to the west — so a separate entrance was built just so visitors could pray to him face to face. Some say it was designed that way on purpose.",
  },
  {
    file: "twist.mp3",
    text: "For centuries, people believed the gods gather in Izumo because they abandon every other shrine in Japan. But one shrine's god never goes — bound by a promise he made after losing an ancient power struggle: to never leave this land again. So today, only one other place in Japan is still called the month of the present gods.",
  },
  { file: "outro.mp3", text: "Worth the visit? Absolutely." },
];

generateAll(OUTPUT_DIR, LINES);
