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
 *   --force  既存ファイルも上書き再ダウンロードする
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
  const slug = args.find((a) => !a.startsWith("--"));

  if (!slug) {
    console.error("使い方: node scripts/download-photos.js <スラッグ> [--force]");
    console.error("例: node scripts/download-photos.js takaya");
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

  // --- Notionからカテゴリを取得 ---
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
  const category = CATEGORY_MAP[categoryCode];
  if (!category) {
    console.error(`\n✗ カテゴリ値 "${categoryCode}" を変換できません。Notionの「カテゴリ」列に PL/CU/HI/MY を設定してください。`);
    process.exit(1);
  }
  console.log(`${categoryCode} → ${category}`);

  // --- Google Drive認証 ---
  const auth = await getAuthClient();
  const drive = google.drive({ version: "v3", auth });

  // --- スポットフォルダを探す ---
  const drivePath = ["Image_picker", "image", category, folderName];
  process.stdout.write(`Google Driveを走査中: ${drivePath.join("/")} ... `);
  const spotFolderId = await findFolderByPath(drive, drivePath);
  if (!spotFolderId) {
    console.error(`\n✗ フォルダが見つかりません: ${drivePath.join("/")}`);
    process.exit(1);
  }
  console.log("✓");

  // --- カットフォルダ一覧(名前昇順) ---
  const cutFolders = await listSubfolders(drive, spotFolderId);
  if (cutFolders.length === 0) {
    console.error(`✗ ${folderName}/ 配下にカットフォルダが見つかりません。`);
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
