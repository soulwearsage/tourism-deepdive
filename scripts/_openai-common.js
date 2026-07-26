/**
 * OpenAIのTTS APIでナレーションをまとめて生成する共通ロジック。
 * 各スポットの generate-narration-*.js から呼び出して使う。
 *
 * 使い方(各スポットのスクリプト側):
 *   export OPENAI_API_KEY="sk-..."
 *   node scripts/generate-narration-xxx.js
 *
 * 声を変えたい場合はVOICEの値を変更(選べる声: alloy, ash, coral, echo, fable, onyx, nova, sage, shimmer)
 */

const fs = require("fs");
const path = require("path");

const VOICE = "onyx"; // 低め・落ち着いた男性声
const MODEL = "tts-1-hd";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateOne(outputDir, line, attempt = 1) {
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
    return generateOne(outputDir, line, attempt + 1);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${line.file}: ${res.status} ${errText}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(outputDir, line.file), buffer);
  console.log(`✓ ${line.file} (${buffer.length} bytes)`);
}

async function generateAll(outputDir, lines) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY が設定されてません。先に export OPENAI_API_KEY=... してください。");
    process.exit(1);
  }
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`${lines.length}個のナレーションを生成します(声: ${VOICE})...`);
  console.log(`レート制限(1分3回まで)に収まるよう間隔を空けるので、全体で3〜4分ほどかかります。`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    try {
      await generateOne(outputDir, line);
    } catch (e) {
      console.error(`✗ ${line.file} 失敗:`, e.message);
    }
    if (i < lines.length - 1) await sleep(21000);
  }
  console.log(`完了しました。${outputDir} を確認してください。`);
}

module.exports = { generateAll };
