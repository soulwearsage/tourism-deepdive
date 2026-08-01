const path = require("path");
const fs = require("fs");
const getMP3Duration = require("get-mp3-duration");

const AUDIO_DIR = path.join(__dirname, "..", "public", "audio", "006_izumo");

const FILES = [
  { key: "title", file: "title.mp3" },
  { key: "map", file: "map.mp3" },
  { key: "hook", file: "hook.mp3" },
  { key: "fact-1", file: "fact-1.mp3" },
  { key: "fact-2", file: "fact-2.mp3" },
  { key: "fact-3", file: "fact-3.mp3" },
  { key: "twist", file: "twist.mp3" },
  { key: "outro", file: "outro.mp3" },
];

console.log("--- 各ナレーションの長さ ---");
const results = {};
for (const { key, file } of FILES) {
  const filePath = path.join(AUDIO_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.log(`${file}: ファイルが見つかりません`);
    continue;
  }
  const buffer = fs.readFileSync(filePath);
  const seconds = Math.round((getMP3Duration(buffer) / 1000) * 10) / 10;
  results[key] = seconds;
  console.log(`${file}: ${seconds}秒`);
}
console.log("\n--- この結果をそのままClaudeに貼り付けてください ---");
console.log(JSON.stringify(results, null, 2));
