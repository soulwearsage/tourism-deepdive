import { FactInput } from "../DeepDive";

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
  jaSubtitles: {
    catchCopy: "この家は、人のためではなかった。",
    hook: "おとぎ話のような入江に、水に浮かぶ家々。けれど、人が住むためではない。",
    facts: [
      "伊根の名は、遠く1191年の記録に残る。『方丈記』の鴨長明も、この入江を歌に詠んだと伝わる。",
      "舟屋は、暮らすためではなく、船のために建てられた。人の住まいは、道の向こうに別にあった。",
      "230軒あまりの舟屋が、5キロの入江に沿って並ぶ。",
    ],
    twist: "平安の歌人が詠んだ景色は、今もそのまま残っている。船のための小屋が、いつしか暮らしの形になった。すぐ先には、まだ二つの謎が待っている——天橋立と、もうひとつ。",
    kagomeTeaser: "元伊勢と呼ばれる籠神社——伊勢の神が、南へ移る前に鎮まっていた場所。物語は、まだ終わらない。",
  },
  catchCopy: "THESE HOUSES WERE NEVER BUILT FOR PEOPLE.",
  catchCopyFontSize: 80,
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 12,
};
