import { FactInput } from "../DeepDive";
import { specialGothicExpandedFont } from "../fonts";

const HERO_PHOTO = "photos/001_fushimi-inari/hero.png";
const AUDIO_DIR = "audio/001_fushimi-inari";

// 実測したナレーションの長さ(秒)+2.5秒の余白。
// 60秒の広告収益化ラインを維持しつつ、ナレーションの実際の長さに尺を合わせている
export const sceneDurations = {
  title: 2.8,
  map: 4.2,
  hook: 6.0, // ナレーション4.4秒 + 余白を詰めた
  twist: 12.0, // ナレーション10.7秒 + 余白を詰めた
  outro: 4.5,
};

export const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "塚",
    heading: "10,000 secret shrines are hiding here",
    statValue: "~10,000",
    statLabel: "private shrines carved into this mountain since the 1870s",
    body: "Each stone bears a deity name found in no official record — unrecognized beliefs, hiding in plain sight, disguised as INARI worship.",
    photoSrc: "photos/001_fushimi-inari/fact-1.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 15.5, // ナレーション14.2秒 + 余白を詰めた
  },
  {
    type: "big-number",
    kanji: "宇",
    value: "5",
    label: "kami enshrined as one, led by UKANOMITAMA — the spirit of rice and food itself",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 7.0, // ナレーション5.6秒 + 余白を詰めた
  },
  {
    type: "photo-stat",
    kanji: "狐",
    heading: "The foxes were never gods",
    body: "They're messengers. Look closely — each one carries something different in its mouth: a rice sheaf, a key, a jewel, or a scroll.",
    photoSrc: "photos/001_fushimi-inari/fact-4.png",
    photoSfx: "bgm/camera.mp3",
    photoGradeIntensity: 0.35,
    verticalText: "宇迦之御魂大神",
    headingFont: specialGothicExpandedFont,
    narrationSrc: `${AUDIO_DIR}/fact-4.mp3`,
    durationSeconds: 9.5, // ナレーション8.5秒 + 余白を詰めた
  },
  {
    type: "quote",
    quote: "There's a fringe theory: that \"INARI\" hides an echo of \"INRI\" — the words on CHRIST's cross, smuggled here by the shrine's founding clan. Historians call it wordplay. The legend refuses to die.",
    caption: "FRINGE THEORY — NOT HISTORY",
    kanji: "十",
    visual: "cross",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 14, // ナレーション11.8秒 + 十字架の演出分 + 余白を詰めた
  },
];

export const defaultProps = {
  spotName: "Fushimi Inari Taisha",
  spotNameJa: "伏見稲荷大社",
  location: "Kyoto, Japan",
  accentColor: "#c9a86a",
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "祈",
  mapRegionLabel: "KYOTO, JAPAN",
  prefectureId: "26", // 京都府
  municipalityId: "26100", // 京都市
  hookText: "9 out of 10 visitors never learn who they're actually praying to.",
  facts,
  twistHeading: "The real shrine has no walls.",
  twistBody: "The sacred object isn't inside any building — it's Mt. INARI itself. The torii don't lead to the shrine. They ARE the shrine.",
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
    catchCopy: "一万の、名もなき神々。",
    hook: "訪れる人の九割は、自分が誰に祈っているのか知らないまま帰っていく。",
    facts: [
      "山には、一万に及ぶお塚が刻まれている。稲荷信仰の名を借りた、名もなき信仰の痕跡。",
      "十字架の「INRI」と「稲荷」——秦氏の渡来にまつわる、都市伝説めいた符合。",
      "祀られる神は五柱。主神は、宇迦之御魂大神。",
      "狐は神そのものではない。鍵と玉、そして巻物を運ぶ、神の使いだ。",
    ],
    twist: "この神社に、壁はない。ご神体は、稲荷山そのもの。鳥居は参道ではない。鳥居こそが、神域なのだ。",
  },
  catchCopy: "10,000 UNKNOWN GODS.",
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 1,
};
