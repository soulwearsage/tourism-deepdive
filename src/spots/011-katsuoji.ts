import { FactInput } from "../DeepDive";

const HERO_PHOTO = "photos/011_katsuoji/hero.png";
const AUDIO_DIR = "audio/011_katsuoji";

// ※秒数は暫定値。ナレーション生成後にmeasure-narration-katsuoji.jsで実測し、正確な値に差し替えること
export const sceneDurations = {
  title: 3.1, // 自動計算(ナレーション1.6秒 + 余白)
  map: 4.2, // 自動計算(ナレーション0.8秒 + 余白)
  hook: 6.3, // 自動計算(ナレーション4.8秒 + 余白)
  twist: 20.8, // 自動計算(ナレーション19.3秒 + 余白)
  outro: 4.5, // 自動計算(ナレーション1.7秒 + 余白)
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "勝",
    heading: "The Name Too Bold for an Emperor",
    body: "In the Heian era, Emperor Seiwa was so moved after a monk's prayers cured his illness that he declared the temple's power had \"defeated\" (katsu) even the emperor himself, and wanted to name it accordingly.",
    photoSrc: "photos/011_katsuoji/fact-1.png",
    photoSfx: "bgm/camera.mp3",
    verticalText: "高野山真言宗",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 14.6, // 自動計算(ナレーション13.1秒 + 余白)
  },
  {
    type: "photo-stat",
    kanji: "勝",
    heading: "A Wish You Sign Yourself",
    body: "Countless tiny red daruma dolls fill every gap in the stone steps and walls — each one a self-made vow, not a wish granted by someone else. Pilgrims write their life's purpose on the bottom, a 365-day goal on the back, then paint in one eye as a signature to their own resolve.",
    photoSrc: "photos/011_katsuoji/fact-3.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 19.7, // 自動計算(ナレーション18.2秒 + 余白)
  },
  {
    type: "big-number",
    kanji: "勝",
    value: "80,000",
    label: "The temple grounds span roughly 80,000 tsubo — about 264,000 square meters.",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 8.5, // 自動計算(ナレーション7秒 + 余白)
  }
];

export const defaultProps = {
  spotName: "Katsuoji",
  spotNameJa: "勝尾寺",
  location: "Osaka, Japan",
  accentColor: "#c23b2e",
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "勝",
  mapRegionLabel: "OSAKA, JAPAN",
  prefectureId: "27",
  municipalityId: "27000",
  hookText: "This temple's name almost declared it more powerful than the Emperor himself.",
  facts,
  twistHeading: "One Character, Softened",
  twistBody: "The name the emperor wanted was \"Katsuou-ji\" — the temple that defeated the king. But the monks found that far too immodest, so they quietly swapped one character, 王 (king) for 尾 (tail) — and the temple that could have boasted about beating an emperor ended up with one of the humblest name origins in Japan.",
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
  catchCopy: "THE TEMPLE THAT ALMOST BEAT AN EMPEROR.",
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 11,
};
