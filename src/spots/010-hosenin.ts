import { FactInput } from "../DeepDive";

const HERO_PHOTO = "photos/010_hosenin/hero.png";
const AUDIO_DIR = "audio/010_hosenin";

// ※秒数は暫定値。ナレーション生成後にmeasure-narration-hosenin.jsで実測し、正確な値に差し替えること
export const sceneDurations = {
  title: 3, // 自動計算(ナレーション1秒 + 余白) // 自動計算(ナレーション0.9秒 + 余白) // 自動計算(ナレーション0.9秒 + 余白)
  map: 4.2, // 自動計算(ナレーション0.6秒 + 余白) // 自動計算(ナレーション0.5秒 + 余白) // 自動計算(ナレーション0.6秒 + 余白)
  hook: 9.1, // 自動計算(ナレーション7.6秒 + 余白) // 自動計算(ナレーション9.9秒 + 余白) // 自動計算(ナレーション10.2秒 + 余白)
  twist: 10.5, // 自動計算(ナレーション9秒 + 余白) // 自動計算(ナレーション15.6秒 + 余白) // 自動計算(ナレーション15.3秒 + 余白)
  outro: 4.5, // 自動計算(ナレーション1.7秒 + 余白) // 自動計算(ナレーション1.8秒 + 余白) // 自動計算(ナレーション1.8秒 + 余白)
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "額",
    heading: "The Framed Garden",
    body: "The wooden pillars and lintel of the guest hall frame the garden like a living painting. At its center stands a 700-year-old five-needle pine, shaped to resemble Mount Mikami — Kyoto's own 'Omi Fuji.' The garden's name, Bankan-en, means 'a place too beautiful to leave.'",
    photoSrc: "photos/010_hosenin/fact-1.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 20.2, // 自動計算(ナレーション17.2秒 + 余白)
  },
  {
    type: "big-number",
    kanji: "庭",
    value: "3",
    label: "Hosen-in actually holds three distinct gardens — Bankan-en, the Crane-and-Turtle Garden, and Horaku-en.",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 7.9, // 自動計算(ナレーション6.4秒 + 余白)
  },
  {
    type: "photo-stat",
    kanji: "音",
    heading: "The Water Zither",
    body: "Lean close to the bamboo pipe and you'll hear it — water dripping into a buried jar underground, its sound echoing up in a clear, hidden chime.",
    photoSrc: "photos/010_hosenin/fact-3.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 10.4, // 自動計算(ナレーション8.9秒 + 余白)
  }
];

export const defaultProps = {
  spotName: "Hosenin",
  spotNameJa: "宝泉院",
  location: "Kyoto, Japan",
  accentColor: "#4a5d3a",
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "苔",
  mapRegionLabel: "KYOTO, JAPAN",
  prefectureId: "26",
  municipalityId: "26100",
  hookText: "A garden framed like a painting — a perfect, timeless beauty. But that lush green moss? It didn't grow that way on its own.",
  facts,
  twistHeading: "Not wild. Willed.",
  twistBody: "That 'perfect' moss garden was never wild. For generations, monks have hand-pulled every single weed, blade by blade, to keep it looking untouched.",
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
  jaSubtitles: {
    catchCopy: "この景色は、700年かけて描かれた。",
    hook: "一枚の絵のように切り取られた庭。完璧で、時を超えた美しさ。だがあの青々とした苔は、自然に生えたものではない。",
    facts: [
      "柱と鴨居が、庭を一枚の絵のように切り取る。中央には樹齢700年、近江富士を模した五葉松。この庭は「盤桓園」——立ち去りがたいほど美しい場所、という意味を持つ。",
      "宝泉院には、性格の異なる三つの庭がある。盤桓園、鶴亀の庭、そして宝楽園。",
      "竹筒に耳を寄せれば、聞こえてくる。地中に埋められた甕へ落ちる水音が、澄んだ音色となって響く。",
    ],
    twist: "あの「完璧な」苔庭は、自然が作ったものではない。幾世代もの僧侶たちが、一本一本、雑草を手で抜き続けてきた——手つかずに見えるその姿を、守るために。",
  },
  catchCopy: "This view took 700 years to frame.",
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 10,
};
