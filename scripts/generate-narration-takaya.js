/**
 * 高屋神社のナレーション音声をまとめて自動生成するスクリプト。
 *
 * 使い方:
 *   export OPENAI_API_KEY="sk-..."
 *   node scripts/generate-narration-takaya.js
 */

const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "003_takaya");
const VOICE = "onyx";
const MODEL = "tts-1-hd";

const LINES = [
  { file: "title.mp3", text: "Kagawa, Japan." },
  { file: "map.mp3", text: "Takaya Shrine." },
  {
    file: "hook.mp3",
    text: "Most visitors never learn why this shrine sits on top of such an inconvenient mountain.",
  },
  {
    file: "fact-1.mp3",
    text: "This torii gate stands four hundred and four meters above the Seto Inland Sea, with nothing but clouds beyond it. Climb high enough, and it seems to open directly into the sky.",
  },
  {
    file: "fact-2.mp3",
    text: "Three kami are enshrined together here — one of only twenty-four shrines from this region listed in a tenth century imperial record.",
  },
  {
    file: "fact-3.mp3",
    text: "Along the stone stairway sits a massive boulder. Press it with a single finger, and it rocks. It has never once fallen.",
  },
  {
    file: "twist.mp3",
    text: "The shrine was carried down this mountain twice, in the sixteen hundreds and the seventeen hundreds. In eighteen thirty-one, villagers hauled it all the way back to the summit — terrified of what a curse might bring if they didn't.",
  },
  { file: "outro.mp3", text: "Worth the visit? Absolutely." },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateOne(line, attempt = 1) {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, voice: VOICE, input: line.text }),
  });

  if (res.status === 429 && attempt <= 3) {
    console.log(`  … ${line.file} がレート制限。25秒待って再試行します(${attempt}/3回目)`);
    await sleep(25000);
    return generateOne(line, attempt + 1);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${line.file}: ${res.status} ${errText}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(OUTPUT_DIR, line.file), buffer);
  console.log(`✓ ${line.file} (${buffer.length} bytes)`);
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY が設定されてません。先に export OPENAI_API_KEY=... してください。");
    process.exit(1);
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`${LINES.length}個のナレーションを生成します(声: ${VOICE})...`);
  console.log(`レート制限(1分3回まで)に収まるよう間隔を空けるので、全体で3分ほどかかります。`);

  for (let i = 0; i < LINES.length; i++) {
    const line = LINES[i];
    try {
      await generateOne(line);
    } catch (e) {
      console.error(`✗ ${line.file} 失敗:`, e.message);
    }
    if (i < LINES.length - 1) await sleep(21000);
  }
  console.log("完了しました。public/audio/003_takaya/ を確認してください。");
}

main();
