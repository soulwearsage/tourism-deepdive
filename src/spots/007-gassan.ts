import { FactInput } from "../DeepDive";

const HERO_PHOTO = "photos/007_gassan/hero.png";
const AUDIO_DIR = "audio/007_gassan";

// ※秒数は暫定値。ナレーション生成後にmeasure-narration-gassan.jsで実測し、正確な値に差し替えること
export const sceneDurations = {
  title: 3.2,
  map: 4.5,
  hook: 6.0, // ナレーション4.0秒 + 余白
  twist: 20.0, // ナレーション18.2秒 + 余白
  outro: 4.5,
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "峰",
    heading: "A near-perfect circle of a mountain",
    statValue: "1,984m",
    statLabel: "tall — one of the world's rare round shield volcanoes",
    body: "Founded in 593 AD by a prince fleeing an assassination plot, guided here by a three-legged sacred crow.",
    photoSrc: "photos/007_gassan/fact-1.png",
    photoSfx: "bgm/camera.mp3",
    verticalText: "月読命",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 16.0, // ナレーション14.5秒 + 余白
  },
  {
    type: "quote",
    quote: "During Japan's civil wars, monks hid the mountain's sacred treasures inside a secret cave — guarded for generations by a single hereditary family, sworn never to reveal its location.",
    caption: "A SECRET KEPT FOR CENTURIES",
    kanji: "隠",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 13.5,
  },
  {
    type: "photo-stat",
    kanji: "祓",
    heading: "Some places are still off-limits to cameras",
    body: "Step inside the summit shrine, and photography is forbidden. Every visitor must be purified first — a rule enforced exactly as it was centuries ago.",
    photoSrc: "photos/007_gassan/fact-3.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 11.0, // ナレーション9.2秒 + 余白
  },
];

export const defaultProps = {
  spotName: "Gassan Shrine",
  spotNameJa: "月山神社",
  location: "Yamagata, Japan",
  accentColor: "#8b93b0", // 月夜を意識した、静かな藍がかったブルーグレー
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "月",
  mapRegionLabel: "YAMAGATA, JAPAN",
  prefectureId: "06", // 山形県
  municipalityId: "06203", // 鶴岡市
  hookText: "One of Japan's three founding gods has almost no story at all.",
  facts,
  twistHeading: "The god erased from his own myth now rules over death itself.",
  twistBody: "Tsukuyomi has only one recorded story: he killed the goddess of food in disgust, and his own sister, Amaterasu, banished him forever — the reason day and night never meet in the sky. That same forgotten god is who pilgrims still climb this mountain to meet, praying for peace in the afterlife.",
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
  catchCopy: "THE GOD WHO VANISHED FROM HIS OWN MYTH.",
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 7,
};
