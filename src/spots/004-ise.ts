import { FactInput } from "../DeepDive";

const HERO_PHOTO = "photos/004_ise/hero.png";
const AUDIO_DIR = "audio/004_ise";

// ※秒数は暫定値。ナレーション生成後にmeasure-narration-ise.jsで実測し、正確な値に差し替えること
export const sceneDurations = {
  title: 3.2,
  map: 4.5,
  hook: 6.5, // ナレーション4.6秒 + 余白
  twist: 19.5, // ナレーション17.9秒 + 余白
  outro: 4.5,
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "社",
    heading: "One name, 125 shrines",
    statValue: "2,000+",
    verticalText: "天照大御神",
    statLabel: "years of history behind the inner and outer shrines at the heart of it all",
    body: "The inner shrine honors the sun goddess AMATERASU. The outer shrine honors TOYOUKE, goddess of food. Together with 123 more, they're simply called Jingu.",
    photoSrc: "photos/004_ise/fact-1.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 16.0, // ナレーション14.5秒 + 余白
  },
  {
    type: "big-number",
    kanji: "遷",
    value: "62",
    label: "times this entire shrine has been torn down and rebuilt from scratch since 690 AD — every building, every 20 years",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 12.5, // ナレーション11.2秒 + 余白
  },
  {
    type: "photo-stat",
    kanji: "陽",
    heading: "She might not have started as a goddess",
    body: "Ancient records suggest this sun deity was originally male — a theory, not confirmed history — until a reigning empress may have remade the sun in her own image.",
    photoSrc: "photos/004_ise/fact-3.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 15.0, // ナレーション13.5秒 + 余白
  },
];

export const defaultProps = {
  spotName: "Ise Jingu",
  spotNameJa: "伊勢神宮",
  location: "Mie, Japan",
  accentColor: "#9fae8f", // 神域の杉の森を意識した、落ち着いたセージグリーン
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "宮",
  mapRegionLabel: "MIE, JAPAN",
  prefectureId: "24", // 三重県
  municipalityId: "24203", // 伊勢市
  hookText: "The goddess enshrined here might not have started out as a goddess at all.",
  facts,
  twistHeading: "For 1,200 years, the emperors stayed away.",
  twistBody: "Their own ancestral goddess is enshrined here — yet no reigning emperor visited. A ritual proxy took their place, and the journey itself was nearly impossible. It took a modern empire, in 1869, to finally end the silence.",
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
  jaSubtitles: {
    catchCopy: "六十二回、建て替えられてきた。",
    hook: "ここに祀られる神は、最初から女神だったとは限らない。",
    facts: [
      "125の宮社からなり、内宮には天照大御神、外宮には豊受大御神。2000年を超える歴史を持つ。",
      "式年遷宮は、690年から数えて62回。社殿は、幾度も生まれ変わってきた。",
      "アマテラスは、本来男神だったという説がある。それが女神とされたのは、女帝・持統天皇の時代だったという。",
    ],
    twist: "千二百年の間、在位中の天皇は一度もここを訪れなかった。代わりに参拝したのは、儀式の代理人。その沈黙を破ったのは、1869年、明治の時代だった。",
  },
  catchCopy: "REBUILT 62 TIMES.",
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 4,
};
