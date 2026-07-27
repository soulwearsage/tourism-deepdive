import { FactInput } from "../DeepDive";

const HERO_PHOTO = "photos/003_takaya/hero.png";
const AUDIO_DIR = "audio/003_takaya";

// ※秒数は暫定値。ナレーション生成後にmeasure-narration.jsで実測し、正確な値に差し替えること
export const sceneDurations = {
  title: 3.2,
  map: 4.5,
  hook: 8.5, // ナレーション5.6秒 + 余白
  twist: 17.0, // ナレーション14.5秒 + 余白
  outro: 4.5,
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "空",
    heading: "The gate that touches the sky",
    statValue: "404m",
    statLabel: "above the Seto Inland Sea, with nothing but clouds beyond the gate",
    body: "Climb high enough, and the torii seems to open directly into the sky — which is exactly why everyone calls it that.",
    photoSrc: HERO_PHOTO,
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 14.0, // ナレーション11.1秒 + 余白
  },
  {
    type: "big-number",
    kanji: "宮",
    value: "3",
    label: "kami enshrined together here — one of only 24 shrines from Sanuki listed in a 10th-century imperial record",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 11.0, // ナレーション8.4秒 + 余白
  },
  {
    type: "photo-stat",
    kanji: "石",
    heading: "A boulder that shouldn't stay still",
    body: "Press it with a single finger, and it rocks. It has never once fallen.",
    photoSrc: "photos/003_takaya/fact-3.png",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 10.0,
  },
];

export const defaultProps = {
  spotName: "Takaya Shrine",
  spotNameJa: "高屋神社",
  location: "Kagawa, Japan",
  accentColor: "#8fb3c7", // 瀬戸内海の空と海を意識した、薄い水色寄りのアクセント
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "天",
  mapRegionLabel: "KAGAWA, JAPAN",
  prefectureId: "37", // 香川県
  municipalityId: "37205", // 観音寺市
  hookText: "Most visitors never learn why this shrine sits on top of such an inconvenient mountain.",
  facts,
  twistHeading: "They moved it. Then moved it back.",
  twistBody: "The shrine was carried down this mountain twice, in the 1600s and the 1700s. In 1831, villagers hauled it all the way back to the summit — terrified of what a curse might bring if they didn't.",
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
  episodeNumber: 3,
};
