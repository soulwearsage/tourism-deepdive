import { FactInput } from "../DeepDive";

const HERO_PHOTO = "photos/013_shirakawago/hero.png";
const AUDIO_DIR = "audio/013_shirakawago";

// ※秒数は暫定値。ナレーション生成後にmeasure-narration-shirakawago.jsで実測し、正確な値に差し替えること
export const sceneDurations = {
  title: 3.2,
  map: 4.5,
  hook: 7.0,
  twist: 18.0,
  outro: 4.5,
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "蚕",
    heading: "In the mountain valleys once ruled by the Kaga domain, gassho-zukuri houses stand with steep thatched roofs, lashed together with rope instead of a single nail — a shape evolved purely to shed heavy snow.",
    body: "In the mountain valleys once ruled by the Kaga domain, gassho-zukuri houses stand with steep thatched roofs, lashed together with rope instead of a single nail — a shape evolved purely to shed heavy snow.",
    photoSrc: "photos/013_shirakawago/fact-1.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 11.0, // 仮値。measure-narration実行後に実測値へ差し替え
  },
  {
    type: "photo-stat",
    kanji: "蚕",
    heading: "The vast attic space, sometimes stacked two or three stories high, was never just storage. From the Meiji era onward, entire families raised silkworms there — turning a single house into a small silk factory.",
    body: "The vast attic space, sometimes stacked two or three stories high, was never just storage. From the Meiji era onward, entire families raised silkworms there — turning a single house into a small silk factory.",
    photoSrc: "photos/013_shirakawago/fact-2.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 11.0, // 仮値。measure-narration実行後に実測値へ差し替え
  },
  {
    type: "photo-stat",
    kanji: "蚕",
    heading: "Beneath the floor lay an even bigger secret. Villagers fermented straw and wild plants for years to produce gunpowder — a closely guarded military secret of the Kaga domain.",
    body: "Beneath the floor lay an even bigger secret. Villagers fermented straw and wild plants for years to produce gunpowder — a closely guarded military secret of the Kaga domain.",
    photoSrc: "photos/013_shirakawago/fact-3.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 11.0, // 仮値。measure-narration実行後に実測値へ差し替え
  },
];

export const defaultProps = {
  spotName: "Shirakawa-go",
  spotNameJa: "白川郷",
  location: "Gifu, Japan",
  accentColor: "#5c4a3a",
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "蚕",
  mapRegionLabel: "GIFU, JAPAN",
  prefectureId: "21",
  municipalityId: "21505",
  hookText: "For centuries, these houses were built to survive Japan's heaviest snowfall. But snow wasn't the only thing they were hiding.",
  facts,
  twistHeading: "Two Secrets in One House",
  twistBody: "In a quiet snowbound village, silkworms spun thread overhead while gunpowder fermented underfoot — two hidden industries inside a single house. In 1995, it was precisely that hidden quietness that earned Shirakawa-go its status as a UNESCO World Heritage Site.",
  narration: {
    title: `${AUDIO_DIR}/title.mp3`,
    map: `${AUDIO_DIR}/map.mp3`,
    hook: `${AUDIO_DIR}/hook.mp3`,
    twist: `${AUDIO_DIR}/twist.mp3`,
    outro: `${AUDIO_DIR}/outro.mp3`,
  },
  sceneDurations,
  bgmSrc: "bgm/bgm003.mp3", // 系統: ダーク
  bgmVolume: 0.12,
  introSfx: "bgm/dark_intro.mp3",
  catchCopy: "This House Was Hiding a Secret Under Every Floor.",
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 13,
  jaSubtitles: {
    catchCopy: "この家は、床の下にも秘密を隠していた。",
    hook: "何世紀もの間、日本有数の豪雪に耐えるために建てられたこの家。でも、隠されていたのは雪だけじゃない。",
    facts: [
      "加賀の山あい、豪雪の地に立つ合掌造り。釘を使わず、縄と木だけで組まれた急な茅葺き屋根が、雪をやり過ごす。",
      "広い屋根裏は、ただの物置ではなかった。かつて家族総出で蚕を育て、家一軒がまるごと小さな製糸工場になっていた。",
      "床下には、もう一つの秘密があった。藁を発酵させて作る「塩硝」——火薬の原料。藩の機密として、密かに作り続けられていた。",
    ],
    twist: "頭上では蚕が糸を紡ぎ、足元では火薬の原料が発酵していた——一軒の家に隠された、二つの産業。1995年、その静かな営みごと、白川郷は世界遺産となった。",
  },
};
