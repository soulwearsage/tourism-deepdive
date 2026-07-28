import { FactInput } from "../DeepDive";
import { rubikGlitchFont } from "../fonts";

const HERO_PHOTO = "photos/012_ine/hero.png";
const AUDIO_DIR = "audio/012_ine";

export const sceneDurations = {
  title: 3.2,  // ナレーション0.7秒 + 余白
  map: 4.1,    // ナレーション0.6秒 + 余白
  hook: 9.0,   // ナレーション7.4秒 + 余白
  twist: 12.8, // ナレーション11.3秒 + 余白
  outro: 19.5, // 籠目紋ティーザーシーン: ナレーション17.0秒 + 余白
  epilogue: 4.6, // 標準アウトロ: ナレーション2.1秒 + 余白
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "船",
    heading: "A Village Older Than Its Houses",
    body: "Ine's first written record dates back to 1191, in a document called the Chokodo Shoryo Chumon, where it appears as \"Ine-no-sho.\" The poet Kamo no Chōmei, author of the famous Hojoki, is even said to have composed a poem about this very bay.",
    photoSrc: "photos/012_ine/fact-1.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 17.3, // ナレーション15.8秒 + 余白
  },
  {
    type: "photo-stat",
    kanji: "船",
    heading: "Built for Boats, Not People",
    body: "Those iconic \"funaya\" boathouses were never built as homes. The ground floor was a garage for pulling boats in from the sea, the second floor was storage — people rarely lived inside them at all. The actual family home stood separately, across the road.",
    photoSrc: "photos/012_ine/fact-2.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 17.3, // ナレーション15.8秒 + 余白
  },
  {
    type: "big-number",
    kanji: "船",
    value: "230",
    label: "About 230 funaya line the 5-kilometer curve of Ine Bay.",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 5.7, // ナレーション4.2秒 + 余白
  }
];

export const defaultProps = {
  spotName: "Ine",
  spotNameJa: "伊根",
  location: "Kyoto, Japan",
  accentColor: "#4a6d7a",
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "船",
  mapRegionLabel: "KYOTO, JAPAN",
  prefectureId: "26",
  municipalityId: "26463",
  hookText: "This bay looks like something from a fairytale — houses that float on the water. But they were never built for people.",
  facts,
  twistHeading: "A Garage That Became a Home",
  twistBody: "The fishing village a Heian-era poet once sang about still looks almost the same today. What was once built as a garage for boats slowly became the shape of everyday life itself. And just a short drive from here wait two more of Japan's mysteries: Amanohashidate, one of Japan's three most celebrated views, and Kono Shrine — the legendary \"former Ise,\" said to be where Ise Grand Shrine's deity once resided before moving south. The mystery isn't over yet.",
  narration: {
    title: `${AUDIO_DIR}/title.mp3`,
    map: `${AUDIO_DIR}/map.mp3`,
    hook: `${AUDIO_DIR}/hook.mp3`,
    twist: `${AUDIO_DIR}/twist.mp3`,
    outro: `${AUDIO_DIR}/outro.mp3`,       // 籠目紋ティーザーシーンのナレーション
    epilogue: `${AUDIO_DIR}/epilogue.mp3`, // 標準アウトロ("Worth the visit? Absolutely.")
  },
  sceneDurations,
  bgmSrc: "bgm/bgm002.wav",
  bgmVolume: 0.12,
  introSfx: "bgm/light_intro.mp3",
  epilogueType: "kagome-teaser" as const,
  catchCopy: "THESE HOUSES WERE NEVER BUILT FOR PEOPLE.",
  catchCopyFont: rubikGlitchFont,
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 12,
};
