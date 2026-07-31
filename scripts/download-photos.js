/**
 * Google DriveからスポットのheroとFact写真をダウンロードして public/photos/<slug>/ に配置する。
 *
 * Drive上のフォルダ構造:
 *   Image_picker/image/<Category>/<番号_slug>/<カット名>/generated/
 *
 * カットフォルダは名前順(昇順)にソートし、順番に hero.png → fact-1.png → fact-2.png と割り当てる。
 * 各 generated/ フォルダから最初の画像ファイル(名前順)を1枚使用する。
 *
 * カテゴリ変換(Notion「カテゴリ」列の select 値):
 *   PL → Place / CU → Culture / HI → History / MY → Myth
 *
 * 使い方:
 *   export NOTION_API_KEY="secret_..."
 *   node scripts/download-photos.js <スラッグ>  例: node scripts/download-photos.js takaya
 *
 * オプション:
 *   --spot <slug>      スラッグを名前付き引数で指定(位置引数でも可)
 *   --category <name>  Notionのカテゴリ列を使わずカテゴリを直接指定(Place/Culture/History/Myth)
 *   --force            既存ファイルも上書き再ダウンロードする
 *   --dry-run          Driveを走査して取得予定ファイルを表示するだけ(ダウンロードしない)
 *   --auth-only        認証だけ行ってトークンを保存する(ダウンロードはしない)
 */

const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { Client: NotionClient } = require("@notionhq/client");
const { getAuthClient, findFolderByPath, listSubfolders, listImages, downloadFile } = require("./_gdrive-common");

const NOTION_DB_ID = "3aa478e5-04f6-801d-91a9-000b2c107edf";
const CATEGORY_MAP = { PL: "Place", CU: "Culture", HI: "History", MY: "Myth" };
const SLOT_NAMES = ["hero.png", "fact-1.png", "fact-2.png", "fact-3.png", "fact-4.png"];
const ROOT = path.join(__dirname, "..");

function findSpot(shortId) {
  const dir = path.join(ROOT, "src", "spots");
  for (const file of fs.readdirSync(dir)) {
    const m = file.match(/^(\d+)-(.+)\.ts$/);
    if (m && m[2] === shortId) return { number: m[1], kebabName: m[2] };
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const authOnly = args.includes("--auth-only");
  const dryRun = args.includes("--dry-run");
  // --spot <slug> または位置引数
  const spotIdx = args.indexOf("--spot");
  const slug = spotIdx !== -1 ? args[spotIdx + 1] : args.find((a) => !a.startsWith("--"));
  const categoryIdx = args.indexOf("--category");
  const categoryOverride = categoryIdx !== -1 ? args[categoryIdx + 1] : null;

  // 認証のみモード
  if (authOnly) {
    console.log("Google Drive認証を実行します...");
    const auth = await getAuthClient();
    const drive = google.drive({ version: "v3", auth });
    // about.get で接続確認
    const about = await drive.about.get({ fields: "user" });
    console.log(`✓ 認証成功: ${about.data.user.displayName} (${about.data.user.emailAddress})`);
    console.log("  以降は ~/.tourism-deepdive/gdrive-token.json が自動使用されます。");
    return;
  }

  if (!slug) {
    console.error("使い方: node scripts/download-photos.js <スラッグ> [--force] [--dry-run]");
    console.error("       node scripts/download-photos.js --spot <スラッグ> [--force] [--dry-run]");
    console.error("       node scripts/download-photos.js --auth-only");
    process.exit(1);
  }

  const spot = findSpot(slug);
  if (!spot) {
    console.error(`✗ "${slug}" が src/spots/ に見つかりません。`);
    process.exit(1);
  }

  const folderName = `${spot.number}_${slug}`;
  const photoDir = path.join(ROOT, "public", "photos", folderName);
  fs.mkdirSync(photoDir, { recursive: true });

  // --- カテゴリを取得(--category 指定 or Notionから) ---
  let category;
  if (categoryOverride) {
    category = categoryOverride;
    console.log(`カテゴリ: ${category} (--category で指定)`);
  } else {
    if (!process.env.NOTION_API_KEY) {
      console.error("✗ NOTION_API_KEY が設定されていません。");
      process.exit(1);
    }
    const notion = new NotionClient({ auth: process.env.NOTION_API_KEY });
    process.stdout.write(`Notionからカテゴリを取得中(${slug})... `);
    const notionRes = await notion.dataSources.query({
      data_source_id: NOTION_DB_ID,
      filter: { property: "スラッグ", rich_text: { equals: slug } },
    });
    const page = notionRes.results[0];
    if (!page) {
      console.error(`\n✗ Notionに slug="${slug}" のページが見つかりません。`);
      process.exit(1);
    }
    const categoryCode = page.properties["カテゴリ"]?.select?.name || "";
    category = CATEGORY_MAP[categoryCode];
    if (!category) {
      console.error(`\n✗ カテゴリ値 "${categoryCode}" を変換できません。Notionの「カテゴリ」列に PL/CU/HI/MY を設定するか、--category で直接指定してください。`);
      process.exit(1);
    }
    console.log(`${categoryCode} → ${category}`);
  }

  // --- Google Drive認証 ---
  const auth = await getAuthClient();
  const drive = google.drive({ version: "v3", auth });

  // --- スポットフォルダを探す(スラッグを含む名前で部分一致) ---
  process.stdout.write(`Google Driveを走査中: Image_picker/image/${category}/*${slug}* ... `);
  const categoryFolderId = await findFolderByPath(drive, ["Image_picker", "image", category]);
  if (!categoryFolderId) {
    console.error(`\n✗ カテゴリフォルダが見つかりません: Image_picker/image/${category}`);
    process.exit(1);
  }
  const categorySubfolders = await listSubfolders(drive, categoryFolderId);
  const spotFolder = categorySubfolders.find((f) => f.name.includes(slug));
  if (!spotFolder) {
    const names = categorySubfolders.map((f) => f.name).join(", ") || "(空)";
    console.error(`\n✗ "${slug}" を含むフォルダが見つかりません。\n  存在するフォルダ: ${names}`);
    process.exit(1);
  }
  const spotFolderId = spotFolder.id;
  console.log(`✓ (${spotFolder.name})`);

  // --- カットフォルダ一覧(名前昇順) ---
  const cutFolders = await listSubfolders(drive, spotFolderId);
  if (cutFolders.length === 0) {
    console.error(`✗ ${spotFolder.name}/ 配下にカットフォルダが見つかりません。`);
    process.exit(1);
  }
  console.log(`カットフォルダ ${cutFolders.length}件: ${cutFolders.map((f) => f.name).join(" / ")}`);

  // --- 各カットの generated/ から画像を1枚取得 ---
  const slots = [];
  for (const cut of cutFolders) {
    const generatedId = await findFolderByPath(drive, ["generated"], cut.id);
    if (!generatedId) {
      console.error(`✗ ${cut.name}/generated/ フォルダが見つかりません。`);
      process.exit(1);
    }
    const images = await listImages(drive, generatedId);
    if (images.length === 0) {
      console.error(`✗ ${cut.name}/generated/ に画像ファイルが存在しません。`);
      process.exit(1);
    }
    slots.push({ cutName: cut.name, file: images[0] }); // 名前順の先頭1枚
  }

  // --- ダウンロード (hero → fact-1 → fact-2 ...) ---
  if (dryRun) {
    console.log("\n[dry-run] 以下のファイルをダウンロードする予定です:");
    for (let i = 0; i < slots.length; i++) {
      const slotName = SLOT_NAMES[i] || `(スロット上限超過)`;
      const destPath = path.join(photoDir, slotName);
      const exists = fs.existsSync(destPath);
      console.log(`  ${slots[i].cutName}/${slots[i].file.name} → ${slotName}${exists ? " (既存のためスキップ)" : ""}`);
    }
    console.log("\n[dry-run] 実際のダウンロードは行いませんでした。");
    return;
  }

  let downloaded = 0;
  let skipped = 0;
  for (let i = 0; i < slots.length; i++) {
    const slotName = SLOT_NAMES[i];
    if (!slotName) {
      console.log(`  (スロット上限超過、スキップ): ${slots[i].cutName}`);
      continue;
    }
    const destPath = path.join(photoDir, slotName);
    if (!force && fs.existsSync(destPath)) {
      console.log(`  スキップ(既存): ${slotName}`);
      skipped++;
      continue;
    }
    process.stdout.write(`  ${slots[i].cutName} → ${slotName} ... `);
    await downloadFile(drive, slots[i].file.id, destPath);
    console.log("✓");
    downloaded++;
  }

  console.log(`\n✓ 完了: ダウンロード ${downloaded}件 / スキップ ${skipped}件`);
  console.log(`  配置先: ${photoDir}`);
}

main().catch((e) => {
  console.error("✗ エラー:", e.message || e);
  process.exit(1);
});
