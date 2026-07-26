import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { SceneFrame } from "./SceneFrame";

export type QuoteProps = {
  factNumber: number;
  totalFacts: number;
  quote: string;
  caption?: string;
  kanji?: string;
  narrationSrc?: string;
  accentColor: string;
  visual?: "cross"; // 任意のビジュアル演出(現在は十字架のみ対応)
};

// 線が少しずつ描かれる十字架のSVG
const CrossVisual: React.FC<{ frame: number; accentColor: string }> = ({ frame, accentColor }) => {
  const vProgress = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const hProgress = interpolate(frame, [16, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const glow = interpolate(frame % 90, [0, 45, 90], [0.15, 0.35, 0.15]);

  // 縦棒: 高さ160、横棒: 幅110(縦棒の上から1/3の位置)
  const vHeight = 160;
  const hWidth = 110;
  const vTop = 0;
  const hTop = 50;

  return (
    <svg width="160" height={vHeight} viewBox={`0 0 160 ${vHeight}`} style={{ overflow: "visible" }}>
      {/* うっすら光る後光 */}
      <line x1="80" y1={vTop} x2="80" y2={vHeight} stroke={accentColor} strokeWidth="10" opacity={glow} strokeLinecap="round" />
      {/* 縦棒(上から下へ描かれる) */}
      <line
        x1="80"
        y1={vTop}
        x2="80"
        y2={vTop + vHeight * vProgress}
        stroke={accentColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* 横棒(中心から左右に描かれる) */}
      <line
        x1={80 - (hWidth / 2) * hProgress}
        y1={hTop}
        x2={80 + (hWidth / 2) * hProgress}
        y2={hTop}
        stroke={accentColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const QuoteScene: React.FC<QuoteProps> = ({
  factNumber,
  totalFacts,
  quote,
  caption,
  kanji,
  narrationSrc,
  accentColor,
  visual,
}) => {
  const frame = useCurrentFrame();
  const textStart = visual === "cross" ? 38 : 0; // ビジュアルがある場合は少し遅らせて出す
  const opacity = interpolate(frame, [textStart, textStart + 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame, [textStart, textStart + 25], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const captionOpacity = interpolate(frame, [textStart + 20, textStart + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneFrame
      accentColor={accentColor}
      cornerLabel={`FACT ${String(factNumber).padStart(2, "0")}`}
      footerLeft="Japan Deep Dive"
      footerRight={`${String(factNumber).padStart(2, "0")} / ${String(totalFacts).padStart(2, "0")}`}
      narrationSrc={narrationSrc}
      kanji={kanji}
      kanjiOpacity={0.16}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 100px",
        }}
      >
        {visual === "cross" && (
          <div style={{ marginBottom: 44 }}>
            <CrossVisual frame={frame} accentColor={accentColor} />
          </div>
        )}

        <div style={{ textAlign: "center", opacity, transform: `translateY(${y}px)` }}>
          <div
            style={{
              fontFamily: "'Liberation Serif', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 42,
              color: "#f5f2eb",
              lineHeight: 1.4,
            }}
          >
            {quote}
          </div>
          {caption && (
            <div
              style={{
                marginTop: 28,
                color: accentColor,
                fontFamily: "'DejaVu Sans', sans-serif",
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: 4,
                opacity: captionOpacity,
              }}
            >
              {caption}
            </div>
          )}
        </div>
      </div>
    </SceneFrame>
  );
};
