import { FactInput } from "../DeepDive";

const HERO_PHOTO = "photos/009_hasedera/hero.png";
const AUDIO_DIR = "audio/009_hasedera";

// ※秒数は暫定値。ナレーション生成後にmeasure-narration-hasedera.jsで実測し、正確な値に差し替えること
export const sceneDurations = {
  title: 3, // 自動計算(ナレーション1.2秒 + 余白)
  map: 4.2, // 自動計算(ナレーション0.6秒 + 余白)
  hook: 8.1, // 自動計算(ナレーション6.6秒 + 余白)
  twist: 17.4, // 自動計算(ナレーション15.9秒 + 余白)
  outro: 4.5, // 自動計算(ナレーション1.8秒 + 余白)
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "秘",
    heading: "No one has ever seen the god inside",
    body: "The temple's principal image is a giant wooden Eleven-Headed Kannon — one of Japan's tallest wooden Buddhist statues — classified as an absolute hibutsu. Even the resident priests have never laid eyes on it.",
    photoSrc: "photos/009_hasedera/fact-1.png",
    photoSfx: "bgm/camera.mp3",
    verticalText: "浄土宗",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 14.6, // 自動計算(ナレーション13.1秒 + 余白)
  },
  {
    type: "big-number",
    kanji: "縁",
    value: "3",
    label: "small stone jizo scattered through the grounds, each with a round, smiling face — locals call them Ryoen Jizo, guardians of good relationships",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 11.5, // 自動計算(ナレーション10秒 + 余白)
  },
  {
    type: "photo-stat",
    kanji: "闇",
    heading: "A key to paradise, found in total darkness",
    body: "Beneath the main hall runs a pitch-black corridor. Visitors feel along the wall in total darkness until their hand finds a single iron key — said to unlock paradise for whoever touches it.",
    photoSrc: "photos/009_hasedera/fact-3.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 13.3, // 自動計算(ナレーション11.8秒 + 余白)
  },
];

export const defaultProps = {
  spotName: "Hase-dera",
  spotNameJa: "長谷寺",
  location: "Kamakura, Japan",
  accentColor: "#a8a0c8", // 鎌倉・長谷寺の紫陽花を意識した淡いブルーパープル
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "観",
  mapRegionLabel: "KAMAKURA, JAPAN",
  prefectureId: "14", // 神奈川県
  municipalityId: "14204", // 鎌倉市
  hookText: "For centuries, not even the head priest has been allowed to see the object at the center of this temple.",
  facts,
  twistHeading: "Carved as one, sent to sea as two.",
  twistBody: "Legend says the statue was carved from one giant camphor tree, split in two: one half enshrined in Nara, the other set adrift in the sea with a prayer that it would find whoever needed saving. Fifteen years later, it washed ashore right here in Kamakura.",
  narration: {
    title: `${AUDIO_DIR}/title.mp3`,
    map: `${AUDIO_DIR}/map.mp3`,
    hook: `${AUDIO_DIR}/hook.mp3`,
    twist: `${AUDIO_DIR}/twist.mp3`,
    outro: `${AUDIO_DIR}/outro.mp3`,
  },
  sceneDurations,
  bgmSrc: "bgm/bgm002.wav", // ライト系デフォルト
  bgmVolume: 0.12,
  introSfx: "bgm/light_intro.mp3",
  catchCopy: "A GOD SET ADRIFT AT SEA.",
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 9,
};
