import { FactInput } from "../DeepDive";

const HERO_PHOTO = "photos/000_shinto-vs-buddhism/hero.png";
const AUDIO_DIR = "audio/000_shintovsbuddhism";

export const sceneDurations = {
  title: 3.2,
  map: 5.0,
  hook: 7.0,
  twist: 18.0,
  outro: 4.5,
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "岩",
    heading: "Long before Buddhism arrived, ancient Japanese worshipped nature itself — giant rocks, mountains, and trees were treated as gods. This belief became known as Ko-Shinto, the old way of the gods.",
    body: "Long before Buddhism arrived, ancient Japanese worshipped nature itself — giant rocks, mountains, and trees were treated as gods. This belief became known as Ko-Shinto, the old way of the gods.",
    photoSrc: "photos/000_shinto-vs-buddhism/fact-1.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 11.0,
  },
  {
    type: "photo-stat",
    kanji: "合",
    heading: "In the 6th century, Buddhism arrived from the mainland. But the old gods weren't pushed out — instead, kami and Buddhist statues began sharing the same shrine grounds, blending into a single faith called Shinbutsu-shugo.",
    body: "In the 6th century, Buddhism arrived from the mainland. But the old gods weren't pushed out — instead, kami and Buddhist statues began sharing the same shrine grounds, blending into a single faith called Shinbutsu-shugo.",
    photoSrc: "photos/000_shinto-vs-buddhism/fact-2.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 11.0,
  },
  {
    type: "photo-stat",
    kanji: "離",
    heading: "That fusion, over a thousand years in the making, was torn apart in 1868 by a new government decree — Shinbutsu Bunri, the forced separation of Shinto and Buddhism.",
    body: "That fusion, over a thousand years in the making, was torn apart in 1868 by a new government decree — Shinbutsu Bunri, the forced separation of Shinto and Buddhism.",
    photoSrc: "photos/000_shinto-vs-buddhism/fact-3.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 11.0,
  },
];

export const defaultProps = {
  spotName: "Shinto vs. Buddhism",
  spotNameJa: "神道と仏教",
  location: "Japan",
  accentColor: "#a07840",
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "道",
  mapRegionLabel: "JAPAN",
  mapType: "national-watermark" as const,
  hookText: "For over a thousand years, Japan's gods and Buddhas were worshipped side by side in the same grounds. Then, in a single year, the government tore them apart.",
  facts,
  twistHeading: "The Separation That Never Healed",
  twistBody: "More than 150 years later, Japan's shrines and temples are still living out that forced divorce — standing side by side, but never again as one. Yet in a few quiet corners of the country, that fused form was never fully erased — preserved deep in the mountains, carved as the face of a Buddha into a cliff. So why is it that a faith once fused for over a thousand years never found its way back together?",
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
  catchCopy: "One Faith, Torn in Two.",
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 0,
  jaSubtitles: {
    catchCopy: "一つの信仰が、二つに引き裂かれた。",
    hook: "千年以上の間、日本の神様と仏様は、同じ場所で祀られていた。でもある年、政府がそれを力ずくで引き裂いた。",
    facts: [
      "仏教が伝わるずっと前、古代の日本人は自然そのものを神として崇めていた——巨大な岩、山、木そのものが神とされ、これは「古神道」と呼ばれる。",
      "6世紀、大陸から仏教が伝わった。だが古い神々は追い出されなかった——それどころか、神と仏は同じ境内で祀られるようになり、「神仏習合」と呼ばれる一つの信仰の形になっていった。",
      "その千年以上続いた融合は、1868年、明治政府による法令で強制的に引き裂かれた——「神仏分離」と呼ばれる出来事だ。",
    ],
    twist: "それから150年以上経った今も、日本の神社と寺は、その強制的な離別をそのまま生き続けている——隣り合って立ちながら、二度と一つには戻らないまま。だがこの国のごく静かな片隅には、その融合した姿がそのまま残っている場所もある——山深くの崖に彫られた、仏の姿として。",
  },
};
