// ============================================================
// 【テンプレート: 地域に紐づかないテーマ回】
//
// 第0話「神道と仏教」は、特定の地域・場所が主役ではなく
// 「文化・概念的なテーマ」を扱う回専用テンプレートとして位置づける。
// 今後シリーズに同種の回を追加するときはこのファイルを雛形にすること。
//
// 特徴:
//   - mapType: "national-watermark"
//     prefectureId / municipalityId は不要。地図シーンでは日本全土の
//     シルエットを背景に薄く表示する。
//   - タイトル画面は地域スポットと完全に同一(hero.png を3カラム表示)。
//     専用イラスト・特殊レイアウトは使わない。
//   - エピソード番号は0番台(シリーズ本編と区別できる通し番号)。
//
// 新規テーマ回の追加手順:
//   1. Notionの「地図タイプ」列を "national-watermark" に設定する。
//      「prefectureId」「municipalityId」列は空でよい。
//   2. scaffold-spot.js を実行して雛形を生成する。
//   3. 生成された src/spots/<番号>-<スラッグ>.ts を手動で修正:
//        a. defaultProps に  mapType: "national-watermark" as const  を追加
//        b. prefectureId / municipalityId の行を削除
//   4. location / mapRegionLabel は "Japan" など国全体を指す値にする。
//   5. ナレーション台本の title.mp3 / map.mp3 はテーマ名で生成する
//      (地名ではなくテーマタイトルを読み上げる)。
//
// ※ scaffold-spot.js は現状 mapType を自動判定しないため、
//    手順3の手動修正が必須。
// ============================================================

import { FactInput } from "../DeepDive";

const HERO_PHOTO = "photos/000_shinto-vs-buddhism/hero.png";
const AUDIO_DIR = "audio/000_shinto-vs-buddhism";

export const sceneDurations = {
  title: 3.1, // 自動計算(ナレーション1.6秒 + 余白)
  map: 6.0,   // world-to-japan アニメーション(165f≒5.5s) + 余白
  hook: 6.7,  // 自動計算(ナレーション5.2秒 + 余白)
  twist: 9.0, // 合計105秒に合わせて調整
  outro: 4.5, // 自動計算(ナレーション1.8秒 + 余白)
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "岩",
    heading: "When nature itself was god",
    body: "Long before Buddhism arrived, ancient Japanese worshipped nature itself — giant rocks, mountains, rivers, and ancient trees were believed to be the dwelling places of kami. This worldview became known as Ko-Shinto, the ancient way of the gods.",
    photoSrc: "photos/000_shinto-vs-buddhism/fact-1.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 16.6, // 自動計算(ナレーション15.1秒 + 余白)
  },
  {
    type: "big-number",
    kanji: "合",
    value: "6th",
    label: "century — Buddhism arrived from the mainland, and the two faiths slowly became one",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 17.7, // 自動計算(ナレーション16.2秒 + 余白)
  },
  {
    type: "photo-stat-right",
    kanji: "別",
    heading: "A question history hasn't answered yet.",
    body: "Yet history never disappears completely. In a few quiet corners of Japan, the old fusion survived — hidden deep in the mountains, or carved into cliffs where Buddhas and kami still seem to share the same sacred landscape. So why did building a modern nation require tearing one faith into two?",
    photoSrc: "photos/000_shinto-vs-buddhism/fact-2.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/twist-2.mp3`,
    durationSeconds: 19.7, // 自動計算(ナレーション18.2秒 + 余白)
  },
  {
    type: "quote",
    kanji: "離",
    quote: "Merged for a thousand years.\nSeparated by a single decree.",
    caption: "SHINBUTSU BUNRI — 1868",
    visual: "circle-split" as const,
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 16.7,
  },
];

export const defaultProps = {
  spotName: "Shinto vs. Buddhism",
  spotNameJa: "神道と仏教",
  location: "Japan",
  accentColor: "#a07840",
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "道",
  mapRegionLabel: "JAPAN",
  mapType: "world-to-japan" as const,
  hookText: "Think Japanese shrines and temples are the same?\nThey were.\nUntil 1868.",
  facts,
  twistHeading: "Two Faiths, Still Apart",
  twistBody: "More than 150 years later, Japan's shrines and temples are still living out that forced divorce — standing side by side, but never again as one.",
  narration: {
    title: `${AUDIO_DIR}/title.mp3`,
    map: `${AUDIO_DIR}/map.mp3`,
    hook: `${AUDIO_DIR}/hook.mp3`,
    twist: `${AUDIO_DIR}/twist.mp3`,
    outro: `${AUDIO_DIR}/outro.mp3`,
  },
  sceneDurations,
  bgmSrc: "bgm/bgm002.wav",
  bgmVolume: 0.12,
  introSfx: "bgm/light_intro.mp3",
  catchCopy: "The Forgotten Faith of Japan",
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 0,
  showJaSubtitles: false,
  jaSubtitles: {
    catchCopy: "忘れられた日本の信仰",
    hook: "日本の神社と寺は同じだと思ってるよね？\nその通りだった。\n1868年までは。",
    facts: [
      "仏教が伝わるずっと前、古代の日本人は自然そのものを神として崇めていた。巨岩や山、川、そして老木には、神が宿ると信じられていたのである。その世界観は「古神道」と呼ばれた。",
      "6世紀、大陸から仏教が伝わった。だが古い神々は排除されなかった。神と仏は同じ真理を異なる姿で現した存在とされ、「神仏習合」という一つの信仰の形が育まれた。",
      "しかし、歴史は完全には消え去らない。この国の静かな山奥には、神仏が共に息づいていた時代の姿が、崖に刻まれた仏や古い聖地として今も残されている。では、近代国家を築くために、なぜ一つだった信仰を引き裂く必要があったのだろうか。",
      "その融合は千年以上にわたり続いた。だが1868年、明治政府は「神仏分離」を命じる。何世紀もの信仰の姿は、わずかな期間で解体されていった。",
    ],
    twist: "それから150年以上が過ぎた今も、日本の神社と寺は、その強制的な離別を生き続けている。隣り合って立ちながら、二度と一つには戻らないまま。",
  },
};
