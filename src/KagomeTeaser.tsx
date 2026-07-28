import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { specialGothicExpandedFont } from "./fonts";

// 籠目紋 (hexagram) — 400×400 viewBox, circumradius R=170
const CX = 200, CY = 200, R = 170;
const SQ3H = R * Math.sqrt(3) / 2; // ≈ 147.2

// Triangle 1 vertices (pointing up)
const TOP: [number, number] = [CX,        CY - R      ]; // (200, 30)
const BR:  [number, number] = [CX + SQ3H, CY + R / 2  ]; // (347.2, 285)
const BL:  [number, number] = [CX - SQ3H, CY + R / 2  ]; // (52.8, 285)

// Triangle 2 vertices (pointing down)
const TR:  [number, number] = [CX + SQ3H, CY - R / 2  ]; // (347.2, 115)
const BOT: [number, number] = [CX,        CY + R       ]; // (200, 370)
const TL:  [number, number] = [CX - SQ3H, CY - R / 2  ]; // (52.8, 115)

const lerp = (a: [number, number], b: [number, number], t: number): [number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];

const opt = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.out(Easing.cubic) };

// CrossVisual スタイルで線が一本ずつ描かれる籠目紋
// 三角1・三角2 を交互に描くことで、両者が同時に現れる自然な演出になる
export const KagomeVisual: React.FC<{ frame: number; accentColor: string }> = ({ frame, accentColor }) => {
  // 6本の辺を2本ずつ交互に描く (各辺20フレーム、計58フレームで完成)
  const p1 = interpolate(frame, [0,  20], [0, 1], opt); // tri1: TOP → BR
  const p4 = interpolate(frame, [6,  26], [0, 1], opt); // tri2: TR  → BOT
  const p2 = interpolate(frame, [16, 36], [0, 1], opt); // tri1: BR  → BL
  const p5 = interpolate(frame, [22, 42], [0, 1], opt); // tri2: BOT → TL
  const p3 = interpolate(frame, [32, 52], [0, 1], opt); // tri1: BL  → TOP
  const p6 = interpolate(frame, [38, 58], [0, 1], opt); // tri2: TL  → TR

  // 描画完了後にじわっと光る後光
  const glow = interpolate(frame, [55, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    * interpolate(frame % 90, [0, 45, 90], [0.12, 0.32, 0.12]);

  // 描画完了後に三角形の内側がうっすら光る
  const fillOpacity = interpolate(frame, [58, 78], [0, 0.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const strokeW = 2.8;
  const glowW = 10;

  const line = (a: [number, number], b: [number, number], p: number) => {
    const [x2, y2] = lerp(a, b, p);
    return { x1: a[0], y1: a[1], x2, y2 };
  };

  const segments: Array<{ a: [number, number]; b: [number, number]; p: number }> = [
    { a: TOP, b: BR,  p: p1 },
    { a: BR,  b: BL,  p: p2 },
    { a: BL,  b: TOP, p: p3 },
    { a: TR,  b: BOT, p: p4 },
    { a: BOT, b: TL,  p: p5 },
    { a: TL,  b: TR,  p: p6 },
  ];

  return (
    <svg width="400" height="400" viewBox="0 0 400 400" style={{ overflow: "visible" }}>
      {/* 三角形の内側の薄い光 */}
      <polygon
        points={`${TOP[0]},${TOP[1]} ${BR[0]},${BR[1]} ${BL[0]},${BL[1]}`}
        fill={accentColor}
        fillOpacity={fillOpacity}
        stroke="none"
      />
      <polygon
        points={`${TR[0]},${TR[1]} ${BOT[0]},${BOT[1]} ${TL[0]},${TL[1]}`}
        fill={accentColor}
        fillOpacity={fillOpacity}
        stroke="none"
      />

      {/* 後光(ぼんやり光るレイヤー、完成後に浮かぶ) */}
      {segments.map(({ a, b, p }, i) => {
        const { x1, y1, x2, y2 } = line(a, b, p);
        return <line key={`g${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accentColor} strokeWidth={glowW} opacity={glow} strokeLinecap="round" />;
      })}

      {/* 本線 — 1本ずつ描かれる */}
      {segments.map(({ a, b, p }, i) => {
        const { x1, y1, x2, y2 } = line(a, b, p);
        return <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accentColor} strokeWidth={strokeW} strokeLinecap="round" />;
      })}
    </svg>
  );
};

// OutroScene から呼ばれるコンテンツブロック
export const KagomeOutroContent: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();

  const shrineOpacity = interpolate(frame, [80, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [130, 155], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 80px",
      }}
    >
      {/* 籠目紋 */}
      <KagomeVisual frame={frame} accentColor={accentColor} />

      {/* 元伊勢 籠神社 */}
      <div style={{ marginTop: 48, textAlign: "center", opacity: shrineOpacity }}>
        <div
          style={{
            color: accentColor,
            fontSize: 24,
            letterSpacing: 10,
            fontFamily: "'Noto Serif CJK JP', 'Noto Serif JP', serif",
            marginBottom: 10,
          }}
        >
          元伊勢
        </div>
        <div
          style={{
            color: "#f5f2eb",
            fontSize: 52,
            fontWeight: 700,
            fontFamily: "'Noto Serif CJK JP', 'Noto Serif JP', serif",
            letterSpacing: 6,
          }}
        >
          籠神社
        </div>
      </div>

      {/* The mystery isn't over yet. */}
      <div
        style={{
          marginTop: 52,
          textAlign: "center",
          opacity: taglineOpacity,
        }}
      >
        <div style={{ width: 60, height: 1, background: "#4a453d", margin: "0 auto 32px" }} />
        <div
          style={{
            color: "#f5f2eb",
            fontSize: 36,
            fontWeight: 900,
            fontFamily: specialGothicExpandedFont,
            lineHeight: 1.3,
          }}
        >
          The mystery isn't over yet.
        </div>
      </div>
    </div>
  );
};
