import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { wdxlLubrifontJPNFont } from "./fonts";

export const JaSubtitleBar: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 145,
        left: 0,
        right: 0,
        padding: "0 90px",
        textAlign: "center",
        fontFamily: wdxlLubrifontJPNFont,
        fontSize: 30,
        fontWeight: 400,
        color: "#f5f2eb",
        textShadow: "0 2px 10px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,1)",
        lineHeight: 1.6,
        opacity,
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
};
