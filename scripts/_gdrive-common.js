/**
 * Google Drive API 共通ヘルパー。
 *
 * 認証情報の置き場所:
 *   ~/.tourism-deepdive/gdrive-credentials.json  ← GCPコンソールからダウンロードしたOAuth2認証情報
 *   ~/.tourism-deepdive/gdrive-token.json         ← 初回認証後に自動生成されるトークン(自動更新)
 *
 * 認証方式: ローカルHTTPサーバー方式(Googleのループバックフロー推奨)
 *   ブラウザで認証 → localhost にリダイレクト → サーバーが自動でコードをキャプチャ
 *   コードの手動コピーは不要。
 */

const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const http = require("http");
const os = require("os");

const CONFIG_DIR = path.join(os.homedir(), ".tourism-deepdive");
const CREDENTIALS_PATH = path.join(CONFIG_DIR, "gdrive-credentials.json");
const TOKEN_PATH = path.join(CONFIG_DIR, "gdrive-token.json");
const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

async function getAuthClient() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error([
      `✗ GDrive認証情報が見つかりません: ${CREDENTIALS_PATH}`,
      "  GCPコンソール > APIとサービス > 認証情報 > OAuth 2.0クライアントID",
      "  (アプリの種類: デスクトップアプリ)で認証情報を作成しJSONをダウンロード後、",
      `  ${CREDENTIALS_PATH} に配置してください。`,
    ].join("\n"));
    process.exit(1);
  }

  const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const { client_id, client_secret } = creds.installed || creds.web;

  // 保存済みトークンがあれば使用(期限切れは自動リフレッシュ)
  if (fs.existsSync(TOKEN_PATH)) {
    const savedToken = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, "");
    oAuth2Client.setCredentials(savedToken);
    oAuth2Client.on("tokens", (newTokens) => {
      fs.writeFileSync(TOKEN_PATH, JSON.stringify({ ...savedToken, ...newTokens }));
    });
    return oAuth2Client;
  }

  // 初回認証: ローカルHTTPサーバーでリダイレクトを自動キャプチャ
  // ポート 0 → OS が空きポートを割り当て。registered redirect_uri が
  // "http://localhost" であれば Google は任意ポートを許可する。
  const { code, oAuth2Client } = await new Promise((resolve, reject) => {
    const server = http.createServer();

    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      const redirectUri = `http://localhost:${port}`;
      const client = new google.auth.OAuth2(client_id, client_secret, redirectUri);
      const authUrl = client.generateAuthUrl({ access_type: "offline", scope: SCOPES });

      console.log("\nGoogle Driveへのアクセスを許可するため、以下のURLをブラウザで開いてください:\n");
      console.log(authUrl);
      console.log("\nブラウザで許可するとこのターミナルが自動で続行します...\n");

      server.on("request", (req, res) => {
        const reqUrl = new URL(req.url, redirectUri);
        const code = reqUrl.searchParams.get("code");
        const error = reqUrl.searchParams.get("error");

        if (error) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end(`<h2>認証エラー: ${error}</h2>`);
          server.close(() => reject(new Error(`OAuth error: ${error}`)));
          return;
        }
        if (code) {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end("<h2>認証完了！このタブを閉じてターミナルに戻ってください。</h2>");
          server.close(() => resolve({ code, oAuth2Client: client }));
        }
      });
    });

    server.on("error", reject);
  });

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log(`✓ 認証トークンを保存しました: ${TOKEN_PATH}\n`);
  return oAuth2Client;
}

// Drive APIクエリ用に名前をシングルクォートでエスケープ
function qstr(s) {
  return "'" + s.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
}

// フォルダパスを順にたどって最終フォルダのIDを返す(見つからなければ null)
async function findFolderByPath(drive, names, parentId = "root") {
  let currentId = parentId;
  for (const name of names) {
    const res = await drive.files.list({
      q: `name = ${qstr(name)} and mimeType = 'application/vnd.google-apps.folder' and ${qstr(currentId)} in parents and trashed = false`,
      fields: "files(id, name)",
      pageSize: 10,
    });
    if (!res.data.files.length) return null;
    currentId = res.data.files[0].id;
  }
  return currentId;
}

// 直下のサブフォルダ一覧を名前順で返す
async function listSubfolders(drive, parentId) {
  const res = await drive.files.list({
    q: `mimeType = 'application/vnd.google-apps.folder' and ${qstr(parentId)} in parents and trashed = false`,
    fields: "files(id, name)",
    orderBy: "name",
    pageSize: 200,
  });
  return res.data.files;
}

// 直下の画像ファイル一覧を名前順で返す
async function listImages(drive, folderId) {
  const res = await drive.files.list({
    q: `${qstr(folderId)} in parents and trashed = false and (mimeType contains 'image/')`,
    fields: "files(id, name, mimeType)",
    orderBy: "name",
    pageSize: 50,
  });
  return res.data.files;
}

// ファイルをローカルパスにダウンロード
async function downloadFile(drive, fileId, destPath) {
  const res = await drive.files.get({ fileId, alt: "media" }, { responseType: "stream" });
  await new Promise((resolve, reject) => {
    const dest = fs.createWriteStream(destPath);
    res.data.on("error", reject).pipe(dest);
    dest.on("finish", resolve).on("error", reject);
  });
}

module.exports = { getAuthClient, findFolderByPath, listSubfolders, listImages, downloadFile };
