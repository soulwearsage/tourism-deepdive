/**
 * public/photos/ フォルダを常時監視して、
 *   1. 新しいスポットのフォルダを検知 → まだ.tsが無ければ scaffold-spot.js を自動実行(Notionから生成)
 *   2. そのスポットの.tsが要求してる写真(photoSrc)が全部揃った瞬間 →
 *        Notionの「TTSエンジン」列が OpenAI  → そのまま auto-pipeline.js を自動実行(TTSもauto-pipeline内で自動生成)
 *        Notionの「TTSエンジン」列が ElevenLabs → ナレーション自動生成はスキップし、
 *          public/audio-raw/<番号>_<名前>/full.mp3 (ElevenLabsで手動生成した1本の音声)が置かれるのを待ってから
 *          split-narration-audio.js で自動分割 → auto-pipeline.js --skip-narration を実行
 * まで無人で繋げるスクリプト。
 *
 * 使い方(常時起動しておく):
 *   export NOTION_API_KEY="secret_..."
 *   export OPENAI_API_KEY="sk-..."       (TTSエンジンがOpenAIのスポット用)
 *   node scripts/watch-photos.js
 *
 * 【ElevenLabsを使う場合の置き場所】
 *   public/audio-raw/<番号>_<ローマ字名>/full.mp3
 *   (フレーズ間に0.8秒以上の無音を空けて1本にまとめた音声。split-narration-audio.jsの前提と同じ)
 *
 * 【重要・要Claude Code側の対応】
 *   auto-pipeline.js は現状「写真確認→ナレーション自動生成(OpenAI)→...」という決め打ちの流れなので、
 *   ElevenLabs経路では「ナレーション自動生成」の工程を丸ごとスキップする --skip-narration フラグの
 *   対応が auto-pipeline.js 側にまだ入ってません。Claude Codeで以下を追記してください:
 *     - process.argv に "--skip-narration" が含まれていたら、
 *       generate-narration-<name>.js を呼ぶ処理をスキップして、計測・push・レンダリングへ進む
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const chokidar = require("chokidar");
const { Client } = require("@notionhq/client");

const ROOT = path.join(__dirname, "..");
const PHOTOS_DIR = path.join(ROOT, "public", "photos");
const AUDIO_RAW_DIR = path.join(ROOT, "public", "audio-raw");
const SPOTS_DIR = path.join(ROOT, "src", "spots");
const STATE_FILE = path.join(__dirname, ".watch-state.json");
const DATA_SOURCE_ID = "3aa478e5-04f6-801d-91a9-000b2c107edf";

const notion = process.env.NOTION_API_KEY ? new Client({ auth: process.env.NOTION_API_KEY }) : null;

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return { done: [] };
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
}
function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function log(...args) {
  console.log(`[${new Date().toLocaleTimeString("ja-JP")}]`, ...args);
}

function folderNameToShortId(folderName) {
  const m = folderName.match(/^\d+_(.+)$/);
  return m ? m[1] : null;
}

function findSpotTsFile(shortId) {
  if (!fs.existsSync(SPOTS_DIR)) return null;
  const found = fs.readdirSync(SPOTS_DIR).find((f) => f.endsWith(`-${shortId}.ts`));
  return found ? path.join(SPOTS_DIR, found) : null;
}

function extractRequiredPhotoPaths(tsFilePath) {
  const content = fs.readFileSync(tsFilePath, "utf-8");
  const matches = [...content.matchAll(/photos\/[^"'`]+\.(?:png|jpg|jpeg)/g)];
  return [...new Set(matches.map((m) => m[0]))];
}

function allPhotosReady(requiredPaths) {
  return requiredPaths.every((rel) => fs.existsSync(path.join(ROOT, "public", rel)));
}

function tryScaffold(shortId) {
  log(`🛠  ${shortId}: .tsファイルが無いので scaffold-spot.js を実行します`);
  try {
    execFileSync("node", ["scripts/scaffold-spot.js", shortId], { cwd: ROOT, stdio: "inherit" });
    return true;
  } catch (e) {
    log(`❌ ${shortId}: scaffold-spot.js が失敗しました。Notion側のデータを確認してください。`);
    return false;
  }
}

async function getTtsEngine(shortId) {
  if (!notion) {
    log(`⚠️  NOTION_API_KEY未設定のため、TTSエンジン列が確認できません。OpenAIとして扱います。`);
    return "OpenAI";
  }
  try {
    const res = await notion.dataSources.query({
      data_source_id: DATA_SOURCE_ID,
      filter: { property: "名前", rich_text: { contains: shortId } },
    });
    const page = res.results[0];
    const engine = page?.properties?.["TTSエンジン"]?.select?.name;
    return engine === "ElevenLabs" ? "ElevenLabs" : "OpenAI";
  } catch (e) {
    log(`⚠️  ${shortId}: Notionからエンジン設定を取得できませんでした。OpenAIとして扱います。(${e.message})`);
    return "OpenAI";
  }
}

function runAutoPipeline(shortId, { skipNarration }) {
  const args = ["scripts/auto-pipeline.js", shortId];
  if (skipNarration) args.push("--skip-narration");
  log(`🚀 ${shortId}: auto-pipeline.js を自動実行します${skipNarration ? "(ナレーション生成はスキップ)" : ""}`);
  try {
    execFileSync("node", args, { cwd: ROOT, stdio: "inherit" });
    log(`✅ ${shortId}: 完了しました。video/フォルダを確認してください。`);
    return true;
  } catch (e) {
    log(`❌ ${shortId}: auto-pipeline.js が失敗しました。ログを確認してください。`);
    return false;
  }
}

function runSplitNarration(shortId, rawAudioPath) {
  log(`🎧 ${shortId}: ElevenLabsの音声を検知。split-narration-audio.js で自動分割します`);
  try {
    execFileSync("node", ["scripts/split-narration-audio.js", shortId, rawAudioPath], { cwd: ROOT, stdio: "inherit" });
    return true;
  } catch (e) {
    log(`❌ ${shortId}: split-narration-audio.js が失敗しました(無音区間の数が合わない等)。ログを確認してください。`);
    return false;
  }
}

async function checkSpot(shortId) {
  const state = loadState();
  if (state.done.includes(shortId)) return;

  let tsFile = findSpotTsFile(shortId);
  if (!tsFile) {
    if (!tryScaffold(shortId)) return;
    tsFile = findSpotTsFile(shortId);
    if (!tsFile) return;
  }

  const required = extractRequiredPhotoPaths(tsFile);
  if (required.length === 0) return;

  if (!allPhotosReady(required)) {
    const missing = required.filter((rel) => !fs.existsSync(path.join(ROOT, "public", rel)));
    log(`⏳ ${shortId}: まだ写真が足りません → ${missing.join(", ")}`);
    return;
  }

  const engine = await getTtsEngine(shortId);

  if (engine === "OpenAI") {
    const ok = runAutoPipeline(shortId, { skipNarration: false });
    if (ok) {
      state.done.push(shortId);
      saveState(state);
    }
    return;
  }

  // ElevenLabs経路: 写真は揃ったが、まだ手動録音の音声待ち
  const num = path.basename(tsFile).split("-")[0];
  const rawAudioPath = path.join(AUDIO_RAW_DIR, `${num}_${shortId}`, "full.mp3");
  if (!fs.existsSync(rawAudioPath)) {
    log(`⏳ ${shortId}: 写真は揃いましたが、ElevenLabsの音声(${path.relative(ROOT, rawAudioPath)})がまだありません`);
    return;
  }

  if (runSplitNarration(shortId, rawAudioPath)) {
    const ok = runAutoPipeline(shortId, { skipNarration: true });
    if (ok) {
      state.done.push(shortId);
      saveState(state);
    }
  }
}

function main() {
  if (!fs.existsSync(PHOTOS_DIR)) fs.mkdirSync(PHOTOS_DIR, { recursive: true });
  if (!fs.existsSync(AUDIO_RAW_DIR)) fs.mkdirSync(AUDIO_RAW_DIR, { recursive: true });
  log(`👀 監視開始: ${PHOTOS_DIR}`);
  log(`👀 監視開始: ${AUDIO_RAW_DIR} (ElevenLabs用の生音声置き場)`);
  log("   (Ctrl+Cで停止)");

  const handle = (filePath) => {
    const folderName = path.basename(path.dirname(filePath));
    const shortId = folderNameToShortId(folderName);
    if (!shortId) return;
    checkSpot(shortId);
  };

  chokidar.watch(PHOTOS_DIR, { ignoreInitial: false, depth: 1 }).on("add", handle);
  chokidar.watch(AUDIO_RAW_DIR, { ignoreInitial: false, depth: 1 }).on("add", handle);
}

main();

