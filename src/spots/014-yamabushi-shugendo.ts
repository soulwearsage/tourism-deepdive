import { FactInput } from "../DeepDive";

const HERO_PHOTO = "photos/014_yamabushi-shugendo/hero.png";
const AUDIO_DIR = "audio/014_yamabushi-shugendo";

// ※秒数は暫定値。ナレーション生成後にmeasure-narration-yamabushi-shugendo.jsで実測し、正確な値に差し替えること
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
    kanji: "道",
    heading: "A path that refused to choose",
    body: "This is Shugendo — founded by En no Gyoja in the 7th century. Long before Shinto and Buddhism were forced apart, Shugendo refused to choose between them. It embraced both as one path to the sacred.",
    photoSrc: "photos/014_yamabushi-shugendo/fact-1.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 11.0, // 仮値。measure-narration実行後に実測値へ差し替え
  },
  {
    type: "photo-stat",
    kanji: "生",
    heading: "Hanging between life and death",
    body: "Shugendo's most sacred ritual is called Nozoki. Practitioners are suspended headfirst over a cliff. Hanging between heaven and earth, they confess their sins. When pulled back — they are no longer the same person.",
    photoSrc: "photos/014_yamabushi-shugendo/fact-2.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 11.0, // 仮値。measure-narration実行後に実測値へ差し替え
  },
  {
    type: "photo-stat",
    kanji: "禁",
    heading: "The government that banned a faith",
    body: "In 1868, the Meiji government separated Shinto and Buddhism. Four years later, Shugendo was banned entirely — erased by the same nation that once feared the mountains it worshipped.",
    photoSrc: "photos/014_yamabushi-shugendo/fact-3.png",
    photoSfx: "bgm/camera.mp3",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 11.0, // 仮値。measure-narration実行後に実測値へ差し替え
  }
];

export const defaultProps = {
  spotName: "Yamabushi-shugendo",
  spotNameJa: "山伏・修験道",
  location: "Japan",
  accentColor: "#3b3528",
  heroPhotoSrc: HERO_PHOTO,
  kanjiMotif: "",
  mapRegionLabel: "JAPAN",
  prefectureId: "",
  municipalityId: "",
  hookText: "Before entering the mountain, the ascetics put on white burial robes. They enter — as the dead.",
  facts,
  twistHeading: "The Mountain Knows Why",
  twistBody: "The ban lasted over seventy years — lifted only after the Japanese Empire collapsed in 1945. Shugendo survived, hidden in the same mountains the government tried to silence. But the real question is this: why would a government ban a faith that teaches people to die — and come back? Because a person who has already faced death on the mountain cannot be controlled. That is what the Meiji state truly feared. Not the gods. Not the mountains. The people who returned from them.",
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
  catchCopy: "Beyond death, people are reborn.",
  outroBgmSrc: "bgm/outro_bgm.mp3",
  episodeNumber: 14,
  jaSubtitles: {
    catchCopy: "死を越えて、人は生まれ変わる。",
    hook: "山へ入る前、\n修行者たちは白い死装束を身にまとう。\n彼らはもはや、生者ではない。\n──死者として、山へ入る。",
    facts: [
      "これが修験道。\n7世紀、役小角が開いた道。\n神道と仏教が引き裂かれる、はるか以前。\n修験道は、どちらかを選ぶことを拒んだ。",
      "「のぞき」と呼ばれる儀式がある。\n崖の縁から、頭を下に吊り下げられる。\n罪を告白し、引き上げられた時──\n山に入った者は、もう別の存在だ。",
      "1868年、すべてが変わった。\n明治政府は神仏を分けた。\nそして4年後、\n修験道は禁じられた。",
    ],
    twist: "禁止は70年以上続いた。\n帝国が滅んだ1945年まで。\n問いは残る──\n死を恐れぬ者を、国家はなぜ恐れたのか。",
  },
  twistFacts: [
    {
      type: "photo-stat" as const,
      kanji: "解",
      heading: "Why ban a religion — unless you fear what it teaches?",
      body: "The ban lasted over seventy years — lifted only after the Japanese Empire collapsed in 1945. Shugendo survived, hidden in the same mountains the government tried to silence. But the real question is this: why would a government ban a faith that teaches people to die — and come back? Because a person who has already faced death on the mountain cannot be controlled. That is what the Meiji state truly feared. Not the gods. Not the mountains. The people who returned from them.", // ※手動でtwistBodyと分割すること
      photoSrc: "photos/014_yamabushi-shugendo/hero.png",
      photoSfx: "bgm/camera.mp3",
      narrationSrc: `${AUDIO_DIR}/twist-2.mp3`,
      durationSeconds: 11.0, // 仮値。measure-narration実行後に差し替え
    },
  ],
};
