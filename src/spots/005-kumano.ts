import { FactInput } from "../DeepDive";

const HERO_PHOTO = "photos/005_kumano/hero.png";
const AUDIO_DIR = "audio/005_kumano";

// ※秒数は暫定値。ナレーション生成後にmeasure-narration-kumano.jsで実測し、正確な値に差し替えること
export const sceneDurations = {
  title: 4.0,
  map: 5.0,
  hook: 7.0,
  twist: 24.5, // ナレーション23秒 + 余白
  outro: 4.5,
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "斎",
    heading: "Japan's largest torii marks a shrine that's gone",
    statValue: "34m",
    statLabel: "tall — standing where the original shrine complex once stood, before a flood destroyed most of it in 1889",
    body: "Only four of the original twelve shrine buildings survived. They were moved to where the shrine stands today.",
    photoSrc: HERO_PHOTO,
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 17.5, // ナレーション16.1秒 + 余白
  },
  {
    type: "big-number",
    kanji: "総",
    value: "4,700+",
    label: "shrines across Japan trace back to this single site — making it the head shrine of all Kumano worship",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 10.5,
  },
  {
    type: "photo-stat",
    kanji: "導",
    heading: "A three-legged crow guided Japan's first emperor",
    body: "Its three legs are said to represent heaven, earth, and humanity. Today, that same crow is the emblem of Japan's national football team.",
    photoSrc: "photos/005_kumano/fact-3.png",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 13.0, // ナレーション11.3秒 + 余白
  },
];

export const defaultProps = {
  spotName: "Kumano Hongu Taisha",
  spotNameJa: "熊野本宮大社",
  location: "Wakayama, Japan",
  accentColor: "#a8845c", // 古代からの杉・檜の森を意識した、木質の温かみのあるブラウン
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "烏",
  mapRegionLabel: "WAKAYAMA, JAPAN",
  prefectureId: "30", // 和歌山県
  municipalityId: "30206", // 田辺市
  hookText: "At one of Japan's holiest shrines, nobody is certain who they're actually praying to.",
  facts,
  twistHeading: "No one is certain who they're worshipping.",
  twistBody: "This region is called Kii — \"Land of Trees\" — after a myth of the god Susanoo scattering tree seeds here. The word \"Kumano\" itself means \"the hidden place,\" where the spirits of the dead were once believed to gather. Sun god. Water god. Tree god. After a thousand years, historians still don't agree on who's really enshrined here.",
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
  episodeNumber: 5,
};
