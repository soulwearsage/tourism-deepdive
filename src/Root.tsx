import React from "react";
import { Composition } from "remotion";
import { DeepDive, getTotalDuration, FactInput } from "./DeepDive";
import { specialGothicExpandedFont } from "./fonts";

const HERO_PHOTO = "photos/001_fushimi-inari/hero.png";
const AUDIO_DIR = "audio/001_fushimi-inari";

// 実測したナレーションの長さ(秒)+2.5秒の余白。
// 60秒の広告収益化ラインを維持しつつ、ナレーションの実際の長さに尺を合わせている
const sceneDurations = {
  title: 3.5, // ナレーション0.8秒 + 余白
  map: 4.5,   // ナレーション1.4秒 + 余白(ズーム演出の尺を確保するため他より多めに)
  hook: 7.0,  // ナレーション4.4秒 + 余白
  twist: 13.0, // ナレーション10.8秒 + 余白
  outro: 4.5,  // ナレーション1.8秒 + 余白
};

const facts: FactInput[] = [
  {
    type: "photo-stat",
    kanji: "塚",
    heading: "Thousands of shrines that shouldn't exist",
    statValue: "~10,000",
    statLabel: "private shrines carved into this mountain since the 1870s",
    body: "Each stone bears a deity name found in no official record — unrecognized beliefs, hiding in plain sight, disguised as Inari worship.",
    photoSrc: "photos/001_fushimi-inari/fact-1.png",
    narrationSrc: `${AUDIO_DIR}/fact-1.mp3`,
    durationSeconds: 13, // 仮。ナレーション作り直し後にmeasure-narration.jsで再計測すること
  },
  {
    type: "big-number",
    kanji: "宇",
    value: "5",
    label: "kami enshrined as one, led by Ukanomitama — the spirit of rice and food itself",
    narrationSrc: `${AUDIO_DIR}/fact-3.mp3`,
    durationSeconds: 8.0, // ナレーション5.6秒 + 余白
  },
  {
    type: "photo-stat",
    kanji: "狐",
    heading: "The foxes aren't the gods",
    body: "They're messengers. Look closely — each one carries something different in its mouth: a rice sheaf, a key, a jewel, or a scroll.",
    photoSrc: "photos/001_fushimi-inari/fact-4.png",
    photoGradeIntensity: 0.35, // Midjourney側で既にティールが強いので弱めに
    verticalText: "宇迦之御魂大神",
    headingFont: specialGothicExpandedFont,
    narrationSrc: `${AUDIO_DIR}/fact-4.mp3`,
    durationSeconds: 11.0, // ナレーション8.6秒 + 余白
  },
  {
    type: "quote",
    quote: "There's a fringe theory: that \"Inari\" hides an echo of \"INRI\" — the words on Christ's cross, smuggled here by the shrine's founding clan. Historians call it wordplay. The legend refuses to die.",
    caption: "FRINGE THEORY — NOT HISTORY",
    kanji: "十",
    visual: "cross",
    narrationSrc: `${AUDIO_DIR}/fact-2.mp3`,
    durationSeconds: 15, // ナレーション11.8秒 + 十字架の演出分(約1.3秒) + 余白
  },
];

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="DeepDive"
        component={DeepDive}
        durationInFrames={getTotalDuration(facts, sceneDurations)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          spotName: "Fushimi Inari Taisha",
          spotNameJa: "伏見稲荷大社",
          location: "Kyoto, Japan",
          accentColor: "#c9a86a",
          heroPhotoSrc: HERO_PHOTO,
          kanjiMotif: "祈",
          mapRegionLabel: "KYOTO, JAPAN",
          prefectureId: "26", // 京都府
          hookText: "9 out of 10 visitors never learn who they're actually praying to.",
          facts,
          twistHeading: "The real shrine has no walls.",
          twistBody: "The sacred object isn't inside any building — it's Mt. Inari itself. The torii don't lead to the shrine. They ARE the shrine.",
          narration: {
            title: `${AUDIO_DIR}/title.mp3`,
            map: `${AUDIO_DIR}/map.mp3`,
            hook: `${AUDIO_DIR}/hook.mp3`,
            twist: `${AUDIO_DIR}/twist.mp3`,
            outro: `${AUDIO_DIR}/outro.mp3`,
          },
          sceneDurations,
          bgmSrc: "bgm/bgm001.wav",
          bgmVolume: 0.12,
        }}
      />
    </>
  );
};
