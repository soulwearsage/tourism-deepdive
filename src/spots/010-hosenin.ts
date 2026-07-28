import { FactInput } from "../DeepDive";

const HERO_PHOTO = "photos/010_hosenin/hero.png";
const AUDIO_DIR = "audio/010_hosenin";

// ※秒数は暫定値。ナレーション生成後にmeasure-narration-宝泉院.jsで実測し、正確な値に差し替えること
export const sceneDurations = {
  title: 3, // 自動計算(ナレーション1.5秒 + 余白)
  map: 4.2, // 自動計算(ナレーション0.8秒 + 余白)
  hook: 11.7, // 自動計算(ナレーション10.2秒 + 余白)
  twist: 17, // 自動計算(ナレーション15.5秒 + 余白)
  outro: 4.5, // 自動計算(ナレーション1.8秒 + 余白)
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "額",
    heading: "額縁庭園(盤桓園)",
    body: "客殿の柱と鴨居を額縁に見立てて、大原の景色を1枚の絵画のように眺める趣向。正面には樹齢700年、近江富士(琵琶湖畔の三上山)をかたどった五葉松。「盤桓」は\"立ち去りがたい\"という意味。",
    photoSrc: "photos/010_hosenin/fact-1.png" /* TODO: 実ファイル名を確認 */,
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 20.7, // 自動計算(ナレーション19.2秒 + 余白)
  },
  {
    type: "big-number",
    kanji: "額",
    value: "3",
    label: "宝泉院には性格の異なる3つの庭園がある(盤桓園・鶴亀庭園・宝楽園)",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 7.3, // 自動計算(ナレーション5.8秒 + 余白)
  },
  {
    type: "photo-stat",
    kanji: "額",
    heading: "水琴窟",
    body: "竹筒に耳を近づけると、地中に埋めた甕に水滴が反響して澄んだ音が聞こえる、音の仕掛け",
    photoSrc: "photos/010_hosenin/fact-3.png" /* TODO: 実ファイル名を確認 */,
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 10.1, // 自動計算(ナレーション8.6秒 + 余白)
  }
];

export const defaultProps = {
  spotName: "TODO_ローマ字表記",
  spotNameJa: "宝泉院",
  location: "TODO, Japan",
  accentColor: "#TODO", // TODO: 系統(ライト)に合わせて手動設定
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "TODO",
  mapRegionLabel: "TODO",
  prefectureId: "TODO",
  municipalityId: "TODO",
  hookText: "柱と柱の間だけを額縁に見立てて庭を鑑賞する完成された美学。でもその青々とした苔の庭は自然に生えたものじゃない。",
  facts,
  twistHeading: "TODO_短い見出し",
  twistBody: "この\"完成された美学\"に見える苔庭は、実は自然に生えたものではなく、何世代もの僧侶が何十年もかけて雑草を一本ずつ手作業で抜き続けて維持している、\"人工の極限美\"だった。",
  narration: {
    title: `${AUDIO_DIR}/title.mp3`,
    map: `${AUDIO_DIR}/map.mp3`,
    hook: `${AUDIO_DIR}/hook.mp3`,
    twist: `${AUDIO_DIR}/twist.mp3`,
    outro: `${AUDIO_DIR}/outro.mp3`,
  },
  sceneDurations,
  bgmSrc: "bgm/bgm002.wav", // TODO: 系統に応じて確認
  bgmVolume: 0.12,
  introSfx: "bgm/light_intro.mp3", // TODO: 系統に応じて確認
  catchCopy: "This view took 700 years to frame.",
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 10,
};
