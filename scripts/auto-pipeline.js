/**
 * 「写真が揃ったら、あとは1コマンドで全部やる」自動化パイプライン。
 *
 * やること:
 *   1. 必要な写真が揃ってるか確認
 *   2. ナレーション自動生成(scripts/generate-narration-<spot>.js を呼び出す)
 *   3. 尺を自動計測
 *   4. 計測結果をもとに、スポットの.tsファイル内のdurationSecondsを自動で書き換える
 *   5. git add / commit / push まで自動実行
 *   6. GitHub Actionsでの書き出しを自動実行
 *   7. 完了するまで自動で待つ
 *   8. 完成した動画を自動ダウンロードして、video/フォルダに配置
 *
 * 前提: `gh`コマンド(GitHub CLI)がログイン済みであること
 *
 * 使い方:
 *   export OPENAI_API_KEY="sk-..."
 *   node scripts/auto-pipeline.js minashi
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const getMP3Duration = require("get-mp3-duration");

const spotShortId = process.argv[2];
if (!spotShortId) {
  console.error("使い方: node scripts/auto-pipeline.js <スポットの短い名前(例: minashi)>");
  process.exit(1);
}

const ROOT = path.join(__dirname, "..");

// list-spots.jsと同じロジックでスポット情報を特定
function listSpots() {
  const dir = path.join(ROOT, "src", "spots");
  const files = fs.readdirSync(dir).filter((f) => /^\d+-.+\.ts$/.test(f));
  return files.map((file) => {
    const match = file.match(/^(\d+)-(.+)\.ts$/);
    const number = match[1];
    const kebabName = match[2];
    const shortId = kebabName.split("-")[0];
    return { number, kebabName, shortId, file };
  });
}

const spot = listSpots().find((s) => s.shortId === spotShortId);
if (!spot) {
  console.error(`✗ "${spotShortId}" というスポットが見つかりません。src/spots/ を確認してください。`);
  process.exit(1);
}

const specFile = path.join(ROOT, "src", "spots", spot.file);
const photoDir = path.join(ROOT, "public", "photos", `${spot.number}_${spot.shortId}`);
const audioDir = path.join(ROOT, "public", "audio", `${spot.number}_${spot.shortId}`);
const generateScript = path.join(ROOT, "scripts", `generate-narration-${spot.shortId}.js`);

console.log(`=== ${spot.shortId}(${spot.file}) の自動パイプラインを開始 ===`);

// --- 1. 写真の確認 ---
const specText = fs.readFileSync(specFile, "utf8");
const photoRefs = [
  ...specText.matchAll(/photoSrc:\s*"?photos\/[^"\n,]+\/([^"\n,]+\.png)"?/g),
  ...specText.matchAll(/HERO_PHOTO\s*=\s*"photos\/[^"\n,]+\/([^"\n,]+\.png)"/g),
].map((m) => m[1]);
const uniquePhotos = [...new Set(photoRefs)];
console.log(`必要な写真: ${uniquePhotos.join(", ")}`);
const missing = uniquePhotos.filter((p) => !fs.existsSync(path.join(photoDir, p)));
if (missing.length > 0) {
  console.error(`✗ 写真が足りません: ${missing.join(", ")} が ${photoDir} にありません。`);
  process.exit(1);
}
console.log("✓ 写真は揃ってます");

// --- 2. ナレーション生成 ---
if (!fs.existsSync(generateScript)) {
  console.error(`✗ ${generateScript} が見つかりません。`);
  process.exit(1);
}
console.log("--- ナレーション生成中(数分かかります) ---");
execSync(`node "${generateScript}"`, { stdio: "inherit", cwd: ROOT });

// --- 3. 尺を計測 ---
const FILES = ["title", "map", "hook", "fact-1", "fact-2", "fact-3", "fact-4", "twist", "outro"];
const measured = {};
for (const key of FILES) {
  const filePath = path.join(audioDir, `${key}.mp3`);
  if (!fs.existsSync(filePath)) continue;
  const buffer = fs.readFileSync(filePath);
  measured[key] = Math.round((getMP3Duration(buffer) / 1000) * 10) / 10;
}
console.log("--- 計測結果 ---");
console.log(measured);

// --- 4. durationSecondsを自動計算して書き換え ---
// ルール: ナレーション秒数 + 1.5秒の余白。ただしシーンごとに最低ラインを設ける
const BUFFER = 1.5;
const FLOORS = { title: 3.0, map: 4.2, hook: 4.5, outro: 4.5 };
function calc(key) {
  const sec = measured[key];
  if (sec === undefined) return null;
  const withBuffer = Math.round((sec + BUFFER) * 10) / 10;
  return FLOORS[key] ? Math.max(withBuffer, FLOORS[key]) : withBuffer;
}

let updated = specText;

// sceneDurations(title/map/hook/twist/outro)を書き換え
for (const key of ["title", "map", "hook", "twist", "outro"]) {
  const val = calc(key);
  if (val === null) continue;
  const re = new RegExp(`(  ${key}:\\s*)[0-9.]+(,)`);
  if (re.test(updated)) {
    updated = updated.replace(re, `$1${val}$2 // 自動計算(ナレーション${measured[key]}秒 + 余白)`);
  }
}

// facts配列の中のdurationSeconds(fact-1, fact-2, fact-3の順に対応)を書き換え
const factKeys = ["fact-1", "fact-2", "fact-3", "fact-4"].filter((k) => measured[k] !== undefined);
let searchFrom = 0;
for (const key of factKeys) {
  const val = calc(key);
  const idx = updated.indexOf("durationSeconds:", searchFrom);
  if (idx === -1) break;
  const lineEnd = updated.indexOf("\n", idx);
  const line = updated.slice(idx, lineEnd);
  const newLine = `durationSeconds: ${val}, // 自動計算(ナレーション${measured[key]}秒 + 余白)`;
  updated = updated.slice(0, idx) + newLine + updated.slice(lineEnd);
  searchFrom = idx + newLine.length;
}

fs.writeFileSync(specFile, updated);
console.log(`✓ ${specFile} の尺を自動更新しました`);

// --- 5. git add / commit / push ---
console.log("--- git commit & push ---");
execSync(`git add .`, { cwd: ROOT, stdio: "inherit" });
try {
  execSync(`git commit -m "auto-pipeline: finalize ${spot.shortId} narration and durations"`, { cwd: ROOT, stdio: "inherit" });
  execSync(`git push`, { cwd: ROOT, stdio: "inherit" });
} catch (e) {
  console.log("(コミットする変更が無かったか、pushで問題が起きました。内容を確認してください)");
  process.exit(1);
}

// --- 6. GitHub Actionsでの書き出しを自動実行 ---
console.log(`--- GitHub Actionsで ${spot.shortId} の書き出しを実行 ---`);
execSync(`gh workflow run render.yml -f spot=${spot.shortId}`, { cwd: ROOT, stdio: "inherit" });

// 実行が始まるまで少し待つ
execSync(`sleep 10`);

// 今動き出した実行(一番新しいもの)のIDを取得
const runId = execSync(
  `gh run list --workflow=render.yml --limit=1 --json databaseId --jq ".[0].databaseId"`,
  { cwd: ROOT }
).toString().trim();
console.log(`実行ID: ${runId}`);

// --- 7. 完了するまで待つ(最大15分、20秒おきに確認) ---
console.log("--- 完了を待ってます(数分かかります) ---");
let status = "";
for (let i = 0; i < 45; i++) {
  status = execSync(
    `gh run view ${runId} --json status --jq ".status"`,
    { cwd: ROOT }
  ).toString().trim();
  if (status === "completed") break;
  execSync(`sleep 20`);
}
if (status !== "completed") {
  console.error("✗ 15分待っても完了しませんでした。GitHubの画面で直接確認してください。");
  process.exit(1);
}

const conclusion = execSync(
  `gh run view ${runId} --json conclusion --jq ".conclusion"`,
  { cwd: ROOT }
).toString().trim();
if (conclusion !== "success") {
  console.error(`✗ 実行が失敗しました(結果: ${conclusion})。GitHubの画面でログを確認してください。`);
  process.exit(1);
}
console.log("✓ 書き出し完了");

// --- 8. Artifactをダウンロードして、videoフォルダに配置 ---
const VIDEO_DIR = path.join(ROOT, "video");
fs.mkdirSync(VIDEO_DIR, { recursive: true });
const tmpDir = path.join("/tmp", `deepdive-artifact-${Date.now()}`);
console.log("--- 動画をダウンロード中 ---");
execSync(`gh run download ${runId} --dir "${tmpDir}"`, { cwd: ROOT, stdio: "inherit" });

// ダウンロードしたフォルダの中から、該当スポットのmp4を探してvideoフォルダにコピー
function findMp4(dir, targetName) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findMp4(full, targetName);
      if (found) return found;
    } else if (entry.name === targetName) {
      return full;
    }
  }
  return null;
}
const targetFile = `${spot.kebabName}.mp4`;
const found = findMp4(tmpDir, targetFile);
if (found) {
  fs.copyFileSync(found, path.join(VIDEO_DIR, targetFile));
  console.log(`✓ ${targetFile} を video/ フォルダに配置しました`);
} else {
  console.error(`✗ ダウンロードした中に ${targetFile} が見つかりませんでした。${tmpDir} を確認してください。`);
}

console.log(`=== ${spot.shortId} の自動パイプライン完了(video/${targetFile}) ===`);
