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
  title: 3.1, // 自動計算(ナレーション1.6秒 + 余白) // 自動計算(ナレーション1.6秒 + 余白)
  map: 4.2, // 自動計算(ナレーション1.2秒 + 余白) // 自動計算(ナレーション1.2秒 + 余白)
  hook: 16.8, // 自動計算(ナレーション15.3秒 + 余白) // 自動計算(ナレーション15.1秒 + 余白)
  twist: 29.5, // 自動計算(ナレーション28秒 + 余白) // 自動計算(ナレーション27.9秒 + 余白)
  outro: 4.5, // 自動計算(ナレーション1.8秒 + 余白) // 自動計算(ナレーション1.8秒 + 余白)
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "岩",
    heading: "When Nature Itself Was God",
    body: "Long before Buddhism arrived, ancient Japanese worshipped nature itself — giant rocks, mountains, rivers, and ancient trees were believed to be the dwelling places of kami. This worldview became known as Ko-Shinto, the ancient way of the gods. Rather than building grand sanctuaries everywhere, many sacred places were simply left untouched, because nature itself was the shrine.",
    photoSrc: "photos/000_shinto-vs-buddhism/fact-1.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 25, // 自動計算(ナレーション23.5秒 + 余白)
  },
  {
    type: "quote",
    kanji: "合",
    quote: "In the 6th century, Buddhism arrived from the Asian mainland. But the old gods weren't pushed aside. Instead, kami and Buddhas gradually came to be understood as different expressions of the same sacred truth. Shrines and temples shared the same grounds, priests performed rituals side by side, and this blended tradition became known as Shinbutsu-shugo.",
    caption: "SHINBUTSU-SHUGO",
    visual: "circle-split",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 23.7, // 自動計算(ナレーション22.2秒 + 余白)
  },
  {
    type: "photo-stat",
    kanji: "離",
    heading: "A Line Drawn by Law",
    body: "That fusion endured for more than a thousand years. Then, in 1868, the new Meiji government issued a decree that changed everything: Shinbutsu Bunri, the official separation of Shinto and Buddhism. Temples and shrines were ordered to divide, sacred images were removed, and centuries of shared tradition were dismantled almost overnight.",
    photoSrc: "photos/000_shinto-vs-buddhism/fact-2.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 23.2, // 自動計算(ナレーション21.7秒 + 余白)
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
  mapType: "national-watermark" as const,
  hookText: "Today, Shinto shrines and Buddhist temples in Japan seem like two completely separate worlds. But few visitors ever ask why that's the case. The answer lies in a forgotten chapter of history that reshaped an entire nation's spiritual identity.",
  facts,
  twistHeading: "Two Faiths, Still Apart",
  twistBody: "More than 150 years later, Japan's shrines and temples are still living out that forced divorce — standing side by side, but never again as one. Yet history never disappears completely. In a few quiet corners of Japan, the old fusion survived — hidden deep in the mountains, or carved into cliffs where Buddhas and kami still seem to share the same sacred landscape. So why did building a modern nation require tearing one faith into two?",
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
  catchCopy: "One Faith, Torn in Two.",
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 0,
  jaSubtitles: {
    catchCopy: "一つの信仰が、二つに引き裂かれた。",
    hook: "今日の日本では、神社と寺はまるで別々の世界に見える。なぜそうなったかを問う人はほとんどいない。その答えは、国全体の精神的なあり方を塗り替えた、忘れられた歴史の一章にある。",
    facts: [
      "仏教が伝わるずっと前、古代の日本人は自然そのものを——巨岩、山、川、古木を——神(かみ)の宿る場所として崇めていた。この世界観は「古神道」と呼ばれた。偉大な社を建てるより、聖地はただそのままにされた——自然そのものが、神社だったから。",
      "6世紀、大陸から仏教が伝わった。しかし古い神々は退けられなかった。神と仏はやがて、同じ真理の異なる表れとして理解されるようになった。神社と寺は同じ境内を共有し、「神仏習合」と呼ばれる信仰の形が生まれた。",
      "その融合は千年以上続いた。そして1868年、明治新政府が全てを変える法令を出した——「神仏分離」。神社と寺は分離を命じられ、聖像は撤去され、何世紀もの共存がほぼ一夜にして解体された。",
    ],
    twist: "150年以上経った今も、日本の神社と寺は、あの強制的な離別を生き続けている——隣り合って立ちながら、二度と一つには戻らないまま。それでも、歴史は完全には消えない。山深く、あるいは崖に刻まれた仏の姿のなかに、古い融合は生き残っている。では、なぜ近代国家を築くために、一つの信仰を二つに引き裂くことが必要だったのか？",
  },
};
