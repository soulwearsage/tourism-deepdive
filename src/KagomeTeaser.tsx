import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { specialGothicExpandedFont } from "./fonts";

// 籠目紋 geometry — hexagram centered at (CX, CY) with circumradius R
const CX = 540;
const CY = 800;
const R = 200;
const SQ3H = R * Math.sqrt(3) / 2; // half-side length ≈ 173.2

// Triangle 1: pointing up (vertices at top, bottom-right, bottom-left)
const TRI1 = `M ${CX} ${CY - R} L ${CX + SQ3H} ${CY + R / 2} L ${CX - SQ3H} ${CY + R / 2} Z`;
// Triangle 2: pointing down (vertices at top-right, bottom, top-left)
const TRI2 = `M ${CX + SQ3H} ${CY - R / 2} L ${CX} ${CY + R} L ${CX - SQ3H} ${CY - R / 2} Z`;
const TRI_PERIM = 3 * R * Math.sqrt(3); // ≈ 1039

// Inner hexagon at intersections of the two triangles
const R_IN = R / Math.sqrt(3); // circumradius of inner hexagon ≈ 115.5
const HEX_PTS = Array.from({ length: 6 }, (_, i) => {
  const a = (i * Math.PI) / 3;
  return [CX + R_IN * Math.cos(a), CY - R_IN * Math.sin(a)];
});
const HEX_PATH = `M ${HEX_PTS[0][0]} ${HEX_PTS[0][1]} ${HEX_PTS.slice(1).map(p => `L ${p[0]} ${p[1]}`).join(" ")} Z`;
const HEX_PERIM = 6 * R_IN; // ≈ 693

// Pine forest silhouette for 天橋立 — row of triangular pine crowns
const BASE_Y = 1640;
const PINE_TREES: { x: number; tip: number; halfW: number }[] = [
  { x: 40,  tip: 1490, halfW: 30 },
  { x: 95,  tip: 1440, halfW: 34 },
  { x: 155, tip: 1400, halfW: 36 },
  { x: 215, tip: 1365, halfW: 36 },
  { x: 278, tip: 1335, halfW: 38 },
  { x: 338, tip: 1310, halfW: 40 },
  { x: 400, tip: 1325, halfW: 38 },
  { x: 462, tip: 1295, halfW: 40 },
  { x: 524, tip: 1265, halfW: 42 },
  { x: 578, tip: 1245, halfW: 44 }, // tallest, near center
  { x: 638, tip: 1262, halfW: 42 },
  { x: 700, tip: 1285, halfW: 40 },
  { x: 760, tip: 1308, halfW: 38 },
  { x: 820, tip: 1335, halfW: 38 },
  { x: 882, tip: 1370, halfW: 36 },
  { x: 940, tip: 1415, halfW: 34 },
  { x: 995, tip: 1455, halfW: 32 },
  { x: 1048, tip: 1498, halfW: 30 },
];
const PINE_PATH = (() => {
  let d = `M 0 1920 L 0 ${BASE_Y}`;
  for (const t of PINE_TREES) {
    d += ` L ${t.x - t.halfW} ${BASE_Y} L ${t.x} ${t.tip} L ${t.x + t.halfW} ${BASE_Y}`;
  }
  return d + ` L 1080 ${BASE_Y} L 1080 1920 Z`;
})();

// Scene timing (frames at 30fps)
const T = {
  DRAW_START:   20,
  DRAW_END:    155,
  HEX_START:   148,
  HEX_END:     195,
  FILL_START:  155,
  FILL_END:    180,
  GLOW_PEAK:   180,
  LABEL_IN:    175,
  LABEL_FULL:  210,
  DISSOLVE_START: 215,
  DISSOLVE_END:   270,
  TAGLINE_IN:  255,
  TAGLINE_FULL: 290,
};

export const KagomeTeaser: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();

  const triDashOffset = interpolate(frame, [T.DRAW_START, T.DRAW_END], [TRI_PERIM, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const hexDashOffset = interpolate(frame, [T.HEX_START, T.HEX_END], [HEX_PERIM, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Glow: flare at completion then settle
  const glow = interpolate(
    frame,
    [T.DRAW_END, T.GLOW_PEAK, T.GLOW_PEAK + 20, T.GLOW_PEAK + 60],
    [0, 32, 20, 14],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const fillOpacity = interpolate(frame, [T.FILL_START, T.FILL_END], [0, 0.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const kagomeGroupOpacity = interpolate(
    frame,
    [0, 15, T.DISSOLVE_START, T.DISSOLVE_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const labelOpacity = interpolate(
    frame,
    [T.LABEL_IN, T.LABEL_FULL, T.DISSOLVE_START, T.DISSOLVE_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const pineOpacity = interpolate(frame, [T.DISSOLVE_START, T.DISSOLVE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineOpacity = interpolate(frame, [T.TAGLINE_IN, T.TAGLINE_FULL], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#060c10" }}>

      {/* Kagome crest */}
      <svg
        width="1080"
        height="1920"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: kagomeGroupOpacity,
          filter: glow > 0 ? `drop-shadow(0 0 ${glow}px ${accentColor})` : undefined,
        }}
      >
        {/* Subtle fill inside each triangle */}
        <path d={TRI1} fill={accentColor} fillOpacity={fillOpacity} stroke="none" />
        <path d={TRI2} fill={accentColor} fillOpacity={fillOpacity} stroke="none" />

        {/* Animated triangle strokes */}
        <path
          d={TRI1}
          fill="none"
          stroke={accentColor}
          strokeWidth={2.2}
          strokeDasharray={TRI_PERIM}
          strokeDashoffset={triDashOffset}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={TRI2}
          fill="none"
          stroke={accentColor}
          strokeWidth={2.2}
          strokeDasharray={TRI_PERIM}
          strokeDashoffset={triDashOffset}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner hexagon — appears after both triangles are drawn */}
        <path
          d={HEX_PATH}
          fill="none"
          stroke={accentColor}
          strokeWidth={1.2}
          strokeDasharray={HEX_PERIM}
          strokeDashoffset={hexDashOffset}
          strokeLinecap="round"
          strokeOpacity={0.7}
        />
      </svg>

      {/* Shrine name */}
      <div
        style={{
          position: "absolute",
          top: CY + R + 90,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: labelOpacity,
        }}
      >
        <div
          style={{
            color: accentColor,
            fontSize: 22,
            letterSpacing: 10,
            fontFamily: "'Liberation Serif', serif",
            fontStyle: "italic",
            marginBottom: 14,
          }}
        >
          元伊勢
        </div>
        <div
          style={{
            color: "#f5f2eb",
            fontSize: 54,
            fontWeight: 900,
            fontFamily: specialGothicExpandedFont,
            letterSpacing: 6,
          }}
        >
          籠神社
        </div>
      </div>

      {/* 天橋立 pine forest silhouette */}
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", top: 0, left: 0, opacity: pineOpacity }}
      >
        <defs>
          <linearGradient id="kago-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#050d15" />
            <stop offset="65%"  stopColor="#0c1e2e" />
            <stop offset="100%" stopColor="#152638" />
          </linearGradient>
        </defs>
        {/* Night sky */}
        <rect x="0" y="0" width="1080" height="1920" fill="url(#kago-sky)" />
        {/* Horizon glow — suggests distant water / 天橋立湾 */}
        <ellipse cx="540" cy={BASE_Y} rx="620" ry="70" fill={accentColor} opacity="0.07" />
        {/* Pine silhouette */}
        <path d={PINE_PATH} fill="#030a0d" />
      </svg>

      {/* Final tagline */}
      <div
        style={{
          position: "absolute",
          top: 1310,
          left: 90,
          right: 90,
          textAlign: "center",
          opacity: taglineOpacity,
        }}
      >
        <div
          style={{
            color: "#f5f2eb",
            fontSize: 42,
            fontWeight: 900,
            fontFamily: specialGothicExpandedFont,
            lineHeight: 1.3,
          }}
        >
          The mystery isn't over yet.
        </div>
      </div>

    </AbsoluteFill>
  );
};
