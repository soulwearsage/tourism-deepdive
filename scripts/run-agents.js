/**
 * エージェントブリーフィングを標準出力に出力する。
 *
 * このスクリプト自体はAI推論を行わない。
 * Claude Codeがこのスクリプトをbashで実行し、出力を読んで
 * 各エージェントとして順番に動き、Notionに書き込む。
 *
 * 使い方:
 *   export NOTION_API_KEY="secret_..."
 *   node scripts/run-agents.js <スポット漢字名>
 *
 * Claude Codeへの指示:
 *   1. この出力を読む
 *   2. [SPOT DATA] を入力として ① Story Agent の指示通りに動く → JSON生成
 *   3. ①の出力を入力として ② Scene Director の指示通りに動く → JSON生成
 *   4. ①②の出力を入力として ③ Visual Agent の指示通りに動く → JSON生成
 *   5. ①②③の出力を入力として ④ Render Agent の指示通りに動く → JSON生成
 *   6. ①②③④の出力を入力として ⑤ Growth Agent の指示通りに動く → JSON生成
 *   7. 各JSONを [NOTION PAGE ID] のページに対応する列名で書き込む
 */

const fs   = require("fs");
const path = require("path");
const { Client } = require("@notionhq/client");

const nameArg = process.argv[2];
if (!nameArg) {
  console.error("使い方: node scripts/run-agents.js <スポット漢字名>  例: node scripts/run-agents.js 山伏・修験道");
  process.exit(1);
}
if (!process.env.NOTION_API_KEY) {
  console.error("NOTION_API_KEY が設定されていません。");
  process.exit(1);
}

const DATA_SOURCE_ID = "3aa478e5-04f6-801d-91a9-000b2c107edf";
const AGENTS_DIR     = path.join(__dirname, "../agents");
const notion         = new Client({ auth: process.env.NOTION_API_KEY });

function readAgent(filename) {
  const filepath = path.join(AGENTS_DIR, filename);
  if (!fs.existsSync(filepath)) return `(ファイルなし: ${filename})`;
  return fs.readFileSync(filepath, "utf8").trim();
}

async function main() {
  // ── Notion ページ取得 ───────────────────────────────────
  const res = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    filter: { property: "名前", rich_text: { contains: nameArg } },
  });
  const page = res.results[0];
  if (!page) {
    console.error(`「${nameArg}」に一致するNotionページが見つかりませんでした。`);
    process.exit(1);
  }

  const pageId = page.id;
  const p      = page.properties;
  const get    = (name, kind) => {
    const prop = p[name];
    if (!prop) return "";
    if (kind === "title")  return prop.title?.map((t) => t.plain_text).join("") || "";
    if (kind === "number") return prop.number ?? "";
    if (kind === "select") return prop.select?.name || "";
    return prop.rich_text?.map((t) => t.plain_text).join("") || "";
  };

  const spotData = {
    名前:          get("名前", "title"),
    番号:          get("番号", "number"),
    スラッグ:      get("スラッグ"),
    系統:          get("系統", "select"),
    カテゴリ:      get("カテゴリ"),
    地図タイプ:    get("地図タイプ"),
    location:      get("location"),
    mapRegionLabel: get("mapRegionLabel"),
    prefectureId:  get("prefectureId"),
    municipalityId: get("municipalityId"),
    祭神名:        get("祭神名"),
    accentColor:   get("accentColor"),
    kanjiMotif:    get("kanjiMotif"),
    タイトルナレーション: get("タイトルナレーション"),
    キャッチコピー: get("キャッチコピー"),
    "フック(英語2文・120字以内)":        get("フック(英語2文・120字以内)"),
    "Fact1見出し(英語・センテンスケース)": get("Fact1見出し(英語・センテンスケース)"),
    "Fact1内容(英語2文・150字以内)":     get("Fact1内容(英語2文・150字以内)"),
    "Fact1漢字":   get("Fact1漢字"),
    "Fact2見出し(英語・センテンスケース)": get("Fact2見出し(英語・センテンスケース)"),
    "Fact2内容(英語2文・150字以内)":     get("Fact2内容(英語2文・150字以内)"),
    "Fact2漢字":   get("Fact2漢字"),
    "Fact3見出し(英語・センテンスケース)": get("Fact3見出し(英語・センテンスケース)"),
    "Fact3内容(英語2文・150字以内)":     get("Fact3内容(英語2文・150字以内)"),
    "Fact3漢字":   get("Fact3漢字"),
    twistHeading:  get("twistHeading"),
    "どんでん返し見出し(英語・センテンスケース)": get("どんでん返し見出し(英語・センテンスケース)"),
    どんでん返し:  get("どんでん返し"),
    どんでん漢字:  get("どんでん漢字"),
    "字幕_キャッチコピー":               get("字幕_キャッチコピー"),
    "字幕_フック(18字/行・4行まで)":     get("字幕_フック(18字/行・4行まで)"),
    "字幕_Fact1(18字/行・4行まで)":      get("字幕_Fact1(18字/行・4行まで)"),
    "字幕_Fact2(18字/行・4行まで)":      get("字幕_Fact2(18字/行・4行まで)"),
    "字幕_Fact3(18字/行・4行まで)":      get("字幕_Fact3(18字/行・4行まで)"),
    "字幕_どんでん返し(日本語18字/行・最大4行)": get("字幕_どんでん返し(日本語18字/行・最大4行)"),
  };

  // ── エージェントファイルを読む ─────────────────────────
  const agents = {
    "01": readAgent("01-story-agent.md"),
    "02": readAgent("02-scene-director.md"),
    "03": readAgent("03-visual-agent.md"),
    "04": readAgent("04-render-agent.md"),
    "05": readAgent("05-growth-agent.md"),
  };

  // ── 出力 ───────────────────────────────────────────────
  console.log("================================================================");
  console.log("CLAUDE CODE AGENT BRIEFING");
  console.log("================================================================");
  console.log("");
  console.log("[INSTRUCTIONS FOR CLAUDE CODE]");
  console.log("以下を読み、各エージェントの指示通りに順番に動いてください。");
  console.log("① Story Agent → ② Scene Director → ③ Visual Agent → ④ Render Agent → ⑤ Growth Agent");
  console.log("各エージェントの出力JSONは次のエージェントの入力として使用します。");
  console.log("全エージェントの実行後、各JSONを [NOTION PAGE ID] のページに書き込んでください。");
  console.log("Notionへの書き込みには notion-update-page ツールを使います。");
  console.log("");
  console.log("================================================================");
  console.log("[NOTION PAGE ID]");
  console.log("================================================================");
  console.log(pageId);
  console.log("");
  console.log("================================================================");
  console.log("[SPOT DATA] — エージェントへの入力");
  console.log("================================================================");
  console.log(JSON.stringify(spotData, null, 2));
  console.log("");

  for (const [num, content] of Object.entries(agents)) {
    const labels = {
      "01": "① Story Agent",
      "02": "② Scene Director",
      "03": "③ Visual Agent",
      "04": "④ Render Agent",
      "05": "⑤ Growth Agent",
    };
    console.log("================================================================");
    console.log(`[AGENT ${num}] ${labels[num]}`);
    console.log("================================================================");
    console.log(content);
    console.log("");
  }

  console.log("================================================================");
  console.log("[NOTION PROPERTY MAP] — 書き込む列名の対応表");
  console.log("================================================================");
  console.log(JSON.stringify({
    "Story Agent → Notion": [
      "スラッグ", "カテゴリ", "地図タイプ", "location", "mapRegionLabel",
      "prefectureId", "municipalityId", "祭神名", "タイトルナレーション",
      "キャッチコピー", "フック(英語2文・120字以内)",
      "Fact1見出し(英語・センテンスケース)", "Fact1内容(英語2文・150字以内)",
      "Fact2見出し(英語・センテンスケース)", "Fact2内容(英語2文・150字以内)",
      "Fact3見出し(英語・センテンスケース)", "Fact3内容(英語2文・150字以内)",
      "twistHeading", "どんでん返し見出し(英語・センテンスケース)", "どんでん返し",
    ],
    "Scene Director → Notion": [
      "Fact1漢字", "Fact2漢字", "Fact3漢字", "どんでん漢字", "フック背景漢字",
    ],
    "Visual Agent → Notion": [
      "accentColor", "写真プロンプト", "Fact3写真",
    ],
    "Render Agent → Notion": [
      "字幕_キャッチコピー", "字幕_フック(18字/行・4行まで)",
      "字幕_Fact1(18字/行・4行まで)", "字幕_Fact2(18字/行・4行まで)",
      "字幕_Fact3(18字/行・4行まで)", "字幕_どんでん返し(日本語18字/行・最大4行)",
    ],
  }, null, 2));
  console.log("");
  console.log("================================================================");
  console.log("END OF BRIEFING — Claude Code: 上記に従って各エージェントとして動いてください");
  console.log("================================================================");
}

main().catch((e) => {
  console.error("エラー:", e.message);
  process.exit(1);
});
