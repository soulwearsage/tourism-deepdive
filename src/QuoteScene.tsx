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
  visual?: "cross" | "pyramid"; // 任意のビジュアル演出
};

// 線が少しずつ描かれるピラミッド+内部の通路・玄室のSVG
const PyramidVisual: React.FC<{ frame: number; accentColor: string }> = ({ frame, accentColor }) => {
  const baseProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const leftProgress = interpolate(frame, [8, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rightProgress = interpolate(frame, [8, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // 内部の通路・玄室は、外形が描き終わってから、じわっと浮かび上がる
  const innerOpacity = interpolate(frame, [30, 50], [0, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glow = interpolate(frame % 90, [0, 45, 90], [0.1, 0.28, 0.1]);

  const apex = { x: 90, y: 0 };
  const baseL = { x: 0, y: 150 };
  const baseR = { x: 180, y: 150 };

  return (
    <svg width="180" height="150" viewBox="0 0 180 150" style={{ overflow: "visible" }}>
      <polygon points={`${apex.x},${apex.y} ${baseL.x},${baseL.y} ${baseR.x},${baseR.y}`} fill={accentColor} opacity={glow * 0.15} />

      <g opacity={innerOpacity}>
        <line x1={70} y1={150} x2={95} y2={70} stroke={accentColor} strokeWidth="1.4" strokeDasharray="4 3" />
        <rect x={82} y={55} width={20} height={16} fill="none" stroke={accentColor} strokeWidth="1.6" />
      </g>

      <line
        x1={baseL.x}
        y1={baseL.y}
        x2={baseL.x + (baseR.x - baseL.x) * baseProgress}
        y2={baseL.y}
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1={apex.x}
        y1={apex.y}
        x2={apex.x - (apex.x - baseL.x) * leftProgress}
        y2={apex.y + (baseL.y - apex.y) * leftProgress}
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1={apex.x}
        y1={apex.y}
        x2={apex.x + (baseR.x - apex.x) * rightProgress}
        y2={apex.y + (baseR.y - apex.y) * rightProgress}
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
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
  const textStart = visual ? 38 : 0; // ビジュアルがある場合は少し遅らせて出す
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
        {visual === "pyramid" && (
          <div style={{ marginBottom: 44 }}>
            <PyramidVisual frame={frame} accentColor={accentColor} />
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
