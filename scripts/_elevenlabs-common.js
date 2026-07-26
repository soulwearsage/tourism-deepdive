/**
 * ElevenLabsのAPIでナレーションをまとめて生成する共通ロジック。
 * 各スポットの generate-narration-*.js から呼び出して使う。
 *
 * 使い方(各スポットのスクリプト側):
 *   export ELEVENLABS_API_KEY="..."
 *   node scripts/generate-narration-xxx.js
 */

const fs = require("fs");
const path = require("path");

// Victor(候補として試験的に指定)
const VOICE_ID = "cPoqAvGWCPfCfyPMwe4z";
const MODEL_ID = "eleven_multilingual_v2";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateOne(outputDir, line, attempt = 1) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: line.text,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.75,
      },
    }),
  });

  if ((res.status === 429 || res.status === 401) && attempt <= 2) {
    console.log(`  … ${line.file} でエラー(${res.status})。20秒待って再試行します(${attempt}/2回目)`);
    await sleep(20000);
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
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error("ELEVENLABS_API_KEY が設定されてません。先に export ELEVENLABS_API_KEY=... してください。");
    process.exit(1);
  }
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`${lines.length}個のナレーションを生成します(声: Milo)...`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    try {
      await generateOne(outputDir, line);
    } catch (e) {
      console.error(`✗ ${line.file} 失敗:`, e.message);
    }
    // ElevenLabsはOpenAIほど厳しいレート制限が無いことが多いが、念のため軽く間隔を空ける
    if (i < lines.length - 1) await sleep(3000);
  }
  console.log(`完了しました。${outputDir} を確認してください。`);
}

module.exports = { generateAll };
