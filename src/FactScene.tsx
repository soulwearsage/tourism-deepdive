import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { GradedPhoto } from "./GradedPhoto";
import { SceneFrame } from "./SceneFrame";
import { StaggeredText } from "./StaggeredText";

export type FactProps = {
  factNumber: number;
  totalFacts: number;
  kanji: string;
  heading: string;
  statValue?: string;
  statLabel?: string;
  body: string;
  photoSrc: string;
  photoGradeIntensity?: number;
  verticalText?: string; // タイトルと同じ位置に出す縦書き(例: 祭神名)
  narrationSrc?: string;
  accentColor?: string;
};

const AC_DEFAULT = "#c9a86a";

// 写真パネル:900x900、3分割、下端(=260+900=1160)に見出しが重なる
const PANEL_TOP = 260;
const PANEL_LEFT = 90;
const PANEL_SIZE = 900;
const GAP = 6;
const PANEL_W = (PANEL_SIZE - GAP * 2) / 3;
const PANEL_BOTTOM = PANEL_TOP + PANEL_SIZE;

export const FactScene: React.FC<FactProps> = ({
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
  narrationSrc,
  accentColor = AC_DEFAULT,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const panelX = interpolate(frame, [0, 20], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // ケンバーンズ:シーンが続く間、写真をごくゆっくりズームさせて静止画に生きた質感を出す
  const kenBurnsScale = interpolate(frame, [0, 400], [1, 1.09], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headingY = interpolate(frame, [15, 35], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headingOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const numericMatch = statValue?.match(/[\d,]+/);
  const numericTarget = numericMatch ? parseInt(numericMatch[0].replace(/,/g, ""), 10) : null;
  const countProgress = spring({ frame: frame - 25, fps, config: { damping: 200 }, durationInFrames: 40 });
  const countValue = numericTarget ? Math.floor(interpolate(countProgress, [0, 1], [0, numericTarget])) : null;
  const displayStat =
    numericTarget && statValue ? statValue.replace(/[\d,]+/, countValue!.toLocaleString()) : statValue;

  return (
    <SceneFrame
      accentColor={accentColor}
      narrationSrc={narrationSrc}
      cornerLabel={`FACT ${String(factNumber).padStart(2, "0")}`}
      footerLeft="Japan Deep Dive"
      footerRight={`${String(factNumber).padStart(2, "0")} / ${String(totalFacts).padStart(2, "0")}`}
      kanji={kanji}
    >
      {/* 写真ブロック(3分割パネル+ケンバーンズのゆっくりズーム) */}
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
            transformOrigin: "center center",
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

      {/* 縦書きテキスト(祭神名など。写真の上端を跨ぐ位置に中心を合わせる) */}
      {verticalText && (
        <div
          style={{
            position: "absolute",
            top: PANEL_TOP - (verticalText.length * 45) / 2,
            right: 135,
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

      {/* 見出し・統計・本文(写真の下端と重なる位置) */}
      <div
        style={{
          position: "absolute",
          top: PANEL_BOTTOM - 100,
          left: 90,
          right: 90,
          transform: `translateY(${headingY}px)`,
          opacity: headingOpacity,
        }}
      >
        <div style={{ fontFamily: "'DejaVu Sans', sans-serif", fontWeight: 900, fontSize: 68, color: "#f5f2eb", lineHeight: 1.05 }}>
          <StaggeredText text={heading} frame={frame} startFrame={12} />
        </div>

        {displayStat && (
          <div style={{ marginTop: 32 }}>
            <div style={{ fontFamily: "'DejaVu Sans', sans-serif", fontWeight: 900, fontSize: 60, color: accentColor }}>
              {displayStat}
            </div>
            {statLabel && (
              <div style={{ fontFamily: "'Liberation Serif', serif", fontStyle: "italic", fontSize: 23, color: "#9a9285", marginTop: 6, maxWidth: 750 }}>
                {statLabel}
              </div>
            )}
          </div>
        )}

        <div style={{ width: "100%", height: 1, background: "#4a453d", marginTop: 44, marginBottom: 30 }} />

        <div style={{ fontFamily: "'Liberation Serif', serif", fontStyle: "italic", fontSize: 25, color: "#8a8478", lineHeight: 1.75, maxWidth: 820 }}>
          {body}
        </div>
      </div>
    </SceneFrame>
  );
};
