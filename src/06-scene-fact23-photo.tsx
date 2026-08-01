import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing, Audio, staticFile } from "remotion";
import { GradedPhoto } from "./GradedPhoto";
import { SceneFrame } from "./SceneFrame";
import { StaggeredText } from "./StaggeredText";
import { specialGothicExpandedFont } from "./fonts";

export type Fact23PhotoProps = {
  factNumber: number;
  totalFacts: number;
  kanji: string;
  heading: string;
  statValue?: string;
  statLabel?: string;
  body: string;
  photoSrc: string;
  photoGradeIntensity?: number;
  verticalText?: string;
  headingFont?: string;
  photoSfx?: string;
  narrationSrc?: string;
  accentColor?: string;
  cornerLabel?: string;
  footerRight?: string;
};

const AC_DEFAULT = "#c9a86a";

const PANEL_TOP = 260;
const PANEL_LEFT = 90;
const PANEL_SIZE = 900;
const GAP = 6;
const PANEL_W = (PANEL_SIZE - GAP * 2) / 3;
const PANEL_BOTTOM = PANEL_TOP + PANEL_SIZE;

export const Fact23PhotoScene: React.FC<Fact23PhotoProps> = ({
  factNumber,
  totalFacts,
  kanji,
  heading,
  statValue,
  statLabel,
  body,
  photoSrc,
  photoGradeIntensity = 1,
  verticalText,
  headingFont,
  photoSfx,
  narrationSrc,
  accentColor = AC_DEFAULT,
  cornerLabel,
  footerRight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 右から滑り込む(04は左から: [-40, 0]、06は右から: [40, 0])
  const panelX = interpolate(frame, [0, 20], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // Ken Burns: transform-origin を right にして左方向へ緩やかにパン
  const kenBurnsScale = interpolate(frame, [0, 400], [1.1, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headingY = interpolate(frame, [15, 35], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headingOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bodyY = interpolate(frame, [38, 58], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bodyOpacity = interpolate(frame, [38, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const numericMatch = statValue?.match(/[\d,]+/);
  const numericTarget = numericMatch ? parseInt(numericMatch[0].replace(/,/g, ""), 10) : null;
  const countProgress = spring({ frame: frame - 40, fps, config: { damping: 200 }, durationInFrames: 40 });
  const countValue = numericTarget ? Math.floor(interpolate(countProgress, [0, 1], [0, numericTarget])) : null;
  const displayStat =
    numericTarget && statValue ? statValue.replace(/[\d,]+/, countValue!.toLocaleString()) : statValue;

  return (
    <SceneFrame
      accentColor={accentColor}
      narrationSrc={narrationSrc}
      cornerLabel={cornerLabel ?? `FACT ${String(factNumber).padStart(2, "0")}`}
      footerLeft="Japan Deep Dive"
      footerRight={footerRight ?? `${String(factNumber).padStart(2, "0")} / ${String(totalFacts).padStart(2, "0")}`}
    >
      {photoSfx && <Audio src={staticFile(photoSfx)} volume={0.15} />}
      <div
        style={{
          position: "absolute",
          top: PANEL_TOP,
          left: PANEL_LEFT + panelX,
          width: PANEL_SIZE,
          height: PANEL_SIZE,
          opacity: panelOpacity,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: GAP,
            width: "100%",
            height: "100%",
            transform: `scale(${kenBurnsScale})`,
            transformOrigin: "center right",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: PANEL_W, height: PANEL_SIZE, overflow: "hidden", position: "relative" }}>
              <GradedPhoto
                src={photoSrc}
                intensity={photoGradeIntensity}
                style={{ width: PANEL_SIZE, height: PANEL_SIZE, position: "absolute", left: -i * (PANEL_W + GAP) }}
              />
            </div>
          ))}
        </div>
      </div>

      {verticalText && (
        <div
          style={{
            position: "absolute",
            top: PANEL_TOP - (verticalText.length * 45) / 2,
            left: 135,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#d8d2c4",
            fontFamily: "'Noto Serif CJK JP', 'Noto Serif JP', serif",
            fontSize: 30,
            lineHeight: 1.5,
          }}
        >
          {verticalText.split("").map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </div>
      )}

      {/* 見出し・統計・本文: 右揃え */}
      <div
        style={{
          position: "absolute",
          top: PANEL_BOTTOM - 100,
          left: 90,
          right: 90,
          textAlign: "right",
        }}
      >
        <div style={{ transform: `translateY(${headingY}px)`, opacity: headingOpacity }}>
          <div style={{ fontFamily: headingFont ?? specialGothicExpandedFont, fontWeight: 900, fontSize: 68, color: "#f5f2eb", lineHeight: 1.05 }}>
            <StaggeredText text={heading} frame={frame} startFrame={12} />
          </div>
        </div>

        <div style={{ transform: `translateY(${bodyY}px)`, opacity: bodyOpacity }}>
          {displayStat && (
            <div style={{ marginTop: 32 }}>
              <div style={{ fontFamily: specialGothicExpandedFont, fontWeight: 900, fontSize: 60, color: accentColor }}>
                {displayStat}
              </div>
              {statLabel && (
                <div style={{ fontFamily: "'Liberation Serif', serif", fontStyle: "italic", fontSize: 23, color: "#9a9285", marginTop: 6 }}>
                  {statLabel}
                </div>
              )}
            </div>
          )}

          <div style={{ width: "100%", height: 1, background: "#4a453d", marginTop: 44, marginBottom: 30 }} />

          <div style={{ fontFamily: "'Liberation Serif', serif", fontStyle: "italic", fontSize: 25, color: "#8a8478", lineHeight: 1.75 }}>
            {body}
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
