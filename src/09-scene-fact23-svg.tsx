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
  visual?: "cross" | "pyramid" | "kagome" | "circle-split"; // 任意のビジュアル演出
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

// 線が少しずつ描かれる籠目紋(六芒星)のSVG — CrossVisualと同パターン
// 400×400 viewBox, 外接円半径R=170
const _CX = 200, _CY = 200, _R = 170;
const _SQ3H = _R * Math.sqrt(3) / 2;
const _TOP: [number, number] = [_CX,          _CY - _R       ];
const _BR:  [number, number] = [_CX + _SQ3H,  _CY + _R / 2   ];
const _BL:  [number, number] = [_CX - _SQ3H,  _CY + _R / 2   ];
const _TR:  [number, number] = [_CX + _SQ3H,  _CY - _R / 2   ];
const _BOT: [number, number] = [_CX,           _CY + _R       ];
const _TL:  [number, number] = [_CX - _SQ3H,  _CY - _R / 2   ];
const _lerp = (a: [number, number], b: [number, number], t: number): [number, number] => [
  a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t,
];

export const KagomeVisual: React.FC<{ frame: number; accentColor: string; size?: number }> = ({ frame, accentColor, size = 400 }) => {
  const eOpt = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.out(Easing.cubic) };
  // 三角1・三角2の辺を交互に描く (各辺20フレーム、計58フレームで完成)
  const p1 = interpolate(frame, [0,  20], [0, 1], eOpt); // tri1: TOP → BR
  const p4 = interpolate(frame, [6,  26], [0, 1], eOpt); // tri2: TR  → BOT
  const p2 = interpolate(frame, [16, 36], [0, 1], eOpt); // tri1: BR  → BL
  const p5 = interpolate(frame, [22, 42], [0, 1], eOpt); // tri2: BOT → TL
  const p3 = interpolate(frame, [32, 52], [0, 1], eOpt); // tri1: BL  → TOP
  const p6 = interpolate(frame, [38, 58], [0, 1], eOpt); // tri2: TL  → TR
  const glow = interpolate(frame, [55, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    * interpolate(frame % 90, [0, 45, 90], [0.12, 0.32, 0.12]);
  const fillOpacity = interpolate(frame, [58, 78], [0, 0.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const segs: Array<{ a: [number, number]; b: [number, number]; p: number }> = [
    { a: _TOP, b: _BR, p: p1 }, { a: _BR, b: _BL, p: p2 }, { a: _BL, b: _TOP, p: p3 },
    { a: _TR, b: _BOT, p: p4 }, { a: _BOT, b: _TL, p: p5 }, { a: _TL, b: _TR, p: p6 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" style={{ overflow: "visible" }}>
      <polygon points={`${_TOP[0]},${_TOP[1]} ${_BR[0]},${_BR[1]} ${_BL[0]},${_BL[1]}`} fill={accentColor} fillOpacity={fillOpacity} stroke="none" />
      <polygon points={`${_TR[0]},${_TR[1]} ${_BOT[0]},${_BOT[1]} ${_TL[0]},${_TL[1]}`} fill={accentColor} fillOpacity={fillOpacity} stroke="none" />
      {segs.map(({ a, b, p }, i) => { const [x2, y2] = _lerp(a, b, p); return <line key={`g${i}`} x1={a[0]} y1={a[1]} x2={x2} y2={y2} stroke={accentColor} strokeWidth={10} opacity={glow} strokeLinecap="round" />; })}
      {segs.map(({ a, b, p }, i) => { const [x2, y2] = _lerp(a, b, p); return <line key={`l${i}`} x1={a[0]} y1={a[1]} x2={x2} y2={y2} stroke={accentColor} strokeWidth={2.8} strokeLinecap="round" />; })}
    </svg>
  );
};

// 1つの円がフェードインして中央に現れ、左右2つの円に分かれていくアニメーション
const CircleSplitVisual: React.FC<{ frame: number; accentColor: string }> = ({ frame, accentColor }) => {
  const r = 38;
  const cx = 140, cy = 75;

  const singleOpacity = interpolate(frame, [0, 20, 40, 60], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const splitOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const splitOffset = interpolate(frame, [40, 85], [0, r * 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const glow = interpolate(frame % 90, [0, 45, 90], [0.12, 0.28, 0.12]);

  return (
    <svg width="280" height="150" viewBox="0 0 280 150" style={{ overflow: "visible" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={accentColor} strokeWidth={8} opacity={singleOpacity * glow} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={accentColor} strokeWidth={1.5} opacity={singleOpacity} />
      <circle cx={cx - splitOffset} cy={cy} r={r} fill="none" stroke={accentColor} strokeWidth={8} opacity={splitOpacity * glow} />
      <circle cx={cx - splitOffset} cy={cy} r={r} fill="none" stroke={accentColor} strokeWidth={1.5} opacity={splitOpacity} />
      <circle cx={cx + splitOffset} cy={cy} r={r} fill="none" stroke={accentColor} strokeWidth={8} opacity={splitOpacity * glow} />
      <circle cx={cx + splitOffset} cy={cy} r={r} fill="none" stroke={accentColor} strokeWidth={1.5} opacity={splitOpacity} />
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
      kanjiOpacity={0.10}
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
        {visual === "kagome" && (
          <div style={{ marginBottom: 44 }}>
            <KagomeVisual frame={frame} accentColor={accentColor} />
          </div>
        )}
        {visual === "circle-split" && (
          <div style={{ marginBottom: 44 }}>
            <CircleSplitVisual frame={frame} accentColor={accentColor} />
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
              whiteSpace: "pre-line",
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
