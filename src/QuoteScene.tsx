import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { SceneFrame } from "./SceneFrame";

export type QuoteProps = {
  factNumber: number;
  totalFacts: number;
  quote: string;
  caption?: string;
  narrationSrc?: string;
  accentColor: string;
};

export const QuoteScene: React.FC<QuoteProps> = ({
  factNumber,
  totalFacts,
  quote,
  caption,
  narrationSrc,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 25], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const captionOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneFrame
      accentColor={accentColor}
      cornerLabel={`FACT ${String(factNumber).padStart(2, "0")}`}
      footerLeft="Japan Deep Dive"
      footerRight={`${String(factNumber).padStart(2, "0")} / ${String(totalFacts).padStart(2, "0")}`}
      narrationSrc={narrationSrc}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 100px",
        }}
      >
        <div style={{ textAlign: "center", opacity, transform: `translateY(${y}px)` }}>
          <div
            style={{
              fontFamily: "'Liberation Serif', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 46,
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
