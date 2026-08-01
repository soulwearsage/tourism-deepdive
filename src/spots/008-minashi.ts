import { FactInput } from "../DeepDive";

const HERO_PHOTO = "photos/008_minashi/hero.png";
const AUDIO_DIR = "audio/008_minashi";

// ※秒数は暫定値。ナレーション生成後にmeasure-narration-minashi.jsで実測し、正確な値に差し替えること
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
    kanji: "鏡",
    heading: "The real shrine behind a beloved anime",
    body: "Its name — Minashi — mirrors the fictional \"Miyamizu\" shrine in one of Japan's most celebrated animated films, almost letter for letter reversed.",
    photoSrc: "photos/008_minashi/fact-1.png",
    photoSfx: "bgm/camera.mp3",
    verticalText: "御歳大神",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 12.0, // ナレーション8.7秒 + 余白
  },
  {
    type: "big-number",
    kanji: "嶺",
    value: "2",
    label: "oceans this single sacred mountain feeds — one river runs to the Sea of Japan, the other all the way to the Pacific",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 10.0,
  },
  {
    type: "photo-stat",
    kanji: "剣",
    heading: "One of Japan's three imperial treasures once hid here",
    body: "During the final days of World War Two, the sacred treasure of Atsuta Shrine — believed to be the legendary sword Kusanagi — was secretly moved here for safekeeping.",
    photoSrc: "photos/008_minashi/fact-3.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 12.0, // ナレーション10.3秒 + 余白
  },
];

export const defaultProps = {
  spotName: "Minashi Shrine",
  spotNameJa: "飛騨一宮水無神社",
  location: "Gifu, Japan",
  accentColor: "#9fc2c7", // 澄んだ水を意識した、淡いアクア系のブルー
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "水",
  mapRegionLabel: "GIFU, JAPAN",
  prefectureId: "21", // 岐阜県
  municipalityId: "21203", // 高山市
  hookText: "The shrine behind Japan's most famous anime love story hides an even older secret.",
  facts,
  twistHeading: "Some believe the imperial line itself began on this mountain.",
  twistBody: "A local oral tradition, passed down for generations and unrecognized by mainstream history, claims a lost \"Hida Dynasty\" once ruled from this very peak — centuries before Yamato, centuries before Izumo. Historians call it legend. The mountain keeps its silence.",
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
  jaSubtitles: {
    catchCopy: "『君の名は。』の裏にある神社。",
    hook: "日本一有名なアニメ映画の裏に、さらに古い秘密が隠れている。",
    facts: [
      "「水無（みなし）」と「宮水（みやみず）」——名前は鏡合わせ。『君の名は。』のモデルという説がある。",
      "位山は、日本海と太平洋、二つの海を分ける分水嶺。",
      "戦時中、熱田神宮の神器・草薙剣は、密かにここへ避難させられていた。",
    ],
    twist: "正史には残されていない土地の伝承は語る。ヤマトより前、出雲より前、幻の「飛騨王朝」がこの山から国を治めていた、と。",
  },
  catchCopy: "THE SHRINE BEHIND YOUR NAME.",
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 8,
};
