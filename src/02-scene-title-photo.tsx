import React from "react";
import { Audio, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { GradedPhoto } from "./GradedPhoto";
import { SceneFrame } from "./SceneFrame";
import { StaggeredText } from "./StaggeredText";
import { specialGothicExpandedFont } from "./fonts";

const PANEL_TOP = 260;
const PANEL_LEFT = 90;
const PANEL_SIZE = 900;
const GAP = 6;
const PANEL_W = (PANEL_SIZE - GAP * 2) / 3;
const PANEL_BOTTOM = PANEL_TOP + PANEL_SIZE;

export type TitleSceneProps = {
  spotName: string;
  spotNameJa: string;
  location: string;
  accentColor: string;
  heroPhotoSrc: string;
  narrationSrc?: string;
  episodeNumber: number;
  introSfx?: string;
  catchCopy?: string;
  jaSubtitle?: string;
};

export const TitleScene: React.FC<TitleSceneProps> = ({
  spotName,
  spotNameJa,
  location,
  accentColor,
  heroPhotoSrc,
  narrationSrc,
  episodeNumber,
  introSfx,
  catchCopy,
  jaSubtitle,
}) => {
  const frame = useCurrentFrame();
  const panelOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [15, 35], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vjpOpacity = interpolate(frame, [20, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kenBurnsScale = interpolate(frame, [0, 30, 200], [1.28, 1, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const jaChars = spotNameJa.split("");

  return (
    <SceneFrame accentColor={accentColor} cornerLabel="DEEP DIVE" cornerSubLabel={`NO. ${String(episodeNumber).padStart(3, "0")}`} footerLeft="Japan Deep Dive" footerRight="deepdive.jp" narrationSrc={narrationSrc} narrationDelayFrames={introSfx && !catchCopy ? 140 : 0} jaSubtitle={jaSubtitle}>
      {introSfx && !catchCopy && <Audio src={staticFile(introSfx)} volume={0.18} />}
      <div style={{ position: "absolute", top: PANEL_TOP, left: PANEL_LEFT, width: PANEL_SIZE, height: PANEL_SIZE, opacity: panelOpacity, overflow: "hidden" }}>
        <div style={{ display: "flex", gap: GAP, width: "100%", height: "100%", transform: `scale(${kenBurnsScale})`, transformOrigin: "center center" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: PANEL_W, height: PANEL_SIZE, overflow: "hidden", position: "relative" }}>
              <GradedPhoto src={heroPhotoSrc} style={{ width: PANEL_SIZE, height: PANEL_SIZE, position: "absolute", left: -i * (PANEL_W + GAP) }} />
            </div>
          ))}
        </div>
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
        <div style={{ color: "#f5f2eb", fontSize: 96, fontWeight: 700, lineHeight: 0.98, fontFamily: specialGothicExpandedFont }}>
          <StaggeredText text={spotName} frame={frame} startFrame={15} staggerFrames={4} />
        </div>
        <div style={{ width: 90, height: 1, background: "#6b6255", margin: "40px 0" }} />
        <div style={{ color: accentColor, fontSize: 22, letterSpacing: 6, fontFamily: "'Liberation Serif', serif", fontStyle: "italic" }}>
          {location}
        </div>
      </div>
    </SceneFrame>
  );
};
