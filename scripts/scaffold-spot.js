/**
 * NotionのDeep Diveデータベースから、スポットのファイル一式を自動生成するスクリプト。
 *
 * 使い方:
 *   export NOTION_API_KEY="secret_..."
 *   node scripts/scaffold-spot.js <スポット漢字名>  例: node scripts/scaffold-spot.js 宝泉院
 *
 * やること:
 *   1. Notion DBから「名前」列(漢字)が一致するページを探す
 *   2. Notionの「スラッグ」列(ローマ字、例: hosenin)を取得してファイル名・フォルダ名のベースにする
 *   3. プロパティを読む(下記【Notion側の必須列】参照)
 *   4. src/spots/<番号>-<スラッグ>.ts を生成
 *   5. scripts/generate-narration-<スラッグ>.js を生成
 *   6. scripts/measure-narration-<スラッグ>.js を生成
 *   7. src/Root.tsx にコンポジション登録を追記
 *
 * 【Notion側の必須列】
 *   スラッグ        : ローマ字のスポットID(例: hosenin)。ファイル名・フォルダ名・Composition IDに使用。
 *   accentColor    : アクセントカラー(例: #4a6d7a)
 *   kanjiMotif     : 漢字モチーフ1文字(例: 船)
 *   location       : 表示用ロケーション(例: Kyoto, Japan)
 *   mapRegionLabel : マップ上部ラベル(例: KYOTO, JAPAN)
 *   prefectureId   : 都道府県コード2桁(例: 26)
 *   municipalityId : 市区町村コード5桁(例: 26463)
 *   twistHeading   : ツイストシーンの見出し(例: A Garage That Became a Home)
 *
 * 【Notion側の列構成】
 *   フック(英語2文・120字以内)          : フックテキスト
 *   Fact1内容(英語2文・150字以内)        : Fact1本文
 *   Fact1漢字                           : Fact1漢字1文字
 *   Fact2内容(英語2文・150字以内)        : Fact2本文
 *   Fact2漢字                           : Fact2漢字1文字
 *   Fact3内容(英語2文・150字以内)        : Fact3本文
 *   Fact3漢字                           : Fact3漢字1文字
 *   どんでん返し                         : ツイストbodyテキスト全体
 *   キャッチコピー                        : 1文
 *   祭神名                              : 縦書きで出す文字列(Fact1のverticalTextに使う)
 *   字幕_キャッチコピー                   : jaSubtitles.catchCopy
 *   字幕_フック(18字/行・4行まで)         : jaSubtitles.hook
 *   字幕_Fact1(18字/行・4行まで)         : jaSubtitles.facts[0]
 *   字幕_Fact2(18字/行・4行まで)         : jaSubtitles.facts[1]
 *   字幕_Fact3(18字/行・4行まで)         : jaSubtitles.facts[2]
 *   字幕_どんでん返し(日本語18字/行・最大4行): jaSubtitles.twist
 *
 * 【spotName自動生成ルール】(スラッグ + 名前(漢字)末尾で判定)
 *   nameJa末尾が "神社" → cap(slug) + " Shrine"  例: itsukushima → "Itsukushima Shrine"
 *   nameJa末尾が "院" かつ slug末尾が "in" → cap(slug[:-2]) + "-in"  例: hosenin → "Hosen-in"
 *   nameJa末尾が "寺" かつ slug末尾が "ji" → cap(slug[:-2]) + "-ji"  例: katsuoji → "Katsuo-ji"
 *   nameJa末尾が "寺" かつ slug末尾が "dera" → cap(slug[:-4]) + "-dera"
 *   それ以外 → cap(slug)  例: ine → "Ine"
 *
 * 【テーマ回(地域に紐づかない回)を追加する場合】
 *   000_shinto-vs-buddhism がこのテンプレートの雛形。
 *   このスクリプトは現状 mapType を自動設定しないため、生成後に以下を手動修正すること。
 *
 *   Notionへの入力:
 *     地図タイプ列    : "national-watermark" と記入する
 *     prefectureId   : 空欄でよい
 *     municipalityId : 空欄でよい
 *     location       : "Japan" など国全体を指す値
 *     mapRegionLabel : "JAPAN"
 *
 *   scaffold実行後の手動修正(src/spots/<番号>-<スラッグ>.ts):
 *     1. defaultProps に  mapType: "national-watermark" as const  を追加
 *     2. prefectureId / municipalityId の行を削除
 *
 *   ナレーション台本(scripts/generate-narration-<スラッグ>.js):
 *     title.mp3 / map.mp3 の text はテーマ名で書く(地名読み上げではない)。
 *     短い固有名詞はOpenAI TTSの発音が崩れやすいため、
 *     ハイフン表記より「スペース区切り + 地域名付き」形式が安定する。
 *     例: "Shinto vs. Buddhism, Japan."
 */

const fs = require("fs");
const path = require("path");
const { Client } = require("@notionhq/client");

const nameArg = process.argv[2];
if (!nameArg) {
  console.error("使い方: node scripts/scaffold-spot.js <スポット漢字名>  例: node scripts/scaffold-spot.js 宝泉院");
  process.exit(1);
}

if (!process.env.NOTION_API_KEY) {
  console.error("NOTION_API_KEY が設定されてません。Notion Integrationを作成し、DBをシェアしてから実行してください。");
  process.exit(1);
}

const DATA_SOURCE_ID = "3aa478e5-04f6-801d-91a9-000b2c107edf";
const notion = new Client({ auth: process.env.NOTION_API_KEY });

function slugToSpotName(slug, nameJa) {
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  if (nameJa.endsWith("神社")) return cap(slug) + " Shrine";
  if (nameJa.endsWith("院") && slug.endsWith("in")) return cap(slug.slice(0, -2)) + "-in";
  if (nameJa.endsWith("寺") && slug.endsWith("ji")) return cap(slug.slice(0, -2)) + "-ji";
  if (nameJa.endsWith("寺") && slug.endsWith("dera")) return cap(slug.slice(0, -4)) + "-dera";
  return cap(slug);
}

function buildFacts(fact1Text, fact1Kanji, fact1Heading, fact2Text, fact2Kanji, fact2Heading, fact3Text, fact3Kanji, fact3Heading) {
  const facts = [];
  if (fact1Text) facts.push({ type: "photo-stat", kanji: fact1Kanji || "?", heading: fact1Heading || "", body: fact1Text });
  if (fact2Text) facts.push({ type: "photo-stat", kanji: fact2Kanji || "?", heading: fact2Heading || "", body: fact2Text });
  if (fact3Text) facts.push({ type: "photo-stat", kanji: fact3Kanji || "?", heading: fact3Heading || "", body: fact3Text });
  return facts;
}

function tsLiteral(value) {
  return JSON.stringify(value);
}

async function main() {
  const res = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    filter: { property: "名前", rich_text: { contains: nameArg } },
  });
  const page = res.results[0];
  if (!page) {
    console.error(`Notionに「${nameArg}」に一致するページが見つかりませんでした。`);
    process.exit(1);
  }
  const p = page.properties;
  const get = (name, kind) => {
    const prop = p[name];
    if (!prop) return "";
    if (kind === "title") return prop.title?.map((t) => t.plain_text).join("") || "";
    if (kind === "number") return prop.number ?? "";
    if (kind === "select") return prop.select?.name || "";
    return prop.rich_text?.map((t) => t.plain_text).join("") || "";
  };

  const slug = get("スラッグ");
  if (!slug) {
    console.error(`Notionの「スラッグ」列が空です。「${nameArg}」のページにローマ字スラッグ(例: hosenin)を設定してください。`);
    process.exit(1);
  }

  const number = get("番号", "number") || "?";
  const paddedNumber = String(number).padStart(3, "0");
  const nameJa = get("名前", "title");
  const hook = get("フック(英語2文・120字以内)");
  const twist = get("どんでん返し");
  const catchCopy = get("キャッチコピー");
  const verticalText = get("祭神名");
  const accentColor = get("accentColor");
  const kanjiMotif = get("kanjiMotif");
  const location = get("location");
  const mapRegionLabel = get("mapRegionLabel");
  const prefectureId = get("prefectureId");
  const municipalityId = get("municipalityId");
  const twistHeading = get("どんでん返し見出し(英語・センテンスケース)") || get("twistHeading");
  const fact1Heading = get("Fact1見出し(英語・センテンスケース)");
  const fact2Heading = get("Fact2見出し(英語・センテンスケース)");
  const fact3Heading = get("Fact3見出し(英語・センテンスケース)");
  const fact1Text = get("Fact1内容(英語2文・150字以内)");
  const fact1Kanji = get("Fact1漢字");
  const fact2Text = get("Fact2内容(英語2文・150字以内)");
  const fact2Kanji = get("Fact2漢字");
  const fact3Text = get("Fact3内容(英語2文・150字以内)");
  const fact3Kanji = get("Fact3漢字");
  const ja_catchCopy = get("字幕_キャッチコピー");
  const ja_hook = get("字幕_フック(18字/行・4行まで)");
  const ja_fact1 = get("字幕_Fact1(18字/行・4行まで)");
  const ja_fact2 = get("字幕_Fact2(18字/行・4行まで)");
  const ja_fact3 = get("字幕_Fact3(18字/行・4行まで)");
  const ja_twist = get("字幕_どんでん返し(日本語18字/行・最大4行)");
  const facts = buildFacts(fact1Text, fact1Kanji, fact1Heading, fact2Text, fact2Kanji, fact2Heading, fact3Text, fact3Kanji, fact3Heading);

  const spotName = slugToSpotName(slug, nameJa);
  const locationCity = location.split(",")[0].trim() || nameJa;

  const AUDIO_DIR = `audio/${paddedNumber}_${slug}`;
  const PHOTO_DIR = `photos/${paddedNumber}_${slug}`;

  // Fact1のphoto-stat(最初に見つかったもの)にverticalTextを付与
  const firstPhotoFact = facts.find((f) => f.type === "photo-stat");
  if (firstPhotoFact && verticalText) firstPhotoFact.verticalText = verticalText;

  // 空で残ったNotionフィールドの警告リスト
  const missing = [];
  if (!accentColor) missing.push("accentColor");
  if (!kanjiMotif) missing.push("kanjiMotif");
  if (!location) missing.push("location");
  if (!mapRegionLabel) missing.push("mapRegionLabel");
  if (!prefectureId) missing.push("prefectureId");
  if (!municipalityId) missing.push("municipalityId");
  if (!twistHeading) missing.push("twistHeading");
  if (!fact1Text) missing.push("Fact1内容(英語2文・150字以内)");
  if (!fact2Text) missing.push("Fact2内容(英語2文・150字以内)");
  if (!fact3Text) missing.push("Fact3内容(英語2文・150字以内)");

  let factCounter = 0;
  const factsTs = facts
    .map((f) => {
      factCounter += 1;
      if (f.type === "big-number") {
        return `  {
    type: "big-number",
    kanji: ${tsLiteral(f.kanji)},
    value: ${tsLiteral(f.value)},
    label: ${tsLiteral(f.label)},
    narrationSrc: \`\${AUDIO_DIR}/fact-${factCounter}.mp3\`,
    durationSeconds: 10.0, // 仮値。measure-narration実行後に実測値へ差し替え
  }`;
      }
      return `  {
    type: "photo-stat",
    kanji: ${tsLiteral(f.kanji)},
    heading: ${tsLiteral(f.heading)},
    body: ${tsLiteral(f.body)},
    photoSrc: "${PHOTO_DIR}/fact-${factCounter}.png",
    photoSfx: "bgm/camera.mp3",${f.verticalText ? `\n    verticalText: ${tsLiteral(f.verticalText)},` : ""}
    narrationSrc: \`\${AUDIO_DIR}/fact-${factCounter}.mp3\`,
    durationSeconds: 11.0, // 仮値。measure-narration実行後に実測値へ差し替え
  }`;
    })
    .join(",\n");

  const jaSubtitlesTs = (ja_catchCopy || ja_hook || ja_fact1 || ja_fact2 || ja_fact3 || ja_twist) ? `
  jaSubtitles: {
    catchCopy: ${tsLiteral(ja_catchCopy)},
    hook: ${tsLiteral(ja_hook)},
    facts: [
      ${tsLiteral(ja_fact1)},
      ${tsLiteral(ja_fact2)},
      ${tsLiteral(ja_fact3)},
    ],
    twist: ${tsLiteral(ja_twist)},
  },` : "";

  const tsContent = `import { FactInput } from "../DeepDive";

const HERO_PHOTO = "${PHOTO_DIR}/hero.png";
const AUDIO_DIR = "${AUDIO_DIR}";

// ※秒数は暫定値。ナレーション生成後にmeasure-narration-${slug}.jsで実測し、正確な値に差し替えること
export const sceneDurations = {
  title: 3.2,
  map: 4.5,
  hook: 7.0,
  twist: 18.0,
  outro: 4.5,
};

export const facts: FactInput[] = [
${factsTs}
];

export const defaultProps = {
  spotName: ${tsLiteral(spotName)},
  spotNameJa: ${tsLiteral(nameJa)},
  location: ${tsLiteral(location)},
  accentColor: ${tsLiteral(accentColor)},
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: ${tsLiteral(kanjiMotif)},
  mapRegionLabel: ${tsLiteral(mapRegionLabel)},
  prefectureId: ${tsLiteral(prefectureId)},
  municipalityId: ${tsLiteral(municipalityId)},
  hookText: ${tsLiteral(hook)},
  facts,
  twistHeading: ${tsLiteral(twistHeading)},
  twistBody: ${tsLiteral(twist)},
  narration: {
    title: \`\${AUDIO_DIR}/title.mp3\`,
    map: \`\${AUDIO_DIR}/map.mp3\`,
    hook: \`\${AUDIO_DIR}/hook.mp3\`,
    twist: \`\${AUDIO_DIR}/twist.mp3\`,
    outro: \`\${AUDIO_DIR}/outro.mp3\`,
  },
  sceneDurations,
  bgmSrc: "bgm/bgm002.wav",
  bgmVolume: 0.12,
  introSfx: "bgm/light_intro.mp3",
  catchCopy: ${tsLiteral(catchCopy)},
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: ${number},${jaSubtitlesTs}
};
`;

  const tsPath = path.join(__dirname, "..", "src", "spots", `${paddedNumber}-${slug}.ts`);
  fs.writeFileSync(tsPath, tsContent);
  console.log(`✅ 作成: ${tsPath}`);

  const narrationLines = [
    { file: "title.mp3", text: `${spotName}, ${locationCity}.` },
    { file: "map.mp3", text: `${spotName}.` },
    { file: "hook.mp3", text: hook },
    ...facts.map((f, i) => ({
      file: `fact-${i + 1}.mp3`,
      text: f.type === "big-number" ? f.label : f.body,
    })),
    { file: "twist.mp3", text: twist },
    { file: "outro.mp3", text: "Worth the visit? Absolutely." },
  ];

  const narrationJs = `const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "${paddedNumber}_${slug}");

const LINES = ${JSON.stringify(narrationLines, null, 2)};

generateAll(OUTPUT_DIR, LINES);
`;
  const narrationPath = path.join(__dirname, `generate-narration-${slug}.js`);
  fs.writeFileSync(narrationPath, narrationJs);
  console.log(`✅ 作成: ${narrationPath}`);

  const measureJs = `const path = require("path");
const fs = require("fs");
const getMP3Duration = require("get-mp3-duration");

const AUDIO_DIR = path.join(__dirname, "..", "public", "audio", "${paddedNumber}_${slug}");

const FILES = ${JSON.stringify(narrationLines.map((l) => ({ key: l.file.replace(".mp3", ""), file: l.file })), null, 2)};

console.log("--- 各ナレーションの長さ ---");
const results = {};
for (const { key, file } of FILES) {
  const filePath = path.join(AUDIO_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.log(\`\${file}: ファイルが見つかりません\`);
    continue;
  }
  const buffer = fs.readFileSync(filePath);
  const seconds = Math.round((getMP3Duration(buffer) / 1000) * 10) / 10;
  results[key] = seconds;
  console.log(\`\${file}: \${seconds}秒\`);
}
console.log("\\n--- この結果をそのままClaudeに貼り付けてください ---");
console.log(JSON.stringify(results, null, 2));
`;
  const measurePath = path.join(__dirname, `measure-narration-${slug}.js`);
  fs.writeFileSync(measurePath, measureJs);
  console.log(`✅ 作成: ${measurePath}`);

  // Root.tsxへの自動追記
  const rootPath = path.join(__dirname, "..", "src", "Root.tsx");
  let root = fs.readFileSync(rootPath, "utf-8");
  const importLine = `import * as ${slug} from "./spots/${paddedNumber}-${slug}";`;
  if (!root.includes(importLine)) {
    root = root.replace(/(import \* as \w+ from ".\/spots\/[^"]+";\n)(?!import \* as \w+ from)/, `$1${importLine}\n`);
    const compositionBlock = `      <Composition
        id="DeepDive-${slug[0].toUpperCase()}${slug.slice(1)}"
        component={DeepDive}
        durationInFrames={getTotalDuration(${slug}.facts, ${slug}.sceneDurations, ${slug}.defaultProps)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={${slug}.defaultProps}
      />
    </>
  );
};`;
    root = root.replace(/(\s*)<\/>\s*\);\s*};\s*$/, `${compositionBlock}`);
    fs.writeFileSync(rootPath, root);
    console.log(`✅ 更新: ${rootPath}(要目視確認 — importとCompositionの位置がズレてないか)`);
  }

  if (missing.length > 0) {
    console.log(`\n⚠️ 以下のNotionフィールドが空です。Notionに値を入力してから再実行するか、手動でファイルを修正してください:`);
    missing.forEach((f) => console.log(`  - ${f}`));
  } else {
    console.log("\n✅ Notionの全フィールドが反映されました。durationSecondsのみmeasure-narration実行後に実測値へ差し替えてください。");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
