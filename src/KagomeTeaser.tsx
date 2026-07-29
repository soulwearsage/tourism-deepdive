import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { KagomeVisual } from "./QuoteScene";

// TwistScene の直後に挿入される籠目紋専用シーン(DeepDive.tsx の KagomeTeaserScene から呼ばれる)。
// "Follow for hidden Japan." は含まない — その後の標準 OutroScene で表示する。
// QuoteScene(visual="cross") と同一内部レイアウト。パスの形状のみ十字→籠目紋。

const TEXT_START = 65; // KagomeVisual 描画完了(frame 58)直後

export const KagomeOutroContent: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();

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
      {/* QuoteScene の CrossVisual と同位置・同余白 */}
      <div style={{ marginBottom: 44 }}>
        <KagomeVisual frame={frame} accentColor={accentColor} size={280} />
      </div>

      {/* QuoteScene の quote + caption と同一レイアウト */}
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
    </div>
  );
};
