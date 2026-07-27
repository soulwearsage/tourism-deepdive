import { FactInput } from "../DeepDive";

const HERO_PHOTO = "photos/002_itsukushima/hero.png";
const AUDIO_DIR = "audio/002_itsukushima";

// 実測したナレーションの長さ(秒)+2.5秒の余白
export const sceneDurations = {
  title: 4.5, // ナレーション1.8秒(神社名を追加) + 余白
  map: 5.0,    // ナレーション1.2秒 + 余白(ズーム演出の尺を確保するため多めに)
  hook: 9.0,   // ナレーション6.6秒 + 余白
  twist: 15.0, // ナレーション12.6秒 + 余白
  outro: 4.5,  // ナレーション1.7秒 + 余白
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "鳥",
    heading: "The gate that touches no ground",
    statValue: "~60t",
    statLabel: "the torii's own weight — nothing bolts it to the seabed",
    body: "It isn't anchored at all. It simply stands in the tide, held upright by its own mass alone.",
    photoSrc: "photos/002_itsukushima/hero.png",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 11.0, // ナレーション8.5秒 + 余白
  },
  {
    type: "quote",
    quote: "Giving birth here is forbidden. So is dying. For centuries, islanders crossed to the mainland for both — the island itself is considered too sacred to bear either.",
    caption: "AN ISLAND WHERE LIFE ISN'T ALLOWED TO BEGIN OR END",
    kanji: "禁",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 12.5, // ナレーション10.1秒 + 余白
  },
  {
    type: "big-number",
    kanji: "宗",
    value: "3",
    label: "sister goddesses enshrined here since 593 AD — the Munakata deities",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 8.5, // ナレーション5.9秒 + 余白
  },
  {
    type: "photo-stat",
    kanji: "鹿",
    heading: "The deer aren't wildlife",
    body: "They're considered messengers of the gods, free to wander the shrine grounds exactly as they have for over a thousand years.",
    photoSrc: "photos/002_itsukushima/fact-4.png",
    verticalText: "市杵島姫命",
    narrationSrc: `${AUDIO_DIR}/fact-4.mp3`,
    durationSeconds: 12.0, // ナレーション9.5秒 + 余白
  },
];

export const defaultProps = {
  spotName: "Itsukushima Shrine",
  spotNameJa: "厳島神社",
  location: "Miyajima, Hiroshima",
  accentColor: "#7fa9a3",
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "厳",
  mapRegionLabel: "MIYAJIMA, JAPAN",
  prefectureId: "34", // 広島県
  municipalityId: "34213", // 廿日市市
  hookText: "For over a thousand years, no one has been born on this island — and no one is allowed to die here either.",
  facts,
  twistHeading: "A flame that never went out.",
  twistBody: "High on Mount Misen, a fire lit in the year 806 has burned without stopping for over 1,200 years. In 1945, it lit the Peace Flame in Hiroshima — thirty kilometers away.",
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
  episodeNumber: 2,
};
