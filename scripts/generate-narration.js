/**
 * ナレーション音声をまとめて自動生成するスクリプト。
 *
 * 使い方:
 *   1. OpenAIのAPIキーを環境変数にセット
 *        export OPENAI_API_KEY="sk-..."
 *   2. プロジェクトのルートで実行
 *        node scripts/generate-narration.js
 *   3. public/audio/001_fushimi-inari/ に9個のmp3が自動で生成される
 *
 * 声を変えたい場合は VOICE の値を変更してください。
 * 選べる声: alloy, echo, fable, onyx, nova, shimmer
 * (onyxが一番低め・落ち着いた男性声)
 */

const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "001_fushimi-inari");
const VOICE = "onyx";
const MODEL = "tts-1-hd"; // 高音質版。速度優先なら "tts-1"

const LINES = [
  { file: "title.mp3", text: "Kyoto, Japan." },
  { file: "map.mp3", text: "Fushimi Inari Taisha." },
  { file: "hook.mp3", text: "Nine out of ten visitors never learn who they're actually praying to." },
  {
    file: "fact-1.mp3",
    text: "This color isn't just red. It's called shu — believed to ward off evil, donated one gate at a time since the Edo period. Over ten thousand of them line this mountain.",
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
    body: JSON.stringify({
      model: MODEL,
      voice: VOICE,
      input: line.text,
    }),
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
  const outPath = path.join(OUTPUT_DIR, line.file);
  fs.writeFileSync(outPath, buffer);
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
    // 1分あたり3回までの制限に収まるよう、次のリクエストまで間隔を空ける
    if (i < LINES.length - 1) {
      await sleep(21000);
    }
  }

  console.log("完了しました。public/audio/001_fushimi-inari/ を確認してください。");
}

main();
