import React from "react";
import { AbsoluteFill, Audio, staticFile, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { GradedPhoto } from "./GradedPhoto";
import { SceneFrame } from "./SceneFrame";
import { TextHeroScene } from "./TextHeroScene";
import { FactScene, FactProps } from "./FactScene";
import { BigNumberScene, BigNumberProps } from "./BigNumberScene";
import { QuoteScene, QuoteProps } from "./QuoteScene";
import { MapScene } from "./MapScene";

type PhotoStatFact = { type: "photo-stat"; narrationSrc?: string; durationSeconds?: number } & Omit<FactProps, "factNumber" | "totalFacts" | "accentColor" | "narrationSrc">;
type BigNumberFact = { type: "big-number"; narrationSrc?: string; durationSeconds?: number } & Omit<BigNumberProps, "factNumber" | "totalFacts" | "accentColor" | "narrationSrc">;
type QuoteFact = { type: "quote"; narrationSrc?: string; durationSeconds?: number } & Omit<QuoteProps, "factNumber" | "totalFacts" | "accentColor" | "narrationSrc">;
type TextHeroFact = {
  type: "text-hero";
  heading: string;
  subheading?: string;
  tagline?: string;
  body?: string;
  kanji?: string;
  narrationSrc?: string;
  durationSeconds?: number;
};

export type FactInput = PhotoStatFact | BigNumberFact | QuoteFact | TextHeroFact;

type NarrationMap = {
  title?: string;
  map?: string;
  hook?: string;
  twist?: string;
  outro?: string;
};

type SceneDurations = {
  title?: number;
  map?: number;
  hook?: number;
  twist?: number;
  outro?: number;
};

type Props = {
  spotName: string;
  spotNameJa: string;
  location: string;
  accentColor: string;
  heroPhotoSrc: string;
  kanjiMotif: string;
  mapRegionLabel: string;
  prefectureId: string;
  hookText: string;
  facts: FactInput[];
  twistHeading: string;
  twistBody: string;
  narration?: NarrationMap; // 各シーンのナレーション音声(public/からの相対パス)。無ければ無音
  sceneDurations?: SceneDurations; // ナレーションの実測秒数に合わせた尺の上書き(秒単位)。無ければ既定値
  bgmSrc?: string;  // 動画全体に流すBGM(public/からの相対パス)。無ければ無音
  bgmVolume?: number; // BGMの音量(0〜1)。デフォルト0.12(ナレーションの邪魔をしない程度に控えめ)
};

const FPS = 30;
const PANEL_TOP = 260;

// BGMを動画全体に流す。冒頭1秒・末尾1秒でフェードイン/アウトする
const BgmTrack: React.FC<{ src: string; baseVolume: number }> = ({ src, baseVolume }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const fadeFrames = fps; // 1秒
  const volume = interpolate(
    frame,
    [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
    [0, baseVolume, baseVolume, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <Audio src={staticFile(src)} volume={volume} />;
};
const PANEL_LEFT = 90;
const PANEL_SIZE = 900;
const GAP = 6;
const PANEL_W = (PANEL_SIZE - GAP * 2) / 3;
const PANEL_BOTTOM = PANEL_TOP + PANEL_SIZE;

// --- Scene: タイトルカード ---
const TitleScene: React.FC<Props> = ({ spotName, spotNameJa, location, accentColor, heroPhotoSrc, kanjiMotif, narration }) => {
  const frame = useCurrentFrame();
  const panelOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [15, 35], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vjpOpacity = interpolate(frame, [20, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const jaChars = spotNameJa.split("");

  return (
    <SceneFrame accentColor={accentColor} cornerLabel="DEEP DIVE" cornerSubLabel="NO. 001" footerLeft="Japan Deep Dive" footerRight="deepdive.jp" kanji={kanjiMotif} narrationSrc={narration?.title}>
      <div style={{ position: "absolute", top: PANEL_TOP, left: PANEL_LEFT, width: PANEL_SIZE, height: PANEL_SIZE, opacity: panelOpacity, display: "flex", gap: GAP }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: PANEL_W, height: PANEL_SIZE, overflow: "hidden", position: "relative" }}>
            <GradedPhoto src={heroPhotoSrc} style={{ width: PANEL_SIZE, height: PANEL_SIZE, position: "absolute", left: -i * (PANEL_W + GAP) }} />
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: PANEL_TOP - (jaChars.length * 45) / 2,
          right: 135,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#d8d2c4",
          fontFamily: "'Noto Serif CJK JP', 'Noto Serif JP', serif",
          fontSize: 30,
          lineHeight: 1.5,
          opacity: vjpOpacity,
        }}
      >
        {jaChars.map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>

      <div style={{ position: "absolute", top: PANEL_BOTTOM - 100, left: 90, right: 90, transform: `translateY(${titleY}px)`, opacity: titleOpacity }}>
        <div style={{ color: accentColor, fontSize: 24, letterSpacing: 10, marginBottom: 20, fontFamily: "'Liberation Serif', serif", fontStyle: "italic" }}>
          Deep Dive
        </div>
        <div style={{ color: "#f5f2eb", fontSize: 96, fontWeight: 900, lineHeight: 0.98, fontFamily: "'DejaVu Sans', sans-serif" }}>
          {spotName}
        </div>
        <div style={{ width: 90, height: 1, background: "#6b6255", margin: "40px 0" }} />
        <div style={{ color: accentColor, fontSize: 22, letterSpacing: 6, fontFamily: "'Liberation Serif', serif", fontStyle: "italic" }}>
          {location}
        </div>
      </div>
    </SceneFrame>
  );
};

// --- Scene: フック ---
const HookScene: React.FC<Props> = ({ hookText, accentColor, kanjiMotif, narration }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <SceneFrame accentColor={accentColor} cornerLabel="DEEP DIVE" cornerSubLabel="NO. 001" footerLeft="Japan Deep Dive" footerRight="HOOK" narrationSrc={narration?.hook} kanji={kanjiMotif}>
      <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", padding: "0 100px" }}>
        <div style={{ textAlign: "center", opacity }}>
          <div style={{ color: accentColor, fontSize: 20, letterSpacing: 8, marginBottom: 24, fontFamily: "'Liberation Serif', serif", fontStyle: "italic" }}>
            MOST VISITORS MISS THIS
          </div>
          <div style={{ width: 60, height: 1, background: "#4a453d", margin: "0 auto 28px" }} />
          <div style={{ color: "#f5f2eb", fontSize: 48, fontWeight: 900, lineHeight: 1.3, fontFamily: "'DejaVu Sans', sans-serif" }}>
            {hookText}
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};

// --- Scene: どんでん返し(写真無し、漢字の透かし付きのテキストヒーロー型) ---
const TwistScene: React.FC<Props> = ({ twistHeading, twistBody, accentColor, kanjiMotif, narration }) => {
  return (
    <SceneFrame accentColor={accentColor} cornerLabel="DEEP DIVE" cornerSubLabel="THE TWIST" footerLeft="Japan Deep Dive" footerRight="TWIST" kanji={kanjiMotif} narrationSrc={narration?.twist}>
      <TextHeroScene
        eyebrow="Here's the twist"
        heading={twistHeading}
        tagline={undefined}
        accentColor={accentColor}
      />
      <div style={{ position: "absolute", top: "58%", left: 90, right: 90 }}>
        <div style={{ color: "#9a9285", fontSize: 24, lineHeight: 1.7, fontFamily: "'Liberation Serif', serif", fontStyle: "italic", maxWidth: 820 }}>
          {twistBody}
        </div>
      </div>
    </SceneFrame>
  );
};

// --- Scene: 締め ---
const OutroScene: React.FC<Props> = ({ spotName, accentColor, kanjiMotif, narration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 14 } });
  return (
    <SceneFrame accentColor={accentColor} cornerLabel="DEEP DIVE" cornerSubLabel="NO. 001" footerLeft="Japan Deep Dive" footerRight="END" narrationSrc={narration?.outro} kanji={kanjiMotif}>
      <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
          <div style={{ color: "#f5f2eb", fontSize: 40, fontWeight: 700, fontFamily: "'DejaVu Sans', sans-serif" }}>
            Worth the visit?
          </div>
          <div style={{ color: accentColor, fontSize: 40, fontWeight: 700, fontFamily: "'DejaVu Sans', sans-serif" }}>
            Absolutely.
          </div>
          <div style={{ width: 60, height: 1, background: "#4a453d", margin: "28px auto" }} />
          <div style={{ color: "#9a9285", fontSize: 22, fontFamily: "'Liberation Serif', serif", fontStyle: "italic" }}>
            {spotName} — Deep Dive series
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};

const renderFact = (fact: FactInput, index: number, total: number, accentColor: string) => {
  const factNumber = index + 1;
  switch (fact.type) {
    case "photo-stat": {
      const { type, ...rest } = fact;
      return <FactScene {...rest} factNumber={factNumber} totalFacts={total} accentColor={accentColor} />;
    }
    case "big-number": {
      const { type, ...rest } = fact;
      return <BigNumberScene {...rest} factNumber={factNumber} totalFacts={total} accentColor={accentColor} />;
    }
    case "quote": {
      const { type, ...rest } = fact;
      return <QuoteScene {...rest} factNumber={factNumber} totalFacts={total} accentColor={accentColor} />;
    }
    case "text-hero": {
      return (
        <SceneFrame
          accentColor={accentColor}
          cornerLabel={`FACT ${String(factNumber).padStart(2, "0")}`}
          footerLeft="Japan Deep Dive"
          footerRight={`${String(factNumber).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}
          kanji={fact.kanji}
          narrationSrc={fact.narrationSrc}
        >
          <TextHeroScene
            eyebrow={`Fact ${String(factNumber).padStart(2, "0")}`}
            heading={fact.heading}
            subheading={fact.subheading}
            tagline={fact.tagline}
            accentColor={accentColor}
          />
          {fact.body && (
            <div style={{ position: "absolute", top: "60%", left: 90, right: 90 }}>
              <div style={{ color: "#9a9285", fontSize: 24, lineHeight: 1.7, fontFamily: "'Liberation Serif', serif", fontStyle: "italic", maxWidth: 820 }}>
                {fact.body}
              </div>
            </div>
          )}
        </SceneFrame>
      );
    }
  }
};

export const DeepDive: React.FC<Props> = (props) => {
  const { facts, accentColor, spotName, mapRegionLabel, prefectureId, sceneDurations, bgmSrc, bgmVolume = 0.12 } = props;

  // ナレーションの実測秒数(sceneDurations)があればそれを優先し、無ければ既定値を使う
  const TITLE_DUR = Math.round((sceneDurations?.title ?? 6) * FPS);
  const MAP_DUR = Math.round((sceneDurations?.map ?? 6) * FPS);
  const HOOK_DUR = Math.round((sceneDurations?.hook ?? 5) * FPS);
  const TWIST_DUR = Math.round((sceneDurations?.twist ?? 8) * FPS);
  const OUTRO_DUR = Math.round((sceneDurations?.outro ?? 6) * FPS);

  // Factも同様に、durationSecondsの指定があればそれを優先
  const factDuration = (fact: FactInput) => {
    if (fact.durationSeconds) return Math.round(fact.durationSeconds * FPS);
    switch (fact.type) {
      case "photo-stat":
        return 11 * FPS;
      case "big-number":
        return 7 * FPS;
      case "quote":
        return 6 * FPS;
      case "text-hero":
        return 8 * FPS;
    }
  };

  let cursor = 0;
  const titleFrom = cursor; cursor += TITLE_DUR;
  const mapFrom = cursor; cursor += MAP_DUR;
  const hookFrom = cursor; cursor += HOOK_DUR;
  const factFroms: number[] = [];
  const factDurs: number[] = [];
  facts.forEach((fact) => {
    const d = factDuration(fact);
    factFroms.push(cursor);
    factDurs.push(d);
    cursor += d;
  });
  const twistFrom = cursor; cursor += TWIST_DUR;
  const outroFrom = cursor; cursor += OUTRO_DUR;

  return (
    <AbsoluteFill>
      {bgmSrc && <BgmTrack src={bgmSrc} baseVolume={bgmVolume} />}
      <Sequence from={titleFrom} durationInFrames={TITLE_DUR}>
        <TitleScene {...props} />
      </Sequence>
      <Sequence from={mapFrom} durationInFrames={MAP_DUR}>
        <MapScene prefectureId={prefectureId} regionLabel={mapRegionLabel} spotLabel={spotName} accentColor={accentColor} narrationSrc={props.narration?.map} />
      </Sequence>
      <Sequence from={hookFrom} durationInFrames={HOOK_DUR}>
        <HookScene {...props} />
      </Sequence>
      {facts.map((fact, i) => (
        <Sequence key={i} from={factFroms[i]} durationInFrames={factDurs[i]}>
          {renderFact(fact, i, facts.length, accentColor)}
        </Sequence>
      ))}
      <Sequence from={twistFrom} durationInFrames={TWIST_DUR}>
        <TwistScene {...props} />
      </Sequence>
      <Sequence from={outroFrom} durationInFrames={OUTRO_DUR}>
        <OutroScene {...props} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const getTotalDuration = (facts: FactInput[], sceneDurations?: SceneDurations) => {
  const factTotal = facts.reduce((sum, fact) => {
    if (fact.durationSeconds) return sum + Math.round(fact.durationSeconds * FPS);
    switch (fact.type) {
      case "photo-stat":
        return sum + 11 * FPS;
      case "big-number":
        return sum + 7 * FPS;
      case "quote":
        return sum + 6 * FPS;
      case "text-hero":
        return sum + 8 * FPS;
    }
  }, 0);
  const title = Math.round((sceneDurations?.title ?? 6) * FPS);
  const map = Math.round((sceneDurations?.map ?? 6) * FPS);
  const hook = Math.round((sceneDurations?.hook ?? 5) * FPS);
  const twist = Math.round((sceneDurations?.twist ?? 8) * FPS);
  const outro = Math.round((sceneDurations?.outro ?? 6) * FPS);
  return title + map + hook + factTotal + twist + outro;
};
