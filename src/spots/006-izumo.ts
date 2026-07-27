import { FactInput } from "../DeepDive";

const HERO_PHOTO = "photos/006_izumo/hero.png";
const AUDIO_DIR = "audio/006_izumo";

// ※秒数は暫定値。ナレーション生成後にmeasure-narration-izumo.jsで実測し、正確な値に差し替えること
export const sceneDurations = {
  title: 4.0,
  map: 5.0,
  hook: 7.0,
  twist: 22.0, // ナレーション20.4秒 + 余白
  outro: 4.5,
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "柱",
    heading: "A shrine built for a defeated god",
    statValue: "48m",
    statLabel: "tall — proven by three massive pillars, bound as one, found in a 2000 excavation",
    body: "Ōkuninushi once ruled Japan, until the myth of \"kuniyuzuri\" forced him to hand the land to the gods who came before the emperors. This shrine — once nearly half the height of the Great Pyramid — was his reward for stepping aside.",
    photoSrc: HERO_PHOTO,
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 25.0, // ナレーション23.6秒 + 余白
  },
  {
    type: "quote",
    quote: "Online, some compare its ancient internal passage and chamber to the Great Pyramid's own. Historians dismiss it as legend — but the resemblance is hard to unsee.",
    caption: "URBAN LEGEND, NOT HISTORY",
    kanji: "塔",
    visual: "pyramid",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 13.5,
  },
  {
    type: "photo-stat",
    kanji: "西",
    heading: "The god who won't face his own worshippers",
    body: "His sacred seat points sideways, to the west — so a separate entrance was built just so visitors could pray to him face to face. Some say it was designed that way on purpose.",
    photoSrc: "photos/006_izumo/fact-3.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 17.0, // ナレーション15.2秒 + 余白
  },
];

export const defaultProps = {
  spotName: "Izumo Taisha",
  spotNameJa: "出雲大社",
  location: "Shimane, Japan",
  accentColor: "#b58c6b", // 古代神殿の木質感と、ミステリーを意識した深みのあるブラウン
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "神",
  mapRegionLabel: "SHIMANE, JAPAN",
  prefectureId: "32", // 島根県
  municipalityId: "32203", // 出雲市
  hookText: "Every October, the gods of Japan vanish from their shrines — all except in one place.",
  facts,
  twistHeading: "One god never leaves — so one place never goes dark.",
  twistBody: "For centuries, people believed the gods gather in Izumo because they abandon every other shrine in Japan. But one shrine's god never goes — bound by a promise he made after losing an ancient power struggle: to never leave this land again. So today, only one other place in Japan is still called the month of the present gods.",
  narration: {
    title: `${AUDIO_DIR}/title.mp3`,
    map: `${AUDIO_DIR}/map.mp3`,
    hook: `${AUDIO_DIR}/hook.mp3`,
    twist: `${AUDIO_DIR}/twist.mp3`,
    outro: `${AUDIO_DIR}/outro.mp3`,
  },
  sceneDurations,
  bgmSrc: "bgm/bgm003.mp3",
  bgmVolume: 0.12,
  introSfx: "bgm/dark_intro.mp3",
  catchCopy: "THE GOD NO ONE KNOWS.",
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 6,
};
