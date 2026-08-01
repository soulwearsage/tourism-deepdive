/**
 * 厳島神社のナレーション音声をまとめて自動生成するスクリプト。
 *
 * 使い方:
 *   export OPENAI_API_KEY="sk-..."
 *   node scripts/generate-narration-itsukushima.js
 */

const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "002_itsukushima");
const VOICE = "onyx";
const MODEL = "tts-1-hd";

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
  console.log(`レート制限(1分3回まで)に収まるよう間隔を空けるので、全体で3〜4分ほどかかります。`);

  for (let i = 0; i < LINES.length; i++) {
    const line = LINES[i];
    try {
      await generateOne(line);
    } catch (e) {
      console.error(`✗ ${line.file} 失敗:`, e.message);
    }
    if (i < LINES.length - 1) await sleep(21000);
  }
  console.log("完了しました。public/audio/002_itsukushima/ を確認してください。");
}

main();
