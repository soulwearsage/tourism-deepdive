import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { SceneFrame } from "./SceneFrame";

export type BigNumberProps = {
  factNumber: number;
  totalFacts: number;
  value: string;
  label: string;
  kanji?: string;
  narrationSrc?: string;
  accentColor: string;
};

export const BigNumberScene: React.FC<BigNumberProps> = ({
  factNumber,
  totalFacts,
  value,
  label,
  kanji,
  narrationSrc,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 11, mass: 0.7 } });
  const labelOpacity = interpolate(frame, [15, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  let displayValue = value;
  if (match) {
    const [, prefix, numStr, suffix] = match;
    const target = parseInt(numStr.replace(/,/g, ""), 10);
    const progress = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 45 });
    const current = Math.floor(interpolate(progress, [0, 1], [0, target]));
    displayValue = `${prefix}${current.toLocaleString()}${suffix}`;
  }

  return (
    <SceneFrame
      accentColor={accentColor}
      cornerLabel={`FACT ${String(factNumber).padStart(2, "0")}`}
      footerLeft="Japan Deep Dive"
      footerRight={`${String(factNumber).padStart(2, "0")} / ${String(totalFacts).padStart(2, "0")}`}
      kanji={kanji}
      narrationSrc={narrationSrc}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 90px",
        }}
      >
        <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
          <div
            style={{
              fontFamily: "'DejaVu Sans', sans-serif",
              fontWeight: 900,
              fontSize: 128,
              color: accentColor,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {displayValue}
          </div>
          <div
            style={{
              fontFamily: "'Liberation Serif', serif",
              fontStyle: "italic",
              fontSize: 26,
              color: "#9a9285",
              marginTop: 24,
              opacity: labelOpacity,
              maxWidth: 700,
            }}
          >
            {label}
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
