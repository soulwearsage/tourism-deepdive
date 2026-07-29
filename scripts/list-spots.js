/**
 * src/spots/ 配下の連番ファイル(例: 001-fushimi-inari.ts)を読み取って、
 * 各スポットの「短い名前」「Remotionのコンポジション名」「書き出しファイル名」を
 * 自動で一覧にするスクリプト。GitHub Actions側から呼び出して使う。
 *
 * 使い方:
 *   node scripts/list-spots.js           → 全スポットの一覧をJSONで出力
 *   node scripts/list-spots.js --latest  → 一番番号が新しいスポットの短い名前だけを出力
 */
const fs = require("fs");
const path = require("path");

const SPOTS_DIR = path.join(__dirname, "..", "src", "spots");

function toPascalCase(kebab) {
  return kebab
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function listSpots() {
  const files = fs.readdirSync(SPOTS_DIR).filter((f) => /^\d+-.+\.ts$/.test(f));
  const spots = files
    .map((file) => {
      const match = file.match(/^(\d+)-(.+)\.ts$/);
      const number = parseInt(match[1], 10);
      const kebabName = match[2]; // 例: "fushimi-inari"
      const shortId = kebabName; // render.ymlのspot選択肢用。例: "fushimi-inari", "shinto-vs-buddhism"
      const compositionId = `DeepDive-${toPascalCase(kebabName)}`; // 例: "DeepDive-FushimiInari"
      return {
        number,
        shortId,
        compositionId,
        outputFile: `${kebabName}.mp4`,
      };
    })
    .sort((a, b) => a.number - b.number);
  return spots;
}

const spots = listSpots();

if (process.argv.includes("--latest")) {
  const latest = spots[spots.length - 1];
  console.log(latest.shortId);
} else {
  console.log(JSON.stringify(spots, null, 2));
}
