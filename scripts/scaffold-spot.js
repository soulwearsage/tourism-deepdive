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
 *   3. プロパティ(フック/Fact内容/どんでん返し/キャッチコピー/系統/祭神名/番号 等)を読む
 *   4. src/spots/<番号>-<スラッグ>.ts を生成
 *   5. scripts/generate-narration-<スラッグ>.js を生成
 *   6. scripts/measure-narration-<スラッグ>.js を生成
 *   7. src/Root.tsx にコンポジション登録を追記
 *
 * 【Notion側の必須列】
 *   スラッグ: ローマ字のスポットID(例: hosenin)。ファイル名・フォルダ名・Composition IDに使用。
 *
 * 【Notion側の記法ルール】(この形式で書かれている前提でパースする)
 *   フック: 1文
 *   Fact内容: "Fact1(kanji=秘,photo): heading文 || body文 / Fact2(kanji=縁,big=3,unit=体): label文 / Fact3(kanji=闇,photo): heading文 || body文"
 *     - big-numberにしたいFactは (big=数値,unit=単位) を付ける。それ以外はphoto-stat扱い。
 *     - photo-statは "heading || body" の2段。big-numberは label のみ。
 *   どんでん返し: heading行が無い場合は1文全体をbodyとし、headingは「N」等の空文字扱い→要手動調整
 *   キャッチコピー: 1文
 *   祭神名: 縦書きで出す文字列(Fact1のverticalTextに使う)
 *   系統: "ライト" or "ダーク"(accentColor/BGMの目安表示のみ。実際の値は手動調整推奨)
 *   写真プロンプト欄はコード化しない(参考メモのまま)。photoSrcは慣例に沿い
 *     hero.png / fact-1.png / fact-3.png のように、写真プロンプト欄の記載順で仮当てするので
 *     生成後に必ず目視で確認すること。
 *
 * 【重要】これは「叩き台」を作るスクリプトです。特に以下は生成後に必ず人の目で確認・調整してください:
 *   - 各Factの type(photo-stat / big-number)の妥当性
 *   - accentColor・kanjiMotif・prefectureId/municipalityId(自動推測できないため要手動入力)
 *   - durationSeconds(仮値。measure-narration実行後に実測値へ差し替え)
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

function parseFacts(factText) {
  // "Fact1(kanji=秘,photo): heading || body / Fact2(kanji=縁,big=3,unit=体): label / ..."
  const chunks = factText.split(/\s*\/\s*Fact\d+/).map((c, i) => (i === 0 ? c.replace(/^Fact\d+/, "") : c));
  return chunks
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const metaMatch = chunk.match(/^\(([^)]*)\):\s*(.*)$/s);
      if (!metaMatch) {
        console.warn("⚠️ Factのパースに失敗、要手動修正:", chunk.slice(0, 40));
        return { type: "photo-stat", kanji: "?", heading: "TODO", body: chunk, photoSrc: "TODO.png" };
      }
      const meta = Object.fromEntries(
        metaMatch[1].split(",").map((kv) => {
          const [k, v] = kv.split("=");
          return [k.trim(), v === undefined ? true : v.trim()];
        })
      );
      const rest = metaMatch[2].trim();
      if (meta.big) {
        return {
          type: "big-number",
          kanji: meta.kanji || "?",
          value: meta.big,
          label: rest,
        };
      }
      const [heading, body] = rest.split("||").map((s) => s.trim());
      return {
        type: "photo-stat",
        kanji: meta.kanji || "?",
        heading: heading || rest,
        body: body || "TODO",
        photoSrc: "TODO.png",
      };
    });
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
  const hook = get("フック");
  const twist = get("どんでん返し");
  const catchCopy = get("キャッチコピー");
  const verticalText = get("祭神名");
  const facts = parseFacts(get("Fact内容"));

  const AUDIO_DIR = `audio/${paddedNumber}_${slug}`;
  const PHOTO_DIR = `photos/${paddedNumber}_${slug}`;

  // Fact1にverticalTextを付与(慣例通り)
  const firstPhotoFact = facts.find((f) => f.type === "photo-stat");
  if (firstPhotoFact) firstPhotoFact.verticalText = verticalText;

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
    photoSrc: "${PHOTO_DIR}/${f.photoSrc === "TODO.png" ? `fact-${factCounter}.png" /* TODO: 実ファイル名を確認 */` : f.photoSrc + '"'},
    photoSfx: "bgm/camera.mp3",${f.verticalText ? `\n    verticalText: ${tsLiteral(f.verticalText)},` : ""}
    narrationSrc: \`\${AUDIO_DIR}/fact-${factCounter}.mp3\`,
    durationSeconds: 11.0, // 仮値。measure-narration実行後に実測値へ差し替え
  }`;
    })
    .join(",\n");

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
  spotName: "TODO_ローマ字表記",
  spotNameJa: ${tsLiteral(nameJa)},
  location: "TODO, Japan",
  accentColor: "#TODO", // TODO: 系統(${get("系統", "select")})に合わせて手動設定
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "TODO",
  mapRegionLabel: "TODO",
  prefectureId: "TODO",
  municipalityId: "TODO",
  hookText: ${tsLiteral(hook)},
  facts,
  twistHeading: "TODO_短い見出し",
  twistBody: ${tsLiteral(twist)},
  narration: {
    title: \`\${AUDIO_DIR}/title.mp3\`,
    map: \`\${AUDIO_DIR}/map.mp3\`,
    hook: \`\${AUDIO_DIR}/hook.mp3\`,
    twist: \`\${AUDIO_DIR}/twist.mp3\`,
    outro: \`\${AUDIO_DIR}/outro.mp3\`,
  },
  sceneDurations,
  bgmSrc: "bgm/bgm002.wav", // TODO: 系統に応じて確認
  bgmVolume: 0.12,
  introSfx: "bgm/light_intro.mp3", // TODO: 系統に応じて確認
  catchCopy: ${tsLiteral(catchCopy)},
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: ${number},
};
`;

  const tsPath = path.join(__dirname, "..", "src", "spots", `${paddedNumber}-${slug}.ts`);
  fs.writeFileSync(tsPath, tsContent);
  console.log(`✅ 作成: ${tsPath}`);

  const narrationLines = [
    { file: "title.mp3", text: `${nameJa}, TODO地名.` },
    { file: "map.mp3", text: `${nameJa}.` },
    { file: "hook.mp3", text: hook },
    ...facts.map((f, i) => ({
      file: `fact-${i + 1}.mp3`,
      text: f.type === "big-number" ? f.label : `${f.heading} ${f.body}`,
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

  console.log("\n⚠️ 生成後に必ず確認・修正してください:");
  console.log("- accentColor / kanjiMotif / prefectureId / municipalityId / spotName / location / mapRegionLabel / twistHeading");
  console.log("- 各Factのphoto-src(実際のファイル名と一致してるか)");
  console.log("- durationSecondsはmeasure-narration実行後に実測値へ差し替え");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
