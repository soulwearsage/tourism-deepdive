import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { specialGothicExpandedFont } from "./fonts";
import { KagomeVisual } from "./QuoteScene";

// OutroScene から呼ばれる 伊根専用アウトロ。
// 001-fushimi-inari.ts の CrossVisual/QuoteScene と同一レイアウト・アニメーションロジック。
// パスの形状のみ十字→籠目紋に変更し、それ以外は QuoteScene(visual="cross") と完全に同じ構成。

// KagomeVisual の描画完了は frame 58。QuoteScene が "cross" 完了(frame ~34)の直後 38 でテキストを出すのと
// 同じ比率で、籠目紋は完了後 7 フレームあけて 65 から出す。
const TEXT_START = 65;

export const KagomeOutroContent: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();

  // QuoteScene の textStart-based フェードインと完全に同じロジック
  const quoteOpacity = interpolate(frame, [TEXT_START, TEXT_START + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const quoteY = interpolate(frame, [TEXT_START, TEXT_START + 25], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const captionOpacity = interpolate(frame, [TEXT_START + 20, TEXT_START + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // "Follow for hidden Japan." — 通常 OutroScene の taglineOpacity(frame 65-85)と同じ相対タイミング
  const taglineOpacity = interpolate(frame, [TEXT_START + 65, TEXT_START + 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
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
      {/* QuoteScene の CrossVisual と同じ位置・余白で KagomeVisual を配置 */}
      <div style={{ marginBottom: 44 }}>
        <KagomeVisual frame={frame} accentColor={accentColor} />
      </div>

      {/* 以下 QuoteScene の quote + caption レンダリングと完全に同一 */}
      <div style={{ textAlign: "center", opacity: quoteOpacity, transform: `translateY(${quoteY}px)` }}>
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
          Kono Shrine — the legendary 'former Ise,' said to be where Ise Grand Shrine's deity once resided before moving south.
        </div>
        <div
          style={{
            marginTop: 28,
            color: accentColor,
            fontFamily: "'Noto Serif CJK JP', 'Noto Serif JP', serif",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: 4,
            opacity: captionOpacity,
          }}
        >
          元伊勢 籠神社
        </div>
      </div>

      {/* 定番アウトロタグライン — 通常 OutroScene と同一スタイル */}
      <div
        style={{
          marginTop: 44,
          color: accentColor,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 3,
          fontFamily: specialGothicExpandedFont,
          opacity: taglineOpacity,
        }}
      >
        Follow for hidden Japan.
      </div>
    </div>
  );
};
